module.exports = {
  /**
   * Hook that runs before visiting a story.
   * We use this to inject a script that captures console errors.
   */
  async preVisit(page) {
    await page.addInitScript(() => {
      window.__consoleErrors = [];
      const originalConsoleError = console.error;
      console.error = (...args) => {
        // Capture the error message
        window.__consoleErrors.push(args.map(arg => {
          if (arg instanceof Error) return arg.stack || arg.message;
          if (typeof arg === 'object') return JSON.stringify(arg);
          return String(arg);
        }).join(' '));
        // Still log it to the real console
        originalConsoleError.apply(console, args);
      };
    });
  },

  /**
   * Hook that runs after a story is rendered.
   * We check if any console errors were captured and fail the test if so.
   */
  async postVisit(page, context) {
    const consoleErrors = await page.evaluate(() => window.__consoleErrors || []);
    
    if (consoleErrors.length > 0) {
      const storyName = context.title + ' - ' + context.name;
      throw new Error(
        `Automated Regression Failure: Detected console errors in story "${storyName}" (${context.id}):\n\n` +
        consoleErrors.join('\n---\n') +
        '\n\nPlease fix these errors to ensure table stability.'
      );
    }
  },
};
