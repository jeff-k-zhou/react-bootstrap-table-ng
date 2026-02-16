import { spyOn } from "storybook/test";
import type { Preview } from "@storybook/react-webpack5";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: [
          "Configure your project",
          "Welcome",
          "Basic Table",
          "Bootstrap 4",
          "Bootstrap 5",
          "Work On Columns",
          "Work On Header Columns",
          "Column Filter",
          "Work On Rows",
          "Footer",
          "Sort Table",
          "Cell Editing",
          "Row Selection",
          "Row Expand",
          "Pagination",
          "Table Search",
          "Column Toggle",
          "Export CSV",
          "Table Overlay",
          "Remote",
          "Data",
        ],
      },
    },
  },
};

export default preview;

export const beforeEach = function beforeEach() {
  spyOn(console, "log").mockName("console.log");
  spyOn(console, "warn").mockName("console.warn");
  spyOn(console, "error").mockName("console.error");
  spyOn(console, "info").mockName("console.info");
  spyOn(console, "debug").mockName("console.debug");
  spyOn(console, "trace").mockName("console.trace");
  spyOn(console, "count").mockName("console.count");
  spyOn(console, "dir").mockName("console.dir");
  spyOn(console, "assert").mockName("console.assert");
};
