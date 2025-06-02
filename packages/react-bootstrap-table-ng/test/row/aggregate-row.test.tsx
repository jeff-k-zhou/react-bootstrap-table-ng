import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { INDICATOR_POSITION_RIGHT } from "../..";
import createExpansionContext from "../../src/contexts/row-expand-context";
import createSelectionContext from "../../src/contexts/selection-context";
import ExpandCell from "../../src/row-expand/expand-cell";
import bindExpansion from "../../src/row-expand/row-consumer";
import bindSelection from "../../src/row-selection/row-consumer";
import SelectionCell from "../../src/row-selection/selection-cell";
import RowAggregator from "../../src/row/aggregate-row";
import mockBodyResolvedProps from "../test-helpers/mock/body-resolved-props";

describe("Row Aggregator", () => {
  const RowAggregatorWithSelection = bindSelection(RowAggregator);
  const RowAggregatorWithExpansion = bindExpansion(RowAggregator);

  const data = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 3, name: "C" },
  ];
  const columns = [
    { dataField: "id", text: "ID" },
    { dataField: "name", text: "Name" },
  ];
  const rowIndex = 1;
  const row = data[rowIndex];
  const keyField = "id";

  const getBaseProps = () => ({
    row,
    value: row[keyField],
    columns,
    keyField,
    rowIndex,
    ...mockBodyResolvedProps,
  });

  const ExpansionContext = createExpansionContext();
  const SelectionContext = createSelectionContext();

  describe("when selectRow is enable", () => {
    describe("if props.selectRow.hideSelectColumn is false", () => {
      it("should render RowAggregator and selection column correctly", () => {
        const selectRow = { mode: "radio" };
        render(
          <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
            <table>
              <tbody>
                <RowAggregatorWithSelection {...getBaseProps()} />
              </tbody>
            </table>
          </SelectionContext.Provider>
        );
        // RowAggregator rendered
        expect(screen.getByRole("row")).toBeInTheDocument();
        // SelectionCell rendered
        expect(screen.getByTestId("selection-cell")).toBeInTheDocument();
      });
    });

    describe("if props.selectRow.hideSelectColumn is true", () => {
      it("should render RowAggregator but not selection column", () => {
        const selectRow = { mode: "radio", hideSelectColumn: true };
        render(
          <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
            <table>
              <tbody>
                <RowAggregatorWithSelection {...getBaseProps()} />
              </tbody>
            </table>
          </SelectionContext.Provider>
        );
        expect(screen.getByRole("row")).toBeInTheDocument();
        expect(screen.queryByTestId("selection-cell")).not.toBeInTheDocument();
      });
    });

    describe("if props.selectRow.clickToSelect is defined", () => {
      it("should add onClick prop to Row Component and call onRowSelect", () => {
        const selectRow = { mode: "radio", clickToSelect: true, onRowSelect: jest.fn() };
        render(
          <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
            <table>
              <tbody>
                <RowAggregatorWithSelection {...getBaseProps()} />
              </tbody>
            </table>
          </SelectionContext.Provider>
        );
        const rowEl = screen.getByRole("row");
        fireEvent.click(rowEl);
        expect(selectRow.onRowSelect).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when expandRow is enable", () => {
    describe("if props.expandRow.showExpandColumn is false", () => {
      it("should render RowAggregator but not expansion column", () => {
        const expandRow = { renderer: jest.fn() };
        render(
          <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
            <table>
              <tbody>
                <RowAggregatorWithExpansion {...getBaseProps()} />
              </tbody>
            </table>
          </ExpansionContext.Provider>
        );
        expect(screen.getByRole("row")).toBeInTheDocument();
        expect(screen.queryByTestId("expand-cell")).not.toBeInTheDocument();
      });
    });

    describe("if props.expandRow.showExpandColumn is true", () => {
      it("should render RowAggregator and expansion column correctly", () => {
        const expandRow = { renderer: jest.fn(), showExpandColumn: true };
        render(
          <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
            <table>
              <tbody>
                <RowAggregatorWithExpansion {...getBaseProps()} />
              </tbody>
            </table>
          </ExpansionContext.Provider>
        );
        expect(screen.getByRole("row")).toBeInTheDocument();
        expect(screen.getByTestId("expand-cell")).toBeInTheDocument();
      });
    });

    describe('if props.expandRow.showExpandColumn is true but props.expandRow.expandColumnPosition is "right"', () => {
      it("should render expansion column at the end", () => {
        const expandRow = {
          renderer: jest.fn(),
          showExpandColumn: true,
          expandColumnPosition: INDICATOR_POSITION_RIGHT,
        };
        render(
          <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
            <table>
              <tbody>
                <RowAggregatorWithExpansion {...getBaseProps()} />
              </tbody>
            </table>
          </ExpansionContext.Provider>
        );
        // The last cell should be the expand cell
        const rowEl = screen.getByRole("row");
        const cells = rowEl.querySelectorAll("td");
        expect(cells[cells.length - 1]).toHaveAttribute("data-testid", "expand-cell");
      });
    });
  });

  describe("createClickEventHandler", () => {
    it("should call attrs.onClick if defined", () => {
      const attrs = { onClick: jest.fn() };
      const selectRow = { mode: "radio" };
      render(
        <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
          <table>
            <tbody>
              <RowAggregatorWithSelection {...getBaseProps()} attrs={attrs} />
            </tbody>
          </table>
        </SelectionContext.Provider>
      );
      const rowEl = screen.getByRole("row");
      fireEvent.click(rowEl);
      expect(attrs.onClick).toHaveBeenCalledTimes(1);
    });

    it("should call selectRow.onRowSelect if clickToSelect is true", () => {
      const selectRow = { mode: "radio", clickToSelect: true, onRowSelect: jest.fn() };
      render(
        <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
          <table>
            <tbody>
              <RowAggregatorWithSelection {...getBaseProps()} />
            </tbody>
          </table>
        </SelectionContext.Provider>
      );
      const rowEl = screen.getByRole("row");
      fireEvent.click(rowEl);
      expect(selectRow.onRowSelect).toHaveBeenCalledTimes(1);
    });

    it("should not call selectRow.onRowSelect if not selectable", () => {
      const selectRow = {
        mode: "radio",
        clickToSelect: true,
        nonSelectable: [row[keyField]],
        onRowSelect: jest.fn(),
      };
      render(
        <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
          <table>
            <tbody>
              <RowAggregatorWithSelection {...getBaseProps()} />
            </tbody>
          </table>
        </SelectionContext.Provider>
      );
      const rowEl = screen.getByRole("row");
      fireEvent.click(rowEl);
      expect(selectRow.onRowSelect).not.toHaveBeenCalled();
    });

    it("should not call expandRow.onRowExpand if not expandable", () => {
      const expandRow = {
        renderer: jest.fn(),
        nonExpandable: [row[keyField]],
        onRowExpand: jest.fn(),
      };
      render(
        <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
          <table>
            <tbody>
              <RowAggregatorWithExpansion {...getBaseProps()} />
            </tbody>
          </table>
        </ExpansionContext.Provider>
      );
      const rowEl = screen.getByRole("row");
      fireEvent.click(rowEl);
      expect(expandRow.onRowExpand).not.toHaveBeenCalled();
    });

    it("should call expandRow.onRowExpand if expandable", () => {
      const expandRow = { renderer: jest.fn(), onRowExpand: jest.fn() };
      render(
        <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
          <table>
            <tbody>
              <RowAggregatorWithExpansion {...getBaseProps()} />
            </tbody>
          </table>
        </ExpansionContext.Provider>
      );
      const rowEl = screen.getByRole("row");
      fireEvent.click(rowEl);
      expect(expandRow.onRowExpand).toHaveBeenCalledTimes(1);
    });

    it("should call both attrs.onClick and expandRow.onRowExpand if both are defined", () => {
      const attrs = { onClick: jest.fn() };
      const expandRow = { renderer: jest.fn(), onRowExpand: jest.fn() };
      render(
        <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
          <table>
            <tbody>
              <RowAggregatorWithExpansion {...getBaseProps()} attrs={attrs} />
            </tbody>
          </table>
        </ExpansionContext.Provider>
      );
      const rowEl = screen.getByRole("row");
      fireEvent.click(rowEl);
      expect(attrs.onClick).toHaveBeenCalledTimes(1);
      expect(expandRow.onRowExpand).toHaveBeenCalledTimes(1);
    });

    it("should call both attrs.onClick and selectRow.onRowSelect if both are defined", () => {
      const attrs = { onClick: jest.fn() };
      const selectRow = { mode: "radio", clickToSelect: true, onRowSelect: jest.fn() };
      render(
        <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
          <table>
            <tbody>
              <RowAggregatorWithSelection {...getBaseProps()} attrs={attrs} />
            </tbody>
          </table>
        </SelectionContext.Provider>
      );
      const rowEl = screen.getByRole("row");
      fireEvent.click(rowEl);
      expect(attrs.onClick).toHaveBeenCalledTimes(1);
      expect(selectRow.onRowSelect).toHaveBeenCalledTimes(1);
    });
  });
});
