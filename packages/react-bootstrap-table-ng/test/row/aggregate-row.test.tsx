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
    selectable: true,
    expandable: true,
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
        const selectRow = { mode: "radio", clickToSelect: true, onSelect: jest.fn() };
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
        expect(selectRow.onSelect).toHaveBeenCalledTimes(1);
      });
    });

    describe("if selectColumnPosition is right", () => {
      it("renders selection cell at the end", () => {
        const selectRow = { mode: "radio", selectColumnPosition: INDICATOR_POSITION_RIGHT };
        const props = getBaseProps();
        const { rerender } = render(
          <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
            <table>
              <tbody>
                <RowAggregatorWithSelection {...props} />
              </tbody>
            </table>
          </SelectionContext.Provider>
        );
        const rowEl = screen.getByRole("row");
        const cells = rowEl.querySelectorAll("td");
        expect(cells[cells.length - 1]).toHaveAttribute("data-testid", "selection-cell");

        // Rerender with identical props (memo return true)
        rerender(
          <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
            <table>
              <tbody>
                <RowAggregatorWithSelection {...props} />
              </tbody>
            </table>
          </SelectionContext.Provider>
        );
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

    it("should call selectRow.onSelect if clickToSelect is true", () => {
      const selectRow = { mode: "radio", clickToSelect: true, onSelect: jest.fn() };
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
      expect(selectRow.onSelect).toHaveBeenCalledTimes(1);
    });

    it("should not call selectRow.onSelect if not selectable", () => {
      const selectRow = {
        mode: "radio",
        clickToSelect: true,
        nonSelectable: [row[keyField]],
        onSelect: jest.fn(),
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
      expect(selectRow.onSelect).not.toHaveBeenCalled();
    });

    it("should not call expandRow.onExpand if not expandable", () => {
      const expandRow = {
        renderer: jest.fn(),
        nonExpandable: [row[keyField]],
        onExpand: jest.fn(),
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
      expect(expandRow.onExpand).not.toHaveBeenCalled();
    });

    it("should call expandRow.onExpand if expandable", () => {
      const expandRow = { renderer: jest.fn(), onExpand: jest.fn() };
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
      expect(expandRow.onExpand).toHaveBeenCalledTimes(1);
    });

    it("should call both attrs.onClick and expandRow.onExpand if both are defined", () => {
      const attrs = { onClick: jest.fn() };
      const expandRow = { renderer: jest.fn(), onExpand: jest.fn() };
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
      expect(expandRow.onExpand).toHaveBeenCalledTimes(1);
    });

    it("should call both attrs.onClick and selectRow.onSelect if both are defined", () => {
      const attrs = { onClick: jest.fn() };
      const selectRow = { mode: "radio", clickToSelect: true, onSelect: jest.fn() };
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
      expect(selectRow.onSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe("tabIndexCell behavior", () => {
    it("assigns tabIndex to selection cell when tabIndexCell=true", () => {
      const selectRow = { mode: "checkbox" };
      render(
        <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
          <table>
            <tbody>
              <RowAggregatorWithSelection
                {...getBaseProps()}
                tabIndexCell={true}
                visibleColumnSize={2}
                rowIndex={0}
              />
            </tbody>
          </table>
        </SelectionContext.Provider>
      );
      const selectionCell = screen.getByTestId("selection-cell");
      expect(selectionCell).toBeInTheDocument();
    });

    it("assigns tabIndex to expand cell when tabIndexCell=true and showExpandColumn", () => {
      const expandRow = { renderer: jest.fn(), showExpandColumn: true };
      render(
        <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
          <table>
            <tbody>
              <RowAggregatorWithExpansion
                {...getBaseProps()}
                tabIndexCell={true}
                visibleColumnSize={2}
                rowIndex={0}
              />
            </tbody>
          </table>
        </ExpansionContext.Provider>
      );
      const expandCell = screen.getByTestId("expand-cell");
      expect(expandCell).toBeInTheDocument();
    });

    it("sets tabIndex=0 on row when isClickToExpand", () => {
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
      const rowEl = screen.getByRole("row");
      // When expandRow.renderer is set, tabIndex=0 is added to tr
      expect(rowEl).toHaveAttribute("tabIndex", "0");
    });
  });
});
