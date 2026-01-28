import { render } from "@testing-library/react";
import React from "react";

import SortSymbol from "../../src/sort/symbol";
import { BootstrapContext } from "../../src/contexts/bootstrap";

describe("SortSymbol", () => {
  describe("when bootstrap4 context is false", () => {
    it("should render sort symbol correctly", () => {
      const { container } = render(
        <BootstrapContext.Provider value={{ bootstrap4: false }}>
          <SortSymbol />
        </BootstrapContext.Provider>
      );
      expect(container.getElementsByClassName("order").length).toBe(1);
      expect(container.getElementsByClassName("caret").length).toBe(2);
      expect(container.getElementsByClassName("dropdown").length).toBe(1);
      expect(container.getElementsByClassName("dropup").length).toBe(1);
    });
  });

  describe("if bootstrap4 prop is true", () => {
    it("should render sort symbol correctly", () => {
      const { container } = render(
        <BootstrapContext.Provider value={{ bootstrap4: true }}>
          <SortSymbol />
        </BootstrapContext.Provider>
      );
      expect(container.getElementsByClassName("order-4").length).toBe(1);
    });
  });
});
