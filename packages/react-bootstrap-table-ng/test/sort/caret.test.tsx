import { render } from "@testing-library/react";
import React from "react";

import { SORT_ASC, SORT_DESC } from "../..";
import SortCaret from "../../src/sort/caret";
import { BootstrapContext } from "../../src/contexts/bootstrap";

describe("SortCaret", () => {
  describe("when bootstrap4 context is false", () => {
    describe(`when order prop is ${SORT_ASC}`, () => {
      it("should render caret correctly", () => {
        const { container } = render(
          <BootstrapContext.Provider value={{ bootstrap4: false }}>
            <SortCaret order={SORT_ASC} />
          </BootstrapContext.Provider>
        );
        expect(container.getElementsByTagName("span").length).toBe(2);
        expect(container.getElementsByClassName("caret").length).toBe(1);
        expect(container.getElementsByClassName("dropup").length).toBe(1);
      });
    });

    describe(`when order prop is ${SORT_DESC}`, () => {
      it("should render caret correctly", () => {
        const { container } = render(
          <BootstrapContext.Provider value={{ bootstrap4: false }}>
            <SortCaret order={SORT_DESC} />
          </BootstrapContext.Provider>
        );
        expect(container.getElementsByTagName("span").length).toBe(2);
        expect(container.getElementsByClassName("caret").length).toBe(1);
        expect(container.getElementsByClassName("dropup").length).toBe(0);
      });
    });
  });

  describe("when bootstrap4 context is true", () => {
    describe(`when order prop is ${SORT_ASC}`, () => {
      it("should render caret correctly", () => {
        const { container } = render(
          <BootstrapContext.Provider value={{ bootstrap4: true }}>
            <SortCaret order={SORT_ASC} />
          </BootstrapContext.Provider>
        );
        expect(container.getElementsByTagName("span").length).toBe(1);
        expect(container.getElementsByClassName("caret-4-asc").length).toBe(1);
      });
    });

    describe(`when order prop is ${SORT_DESC}`, () => {
      it("should render caret correctly", () => {
        const { container } = render(
          <BootstrapContext.Provider value={{ bootstrap4: true }}>
            <SortCaret order={SORT_DESC} />
          </BootstrapContext.Provider>
        );
        expect(container.getElementsByTagName("span").length).toBe(1);
        expect(container.getElementsByClassName("caret-4-desc").length).toBe(1);
      });
    });
  });
});
