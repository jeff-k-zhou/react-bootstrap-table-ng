import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SelectionCell from "../../src/row-selection/selection-cell";
import { BootstrapContext } from "../../src/contexts/bootstrap";

describe("<SelectionCell />", () => {
  const mode = "checkbox";
  const rowIndex = 1;

  describe("shouldComponentUpdate", () => {
    let props: any;
    let nextProps: any;

    function getInstance(props: any) {
      // Directly instantiate for logic testing
      return new SelectionCell(props);
    }

    it("should return true when selected prop has been changed", () => {
      props = { selected: false, mode, rowIndex, disabled: false, rowKey: 1 };
      nextProps = { ...props, selected: true };
      const instance = getInstance(props);
      expect(instance.shouldComponentUpdate(nextProps)).toBe(true);
    });

    it("should return true when rowIndex prop has been changed", () => {
      props = { selected: false, mode, rowIndex, disabled: false, rowKey: 1 };
      nextProps = { ...props, rowIndex: 2 };
      const instance = getInstance(props);
      expect(instance.shouldComponentUpdate(nextProps)).toBe(true);
    });

    it("should return true when tabIndex prop has been changed", () => {
      props = { selected: false, mode, rowIndex, disabled: false, tabIndex: 0, rowKey: 1 };
      nextProps = { ...props, tabIndex: 2 };
      const instance = getInstance(props);
      expect(instance.shouldComponentUpdate(nextProps)).toBe(true);
    });

    it("should return true when disabled prop has been changed", () => {
      props = { selected: false, mode, rowIndex, disabled: false, rowKey: 1 };
      nextProps = { ...props, disabled: true };
      const instance = getInstance(props);
      expect(instance.shouldComponentUpdate(nextProps)).toBe(true);
    });

    it("should return true when rowKey prop has been changed", () => {
      props = { selected: false, mode, rowIndex, disabled: false, rowKey: 1 };
      nextProps = { ...props, rowKey: "1" };
      const instance = getInstance(props);
      expect(instance.shouldComponentUpdate(nextProps)).toBe(true);
    });
  });

  describe("handleClick", () => {
    const rowKey = 1;
    const selected = true;

    it("should call onRowSelect callback when not disabled", () => {
      const mockOnRowSelect = jest.fn();
      render(
        <table>
          <tbody>
            <SelectionCell
              selected
              rowKey={rowKey}
              mode={mode}
              rowIndex={rowIndex}
              onRowSelect={mockOnRowSelect}
            />
          </tbody>
        </table>
      );
      fireEvent.click(screen.getByRole("cell"));
      expect(mockOnRowSelect).toHaveBeenCalledWith(rowKey, !selected, rowIndex, expect.anything());
    });

    it("should not call onRowSelect callback when disabled", () => {
      const mockOnRowSelect = jest.fn();
      render(
        <table>
          <tbody>
            <SelectionCell
              selected
              rowKey={rowKey}
              mode={mode}
              rowIndex={rowIndex}
              onRowSelect={mockOnRowSelect}
              disabled
            />
          </tbody>
        </table>
      );
      fireEvent.click(screen.getByRole("cell"));
      expect(mockOnRowSelect).not.toHaveBeenCalled();
    });

    it("should call onRowSelect with correct parameters for radio", () => {
      const mockOnRowSelect = jest.fn();
      render(
        <table>
          <tbody>
            <SelectionCell
              selected
              rowKey={rowKey}
              mode="radio"
              rowIndex={rowIndex}
              onRowSelect={mockOnRowSelect}
            />
          </tbody>
        </table>
      );
      fireEvent.click(screen.getByRole("cell"));
      expect(mockOnRowSelect).toHaveBeenCalledWith(rowKey, true, rowIndex, expect.anything());
    });

    it("should call onRowSelect with correct parameters for checkbox", () => {
      const mockOnRowSelect = jest.fn();
      render(
        <table>
          <tbody>
            <SelectionCell
              rowKey={rowKey}
              mode="checkbox"
              rowIndex={rowIndex}
              selected
              onRowSelect={mockOnRowSelect}
            />
          </tbody>
        </table>
      );
      fireEvent.click(screen.getByRole("cell"));
      expect(mockOnRowSelect).toHaveBeenCalledWith(rowKey, false, rowIndex, expect.anything());
    });
  });

  describe("render", () => {
    const selected = true;

    it("should render component correctly", () => {
      render(
        <table>
          <tbody>
            <SelectionCell
              rowKey={1}
              mode={mode}
              rowIndex={rowIndex}
              selected={selected}
            />
          </tbody>
        </table>
      );
      const cell = screen.getByRole("cell");
      expect(cell).toBeInTheDocument();
      const input = cell.querySelector("input");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", mode);
      expect(input).toBeChecked();
    });

    it("should render component with disabled attribute", () => {
      render(
        <table>
          <tbody>
            <SelectionCell
              rowKey={1}
              mode={mode}
              rowIndex={rowIndex}
              selected={selected}
              disabled
            />
          </tbody>
        </table>
      );
      const input = screen.getByRole("cell").querySelector("input");
      expect(input).toBeDisabled();
    });

    it("should render selectionRenderer correctly", () => {
      const DummySelection = () => <div data-testid="dummy" />;
      const selectionRenderer = jest.fn().mockReturnValue(<DummySelection />);
      render(
        <table>
          <tbody>
            <SelectionCell
              rowKey={1}
              mode={mode}
              rowIndex={rowIndex}
              selected={selected}
              selectionRenderer={selectionRenderer}
            />
          </tbody>
        </table>
      );
      expect(screen.getByTestId("dummy")).toBeInTheDocument();
      expect(selectionRenderer).toHaveBeenCalledTimes(1);
      expect(selectionRenderer).toHaveBeenCalledWith({
        mode,
        checked: selected,
        disabled: false,
        rowindex: rowIndex,
        rowkey: 1,
      });
    });

    it("should render component with bootstrap4 class when bootstrap4 context is true", () => {
      render(
        <BootstrapContext.Provider value={{ bootstrap4: true }}>
          <table>
            <tbody>
              <SelectionCell
                rowKey={1}
                mode={mode}
                rowIndex={rowIndex}
                selected={selected}
              />
            </tbody>
          </table>
        </BootstrapContext.Provider>
      );
      const cell = screen.getByRole("cell");
      expect(cell.querySelector(".selection-input-4")).toBeInTheDocument();
    });
  });
});
