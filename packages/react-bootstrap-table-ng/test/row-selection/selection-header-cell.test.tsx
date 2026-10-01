import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CHECKBOX_STATUS_CHECKED, CHECKBOX_STATUS_INDETERMINATE } from "../../src/const";
import SelectionHeaderCell, { CheckBox } from "../../src/row-selection/selection-header-cell";
import { BootstrapContext } from "../../src/contexts/bootstrap";

describe("<SelectionHeaderCell />", () => {

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
        <BootstrapContext.Provider value={{ bootstrap4: true }}>
          <table>
            <thead>
              <tr>
                <SelectionHeaderCell mode="checkbox" checkedStatus={CHECKBOX_STATUS_CHECKED}
                //bootstrap4 
              />
            </tr>
          </thead>
        </table>
        </BootstrapContext.Provider>
      );
      const th = screen.getByRole("columnheader");
      expect(th.querySelector(".selection-input-4")).toBeInTheDocument();
    });

    it("should render component with bootstrap5 class when bootstrap5 prop is true", () => {
      render(
        <BootstrapContext.Provider value={{ bootstrap5: true }}>
          <table>
            <thead>
              <tr>
                <SelectionHeaderCell mode="checkbox" checkedStatus={CHECKBOX_STATUS_CHECKED}
                //bootstrap5 
              />
            </tr>
          </thead>
        </table>
        </BootstrapContext.Provider>
      );
      const th = screen.getByRole("columnheader");
      expect(th.querySelector(".selection-input-5")).toBeInTheDocument();
    });

    it("should trigger onAllRowsSelect on Enter and Space keydown", () => {
      const onAllRowsSelect = jest.fn();
      render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell
                mode="checkbox"
                checkedStatus={CHECKBOX_STATUS_INDETERMINATE}
                onAllRowsSelect={onAllRowsSelect}
              />
            </tr>
          </thead>
        </table>
      );

      const th = screen.getByRole("columnheader");
      fireEvent.keyDown(th, { key: "Enter" });
      expect(onAllRowsSelect).toHaveBeenCalledTimes(1);
      expect(onAllRowsSelect).toHaveBeenCalledWith(expect.anything(), true);

      fireEvent.keyDown(th, { key: " " });
      expect(onAllRowsSelect).toHaveBeenCalledTimes(2);
    });

    it("should apply headerColumnStyle as function or object", () => {
      const styleFn = jest.fn().mockReturnValue({ width: "60px" });
      render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell
                mode="checkbox"
                checkedStatus={CHECKBOX_STATUS_CHECKED}
                headerColumnStyle={styleFn}
              />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      expect(th).toHaveStyle("width: 60px");
      expect(styleFn).toHaveBeenCalledWith(CHECKBOX_STATUS_CHECKED);
    });

    it("handles memo comparator for radio mode and checkbox mode", () => {
      // Radio mode returns true on memo
      const { rerender } = render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell mode="radio" />
            </tr>
          </thead>
        </table>
      );
      rerender(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell mode="radio" checkedStatus={CHECKBOX_STATUS_CHECKED} />
            </tr>
          </thead>
        </table>
      );

      // Checkbox mode identical props
      rerender(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell mode="checkbox" checkedStatus={CHECKBOX_STATUS_CHECKED} />
            </tr>
          </thead>
        </table>
      );
      rerender(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell mode="checkbox" checkedStatus={CHECKBOX_STATUS_CHECKED} />
            </tr>
          </thead>
        </table>
      );
    });

    it("should NOT call onAllRowsSelect when keydown key is not Enter or Space", () => {
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
      const th = screen.getByRole("columnheader");
      fireEvent.keyDown(th, { key: "Tab" });
      fireEvent.keyDown(th, { key: "Escape" });
      expect(onAllRowsSelect).not.toHaveBeenCalled();
    });

    it("should apply headerColumnStyle as plain object", () => {
      render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell
                mode="checkbox"
                checkedStatus={CHECKBOX_STATUS_CHECKED}
                headerColumnStyle={{ width: "50px" }}
              />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      expect(th).toHaveStyle("width: 50px");
    });

    it("should render with unchecked status (not checked, not indeterminate)", () => {
      render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell mode="checkbox" checkedStatus="unchecked" />
            </tr>
          </thead>
        </table>
      );
      const input = screen.getByRole("checkbox");
      expect(input).not.toBeChecked();
    });

    it("should trigger onClick for selectionHeaderRenderer mode", () => {
      const onAllRowsSelect = jest.fn();
      const selectionHeaderRenderer = jest.fn().mockReturnValue(<div>Custom</div>);
      render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell
                mode="radio"
                checkedStatus="unchecked"
                onAllRowsSelect={onAllRowsSelect}
                selectionHeaderRenderer={selectionHeaderRenderer}
              />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      fireEvent.click(th);
      expect(onAllRowsSelect).toHaveBeenCalledTimes(1);
    });

    it("handles memo comparison branches on rerender", () => {
      // 1. mode === "radio" always returns true
      const { rerender } = render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell mode="radio" checkedStatus="unchecked" />
            </tr>
          </thead>
        </table>
      );
      rerender(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell mode="radio" checkedStatus="checked" />
            </tr>
          </thead>
        </table>
      );

      // 2. mode === "checkbox", test differences
      const baseProps = {
        mode: "checkbox",
        checkedStatus: "unchecked",
        onAllRowsSelect: jest.fn(),
        hideSelectAll: false,
        selectionHeaderRenderer: undefined,
        headerColumnStyle: {},
      };

      const { rerender: rerenderCheckbox } = render(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell {...baseProps} />
            </tr>
          </thead>
        </table>
      );

      // Same props (returns true)
      rerenderCheckbox(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell {...baseProps} />
            </tr>
          </thead>
        </table>
      );

      // Different mode
      rerenderCheckbox(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell {...baseProps} mode="other" />
            </tr>
          </thead>
        </table>
      );

      // Different checkedStatus
      rerenderCheckbox(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell {...baseProps} checkedStatus="checked" />
            </tr>
          </thead>
        </table>
      );

      // Different onAllRowsSelect
      rerenderCheckbox(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell {...baseProps} onAllRowsSelect={jest.fn()} />
            </tr>
          </thead>
        </table>
      );

      // Different hideSelectAll
      rerenderCheckbox(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell {...baseProps} hideSelectAll={true} />
            </tr>
          </thead>
        </table>
      );

      // Different selectionHeaderRenderer
      rerenderCheckbox(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell {...baseProps} selectionHeaderRenderer={() => null} />
            </tr>
          </thead>
        </table>
      );

      // Different headerColumnStyle
      rerenderCheckbox(
        <table>
          <thead>
            <tr>
              <SelectionHeaderCell {...baseProps} headerColumnStyle={{ width: "100px" }} />
            </tr>
          </thead>
        </table>
      );
    });
  });
});

describe("<CheckBox />", () => {
  describe("render", () => {
    it("should render component correctly and handle onChange", () => {
      render(<CheckBox checked={true} indeterminate={false} />);
      const input = screen.getByRole("checkbox");
      expect(input).toBeInTheDocument();
      expect(input).toBeChecked();
      expect(input).toHaveAttribute("type", "checkbox");
      fireEvent.click(input);
      fireEvent.change(input, { target: { checked: false } });
    });
  });
});


