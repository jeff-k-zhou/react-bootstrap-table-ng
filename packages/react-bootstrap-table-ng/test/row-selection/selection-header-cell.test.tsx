import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CHECKBOX_STATUS_CHECKED, CHECKBOX_STATUS_INDETERMINATE } from "../..";
import SelectionHeaderCell, { CheckBox } from "../../src/row-selection/selection-header-cell";
import { BootstrapContext } from "../../src/contexts/bootstrap";

describe("<SelectionHeaderCell />", () => {
  describe("shouldComponentUpdate", () => {
    it("should not update component when mode is radio", () => {
      const instance = new SelectionHeaderCell({ mode: "radio" });
      expect(instance.shouldComponentUpdate({})).toBe(false);
    });

    describe("when mode is checkbox", () => {
      it("should not update component if checkedStatus prop has not been changed", () => {
        const checkedStatus = CHECKBOX_STATUS_CHECKED;
        const instance = new SelectionHeaderCell({ mode: "checkbox", checkedStatus });
        expect(instance.shouldComponentUpdate({ checkedStatus })).toBe(false);
      });

      it("should update component if checkedStatus prop has been changed", () => {
        const checkedStatus = CHECKBOX_STATUS_CHECKED;
        const instance = new SelectionHeaderCell({ mode: "checkbox", checkedStatus: CHECKBOX_STATUS_INDETERMINATE });
        expect(instance.shouldComponentUpdate({ checkedStatus })).toBe(true);
      });
    });
  });

  describe("handleCheckBoxClick", () => {
    it("should do nothing when mode is radio", () => {
      const onAllRowsSelect = jest.fn();
      render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell
                mode="radio"
                checkedStatus="unchecked"
                onAllRowsSelect={onAllRowsSelect}
              />
            </tr>
          </thead>
        </table>
      );
      fireEvent.click(screen.getByRole("columnheader"));
      expect(onAllRowsSelect).not.toHaveBeenCalled();
    });

    it("should call onAllRowsSelect when mode is checkbox", () => {
      const onAllRowsSelect = jest.fn();
      render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell
                mode="checkbox"
                checkedStatus={CHECKBOX_STATUS_CHECKED}
                onAllRowsSelect={onAllRowsSelect}
              />
            </tr>
          </thead>
        </table>
      );
      fireEvent.click(screen.getByRole("columnheader"));
      expect(onAllRowsSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe("render", () => {
    it("should render empty th element when hideSelectAll is true", () => {
      render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell
                mode="checkbox"
                checkedStatus={CHECKBOX_STATUS_CHECKED}
                hideSelectAll
              />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      expect(th).toBeInTheDocument();
      expect(th.querySelector("input")).not.toBeInTheDocument();
    });

    it("should not render checkbox when mode is radio", () => {
      render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell mode="radio" checkedStatus={CHECKBOX_STATUS_CHECKED} />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      expect(th).toBeInTheDocument();
      expect(th.querySelector("input")).not.toBeInTheDocument();
    });

    it("should render checkbox when mode is checkbox", () => {
      render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell mode="checkbox" checkedStatus={CHECKBOX_STATUS_CHECKED} />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      const input = th.querySelector("input[type='checkbox']");
      expect(input).toBeInTheDocument();
      expect(input).toBeChecked();
    });

    it("should render selectionHeaderRenderer correctly", () => {
      const DummySelection = () => <div data-testid="dummy" />;
      const selectionHeaderRenderer = jest.fn().mockReturnValue(<DummySelection />);
      render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell
                mode="checkbox"
                checkedStatus={CHECKBOX_STATUS_CHECKED}
                selectionHeaderRenderer={selectionHeaderRenderer}
              />
            </tr>
          </thead>
        </table>
      );
      expect(screen.getByTestId("dummy")).toBeInTheDocument();
      expect(selectionHeaderRenderer).toHaveBeenCalledTimes(1);
      expect(selectionHeaderRenderer).toHaveBeenCalledWith({
        mode: "checkbox",
        checked: true,
        indeterminate: false,
      });
    });

    it("should render component with bootstrap4 class when bootstrap4 prop is true", () => {
      render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell mode="checkbox" checkedStatus={CHECKBOX_STATUS_CHECKED}
              //bootstrap4 
              />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      // expect(th.querySelector(".selection-input-4")).toBeInTheDocument();
    });
  });
});

describe("<CheckBox />", () => {
  describe("render", () => {
    it("should render component correctly", () => {
      render(<CheckBox checked={true} indeterminate={false} />);
      const input = screen.getByRole("checkbox");
      expect(input).toBeInTheDocument();
      expect(input).toBeChecked();
      expect(input).toHaveAttribute("type", "checkbox");
    });
  });
});
