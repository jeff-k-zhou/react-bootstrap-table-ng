import { injectAxe, checkA11y } from 'axe-playwright';

import type { TestRunnerConfig } from '@storybook/test-runner';

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api-experimental
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);

    await page.addInitScript(() => {
      (window as any).__consoleErrors = [];
      const originalConsoleError = console.error;
      console.error = (...args) => {
        // Capture the error message
        (window as any).__consoleErrors.push(args.map(arg => {
          if (arg instanceof Error) return arg.stack || arg.message;
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg);
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' '));
        // Still log it to the real console
        originalConsoleError.apply(console, args);
      };
    });
  },
  async postVisit(page, context) {
    // Check for console errors
    const consoleErrors = await page.evaluate(() => (window as any).__consoleErrors || []);

    if (consoleErrors.length > 0) {
      const storyName = context.title + ' - ' + context.name;
      throw new Error(
        `Automated Regression Failure: Detected console errors in story "${storyName}" (${context.id}):\n\n` +
        consoleErrors.join('\n---\n') +
        '\n\nPlease fix these errors to ensure table stability.'
      );
    }

    // Check for accessibility violations
    try {
      await checkA11y(page, '#storybook-root', {
        verbose: false,
        detailedReport: true,
        detailedReportOptions: { html: true },
        axeOptions: {
          rules: {
            'color-contrast': { enabled: false },
            'tabindex': { enabled: false },
            'heading-order': { enabled: false }
          },
        },
      });
    } catch (error) {
      const violations = await page.evaluate(async () => {
        // @ts-ignore
        return await window.axe.run('#storybook-root', {
          rules: {
            'color-contrast': { enabled: false }
          }
        });
      });
      console.warn('Accessibility violations details:', JSON.stringify(violations.violations, null, 2));
      throw error;
    }
  },
};

export default config;
