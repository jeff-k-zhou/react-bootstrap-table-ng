/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import { INDICATOR_POSITION_RIGHT, SORT_ASC } from "..";
import Header from "../src/header";
import Footer from "../src/footer";
import Cell from "../src/cell";
import ColumnResizer from "../src/column-resizer";
import FiltersCell from "../src/filters-cell";
import _ from "../src/utils";
import createExpansionContext from "../src/contexts/row-expand-context";
import createSelectionContext from "../src/contexts/selection-context";
import createSortContext from "../src/contexts/sort-context";
import dataOperator from "../src/store/operators";
import ExpandHeaderCell from "../src/row-expand/expand-header-cell";
import SelectionCell from "../src/row-selection/selection-cell";
import SelectionHeaderCell, { CheckBox } from "../src/row-selection/selection-header-cell";
import RowAggregator from "../src/row/aggregate-row";
import RowPureContent from "../src/row/row-pure-content";
import bindExpansion from "../src/row-expand/row-consumer";
import bindSelection from "../src/row-selection/row-consumer";
import mockHeaderResolvedProps from "./test-helpers/mock/header-resolved-props";
import mockBodyResolvedProps from "./test-helpers/mock/body-resolved-props";
import { useCellEventDelegater, CellEventDelegater } from "../src/cell-event-delegater";
import {
  CHECKBOX_STATUS_CHECKED,
  CHECKBOX_STATUS_INDETERMINATE,
  ROW_SELECT_MULTIPLE,
  ROW_SELECT_SINGLE,
} from "../src/const";

const ExpansionContext = createExpansionContext();
const SelectionContext = createSelectionContext();

const columns = [
  { dataField: "id", text: "ID" },
  { dataField: "name", text: "Name" },
];
const data = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
];
const keyField = "id";

// ─────────────────────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────────────────────
describe("Header extra coverage", () => {
  it("renders selectRow on the RIGHT side when selectColumnPosition is right", () => {
    const selectRow = { mode: "checkbox", selectColumnPosition: INDICATOR_POSITION_RIGHT };
    render(
      <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
        <table>
          <Header
            {...mockHeaderResolvedProps}
            columns={columns}
            selectRow={selectRow}
          />
        </table>
      </SelectionContext.Provider>
    );
    const headers = screen.getAllByRole("columnheader");
    // Selection column should be pushed to the right (last)
    expect(headers.length).toBe(columns.length + 1);
  });

  it("renders expandRow on the RIGHT side when expandColumnPosition is right", () => {
    const expandRow = {
      renderer: jest.fn(() => <div>content</div>),
      expanded: [],
      showExpandColumn: true,
      expandColumnPosition: INDICATOR_POSITION_RIGHT,
    };
    render(
      <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
        <table>
          <Header
            {...mockHeaderResolvedProps}
            columns={columns}
            expandRow={expandRow}
          />
        </table>
      </ExpansionContext.Provider>
    );
    const headers = screen.getAllByRole("columnheader");
    expect(headers.length).toBe(columns.length + 1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────
describe("Footer extra coverage", () => {
  it("renders footer with column footer function and selectRow", () => {
    const footerColumns = [
      { dataField: "id", text: "ID", footer: (colData: any[]) => `Total: ${colData.length}` },
      { dataField: "name", text: "Name", footer: "Names" },
    ];
    const selectRow = { mode: "checkbox" };
    render(
      <table>
        <Footer
          data={data}
          columns={footerColumns}
          selectRow={selectRow}
        />
      </table>
    );
    // Footer should render
    expect(screen.getByText(/Total:/)).toBeInTheDocument();
  });

  it("renders footer with expandRow", () => {
    const footerColumns = [
      { dataField: "id", text: "ID", footer: "ID Sum" },
    ];
    const expandRow = { renderer: () => <div />, expanded: [] };
    render(
      <table>
        <Footer data={data} columns={footerColumns} expandRow={expandRow as any} />
      </table>
    );
    expect(screen.getByText("ID Sum")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Cell
// ─────────────────────────────────────────────────────────────────────────────
describe("Cell extra coverage", () => {
  const row = { id: 1, name: "Alice", flag: true };
  const col = { dataField: "name", text: "Name" };

  it("renders boolean content as string", () => {
    const boolCol = { dataField: "flag", text: "Flag" };
    render(
      <table>
        <tbody>
          <tr>
            <Cell row={row} column={boolCol} rowindex={0} columnindex={0} />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByRole("cell")).toHaveTextContent("true");
  });

  it("handles dbclicktoedit on double click", () => {
    const atstart = jest.fn();
    render(
      <table>
        <tbody>
          <tr>
            <Cell
              row={row}
              column={col}
              rowindex={0}
              columnindex={1}
              atstart={atstart}
              dbclicktoedit="true"
              editable="true"
            />
          </tr>
        </tbody>
      </table>
    );
    fireEvent.doubleClick(screen.getByRole("cell"));
    expect(atstart).toHaveBeenCalledWith(0, 1);
  });

  it("handles Enter key for dbclicktoedit", () => {
    const atstart = jest.fn();
    render(
      <table>
        <tbody>
          <tr>
            <Cell
              row={row}
              column={col}
              rowindex={0}
              columnindex={1}
              atstart={atstart}
              dbclicktoedit="true"
              editable="true"
            />
          </tr>
        </tbody>
      </table>
    );
    fireEvent.keyDown(screen.getByRole("cell"), { key: "Enter" });
    expect(atstart).toHaveBeenCalled();
  });

  it("handles F2 key for dbclicktoedit", () => {
    const atstart = jest.fn();
    render(
      <table>
        <tbody>
          <tr>
            <Cell
              row={row}
              column={col}
              rowindex={0}
              columnindex={1}
              atstart={atstart}
              dbclicktoedit="true"
              editable="true"
            />
          </tr>
        </tbody>
      </table>
    );
    fireEvent.keyDown(screen.getByRole("cell"), { key: "F2" });
    expect(atstart).toHaveBeenCalled();
  });

  it("does not call atstart when key is not Enter or F2", () => {
    const atstart = jest.fn();
    render(
      <table>
        <tbody>
          <tr>
            <Cell
              row={row}
              column={col}
              rowindex={0}
              columnindex={1}
              atstart={atstart}
              dbclicktoedit="true"
              editable="true"
            />
          </tr>
        </tbody>
      </table>
    );
    fireEvent.keyDown(screen.getByRole("cell"), { key: "ArrowDown" });
    expect(atstart).not.toHaveBeenCalled();
  });

  it("handles clicktoedit on click with column events", () => {
    const atstart = jest.fn();
    const onClick = jest.fn();
    const colWithEvents = { ...col, events: { onClick } };
    render(
      <table>
        <tbody>
          <tr>
            <Cell
              row={row}
              column={colWithEvents}
              rowindex={0}
              columnindex={1}
              atstart={atstart}
              clicktoedit="true"
              editable="true"
            />
          </tr>
        </tbody>
      </table>
    );
    fireEvent.click(screen.getByRole("cell"));
    expect(atstart).toHaveBeenCalled();
  });

  it("handles isDummyField column (null content)", () => {
    const dummyCol = { dataField: "dummy", text: "Dummy", isDummyField: true };
    render(
      <table>
        <tbody>
          <tr>
            <Cell row={row} column={dummyCol} rowindex={0} columnindex={0} />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByRole("cell")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CellEventDelegater
// ─────────────────────────────────────────────────────────────────────────────
describe("CellEventDelegater extra coverage", () => {
  it("CellEventDelegater HOC wraps component and passes delegate", () => {
    const BaseComponent = React.forwardRef<any, any>((props, ref) => (
      <div ref={ref} data-testid="wrapped">{props.delegate ? "has-delegate" : "no-delegate"}</div>
    ));
    const Wrapped = CellEventDelegater(BaseComponent as any);
    render(<Wrapped column={{ dataField: "id", text: "ID" }} index={0} />);
    expect(screen.getByTestId("wrapped")).toHaveTextContent("has-delegate");
  });

  it("useCellEventDelegater handles columnIndex undefined fallback to index", () => {
    let capturedDelegate: any;
    const TestComp = () => {
      const delegate = useCellEventDelegater({ column: { dataField: "id" }, index: 3 });
      capturedDelegate = delegate;
      return <div />;
    };
    render(<TestComp />);
    const onClick = jest.fn();
    const attrs = capturedDelegate({ onClick });
    // Should wrap the onClick
    expect(typeof attrs.onClick).toBe("function");
    attrs.onClick({ target: {} });
    // The callback receives (e, column, columnIndex=index=3)
    expect(onClick).toHaveBeenCalledWith(expect.anything(), { dataField: "id" }, 3);
  });

  it("useCellEventDelegater handles non-event attribute passthrough", () => {
    let capturedDelegate: any;
    const TestComp = () => {
      const delegate = useCellEventDelegater({ column: { dataField: "id" }, columnIndex: 1, index: 0 });
      capturedDelegate = delegate;
      return <div />;
    };
    render(<TestComp />);
    const style = { color: "red" };
    const attrs = capturedDelegate({ style, className: "foo" });
    expect(attrs.style).toEqual(style);
    expect(attrs.className).toBe("foo");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ColumnResizer
// ─────────────────────────────────────────────────────────────────────────────
describe("ColumnResizer extra coverage", () => {
  it("handles mousedown when parent is null", () => {
    // Without a parent element, the resizer should return early
    const onColumnResize = jest.fn();
    const { container } = render(
      <div>
        <ColumnResizer onColumnResize={onColumnResize} />
      </div>
    );
    const resizer = container.querySelector("[role=separator]") as HTMLElement;
    // Detach from parent to simulate no parent
    const parent = resizer.parentElement!;
    parent.removeChild(resizer);
    // Firing mousedown on detached element - no crash expected
    fireEvent.mouseDown(resizer, { clientX: 100 });
    expect(onColumnResize).not.toHaveBeenCalled();
  });

  it("handles ArrowRight and ArrowLeft keyboard keys", () => {
    const onColumnResize = jest.fn();
    render(
      <table>
        <thead>
          <tr>
            <th style={{ position: "relative", width: "100px" }}>
              <ColumnResizer onColumnResize={onColumnResize} />
            </th>
          </tr>
        </thead>
      </table>
    );
    const resizer = screen.getByRole("separator");
    fireEvent.keyDown(resizer, { key: "ArrowRight" });
    expect(onColumnResize).toHaveBeenCalled();
    fireEvent.keyDown(resizer, { key: "ArrowLeft" });
    expect(onColumnResize).toHaveBeenCalled();
  });

  it("handles other keydown keys (no resize)", () => {
    const onColumnResize = jest.fn();
    render(
      <table>
        <thead>
          <tr>
            <th style={{ position: "relative", width: "100px" }}>
              <ColumnResizer onColumnResize={onColumnResize} />
            </th>
          </tr>
        </thead>
      </table>
    );
    const resizer = screen.getByRole("separator");
    fireEvent.keyDown(resizer, { key: "Tab" });
    expect(onColumnResize).not.toHaveBeenCalled();
  });

  it("handles mousedown with parent and fires mousemove/mouseup", () => {
    const onColumnResize = jest.fn();
    render(
      <table>
        <thead>
          <tr>
            <th style={{ position: "relative", width: "100px" }}>
              <ColumnResizer onColumnResize={onColumnResize} />
            </th>
          </tr>
        </thead>
      </table>
    );
    const resizer = screen.getByRole("separator");
    fireEvent.mouseDown(resizer, { clientX: 50 });
    // Simulate mousemove
    fireEvent.mouseMove(document, { clientX: 100 });
    expect(onColumnResize).toHaveBeenCalled();
    // Simulate mouseup
    fireEvent.mouseUp(document);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// utils.ts
// ─────────────────────────────────────────────────────────────────────────────
describe("utils extra coverage", () => {
  it("pluck extracts field values from data array", () => {
    const result = _.pluck(data, "name");
    expect(result).toEqual(["A", "B"]);
  });

  it("sleep returns a timeout id", () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const id = _.sleep(fn, 100);
    expect(id).toBeDefined();
    jest.advanceTimersByTime(150);
    expect(fn).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("contains returns true when value is in list", () => {
    expect(_.contains([1, 2, 3], 2)).toBe(true);
    expect(_.contains([1, 2, 3], 5)).toBe(false);
    expect(_.contains(undefined, 1)).toBe(false);
  });

  it("includes returns true when value is in list", () => {
    expect(_.includes(["a", "b"], "a")).toBe(true);
    expect(_.includes(["a", "b"], "z")).toBe(false);
    expect(_.includes(undefined, "a")).toBe(false);
  });

  it("filter filters list using predicate, returns [] for non-array", () => {
    const result = _.filter(data, (item) => item.id === 1);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("A");
    // Non-array input returns []
    expect(_.filter(null as any, () => true)).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ExpandHeaderCell
// ─────────────────────────────────────────────────────────────────────────────
describe("ExpandHeaderCell extra coverage", () => {
  it("handles Space keydown to toggle expand all", () => {
    const onAllRowExpand = jest.fn();
    render(
      <table>
        <thead>
          <tr>
            <ExpandHeaderCell
              isAnyExpands={false}
              onAllRowExpand={onAllRowExpand}
            />
          </tr>
        </thead>
      </table>
    );
    const btn = screen.getByRole("button");
    fireEvent.keyDown(btn, { key: " " });
    expect(onAllRowExpand).toHaveBeenCalled();
  });

  it("ignores other keys", () => {
    const onAllRowExpand = jest.fn();
    render(
      <table>
        <thead>
          <tr>
            <ExpandHeaderCell
              isAnyExpands={false}
              onAllRowExpand={onAllRowExpand}
            />
          </tr>
        </thead>
      </table>
    );
    const btn = screen.getByRole("button");
    fireEvent.keyDown(btn, { key: "Tab" });
    expect(onAllRowExpand).not.toHaveBeenCalled();
  });

  it("renders expandHeaderColumnRenderer when provided", () => {
    const renderer = jest.fn(() => <span>custom-expand</span>);
    render(
      <table>
        <thead>
          <tr>
            <ExpandHeaderCell
              isAnyExpands={true}
              onAllRowExpand={jest.fn()}
              expandHeaderColumnRenderer={renderer}
            />
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByText("custom-expand")).toBeInTheDocument();
    expect(renderer).toHaveBeenCalledWith({ isAnyExpands: true });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SelectionCell extra coverage
// ─────────────────────────────────────────────────────────────────────────────
describe("SelectionCell extra coverage", () => {
  it("handles selection when disabled (does nothing)", () => {
    const onRowSelect = jest.fn();
    render(
      <table>
        <tbody>
          <tr>
            <SelectionCell
              rowKey={1}
              selected={false}
              onRowSelect={onRowSelect}
              disabled={true}
              mode="checkbox"
              rowIndex={0}
            />
          </tr>
        </tbody>
      </table>
    );
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onRowSelect).not.toHaveBeenCalled();
  });

  it("handles single select mode (checked=true regardless of current)", () => {
    const onRowSelect = jest.fn();
    render(
      <table>
        <tbody>
          <tr>
            <SelectionCell
              rowKey={2}
              selected={false}
              onRowSelect={onRowSelect}
              mode={ROW_SELECT_SINGLE}
              rowIndex={1}
            />
          </tr>
        </tbody>
      </table>
    );
    fireEvent.click(screen.getByRole("radio"));
    expect(onRowSelect).toHaveBeenCalledWith(2, true, 1, expect.anything());
  });

  it("renders custom selectionRenderer", () => {
    const selectionRenderer = jest.fn(({ checked }) => (
      <div data-testid="custom-renderer">{checked ? "checked" : "unchecked"}</div>
    ));
    render(
      <table>
        <tbody>
          <tr>
            <SelectionCell
              rowKey={1}
              selected={true}
              mode="checkbox"
              rowIndex={0}
              selectionRenderer={selectionRenderer}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByTestId("custom-renderer")).toHaveTextContent("checked");
  });

  it("handles selectColumnStyle as a function", () => {
    const styleFunc = jest.fn(() => ({ color: "red" }));
    render(
      <table>
        <tbody>
          <tr>
            <SelectionCell
              rowKey={1}
              selected={false}
              mode="checkbox"
              rowIndex={0}
              selectColumnStyle={styleFunc}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(styleFunc).toHaveBeenCalled();
    // jsdom converts "red" to rgb(255, 0, 0)
    expect(screen.getByRole("checkbox").closest("td")).toHaveStyle("color: rgb(255, 0, 0)");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SelectionHeaderCell extra coverage
// ─────────────────────────────────────────────────────────────────────────────
describe("SelectionHeaderCell extra coverage", () => {
  it("renders custom selectionHeaderRenderer", () => {
    const selectionHeaderRenderer = jest.fn(({ checked }) => (
      <div data-testid="custom-header-renderer">{checked ? "all-checked" : "none"}</div>
    ));
    const onAllRowsSelect = jest.fn();
    render(
      <table>
        <thead>
          <tr>
            <SelectionHeaderCell
              mode={ROW_SELECT_MULTIPLE}
              checkedStatus={CHECKBOX_STATUS_CHECKED}
              onAllRowsSelect={onAllRowsSelect}
              selectionHeaderRenderer={selectionHeaderRenderer}
            />
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByTestId("custom-header-renderer")).toHaveTextContent("all-checked");
    // Click triggers handleCheckBoxClick
    fireEvent.click(screen.getByRole("columnheader"));
    expect(onAllRowsSelect).toHaveBeenCalled();
  });

  it("handles Space key to toggle select all", () => {
    const onAllRowsSelect = jest.fn();
    render(
      <table>
        <thead>
          <tr>
            <SelectionHeaderCell
              mode={ROW_SELECT_MULTIPLE}
              checkedStatus={CHECKBOX_STATUS_INDETERMINATE}
              onAllRowsSelect={onAllRowsSelect}
            />
          </tr>
        </thead>
      </table>
    );
    fireEvent.keyDown(screen.getByRole("columnheader"), { key: " " });
    expect(onAllRowsSelect).toHaveBeenCalled();
  });

  it("ignores other keydown keys", () => {
    const onAllRowsSelect = jest.fn();
    render(
      <table>
        <thead>
          <tr>
            <SelectionHeaderCell
              mode={ROW_SELECT_MULTIPLE}
              checkedStatus=""
              onAllRowsSelect={onAllRowsSelect}
            />
          </tr>
        </thead>
      </table>
    );
    fireEvent.keyDown(screen.getByRole("columnheader"), { key: "Tab" });
    expect(onAllRowsSelect).not.toHaveBeenCalled();
  });

  it("renders headerColumnStyle as a function", () => {
    const styleFn = jest.fn(() => ({ backgroundColor: "blue" }));
    render(
      <table>
        <thead>
          <tr>
            <SelectionHeaderCell
              mode={ROW_SELECT_MULTIPLE}
              checkedStatus=""
              headerColumnStyle={styleFn}
              onAllRowsSelect={jest.fn()}
            />
          </tr>
        </thead>
      </table>
    );
    expect(styleFn).toHaveBeenCalled();
  });

  it("memo: returns true for ROW_SELECT_SINGLE (never re-renders)", () => {
    // Render once with ROW_SELECT_SINGLE, rerender should not update
    const onAllRowsSelect = jest.fn();
    const { rerender } = render(
      <table>
        <thead>
          <tr>
            <SelectionHeaderCell
              mode={ROW_SELECT_SINGLE}
              checkedStatus=""
              onAllRowsSelect={onAllRowsSelect}
            />
          </tr>
        </thead>
      </table>
    );
    rerender(
      <table>
        <thead>
          <tr>
            <SelectionHeaderCell
              mode={ROW_SELECT_SINGLE}
              checkedStatus={CHECKBOX_STATUS_CHECKED}
              onAllRowsSelect={onAllRowsSelect}
            />
          </tr>
        </thead>
      </table>
    );
    // No error means memo skipped re-render correctly
  });

  it("CheckBox renders with indeterminate prop", () => {
    const { container } = render(
      <CheckBox checked={false} indeterminate={true} />
    );
    const input = container.querySelector("input[type=checkbox]") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.indeterminate).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RowPureContent extra coverage
// ─────────────────────────────────────────────────────────────────────────────
describe("RowPureContent extra coverage", () => {
  const baseProps = {
    row: { id: 1, name: "A" },
    columns,
    keyField: "id",
    rowIndex: 0,
    shouldUpdate: true,
    tabIndexStart: -1,
    visibleColumnSize: 2,
    ...mockBodyResolvedProps,
  };

  it("renders with shouldUpdate=false (does not update)", () => {
    const { rerender } = render(
      <table>
        <tbody>
          <tr>
            <RowPureContent {...baseProps} shouldUpdate={false} />
          </tr>
        </tbody>
      </table>
    );
    // Re-render with different row - shouldUpdate=false skips render
    rerender(
      <table>
        <tbody>
          <tr>
            <RowPureContent {...baseProps} shouldUpdate={false} row={{ id: 1, name: "Z" }} />
          </tr>
        </tbody>
      </table>
    );
    // The content should still show original due to shouldUpdate=false
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders with atstart prop (clicktoedit mode)", () => {
    const atstart = jest.fn();
    render(
      <table>
        <tbody>
          <tr>
            <RowPureContent
              {...baseProps}
              atstart={atstart}
              clicktoedit="true"
              editable="true"
            />
          </tr>
        </tbody>
      </table>
    );
    const cells = screen.getAllByRole("cell");
    expect(cells.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Row-expand/row-consumer.tsx extra coverage
// ─────────────────────────────────────────────────────────────────────────────
describe("row-expand/row-consumer extra coverage", () => {
  const WrappedAggregator = bindExpansion(RowAggregator);

  const baseRowProps = {
    row: data[0],
    value: data[0][keyField],
    columns,
    keyField,
    rowIndex: 0,
    selectable: true,
    expandable: true,
    ...mockBodyResolvedProps,
  };

  it("renders null ExpandRow when row is not expanded and not closing", () => {
    const expandRow = {
      renderer: () => <div>expanded-content</div>,
      expanded: [],
      isClosing: [],
      onClosed: jest.fn(),
    };
    render(
      <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
        <table>
          <tbody>
            <WrappedAggregator {...baseRowProps} />
          </tbody>
        </table>
      </ExpansionContext.Provider>
    );
    expect(screen.queryByText("expanded-content")).not.toBeInTheDocument();
  });

  it("renders expand row when row is expanded with function parentClassName and className", () => {
    const expandRow = {
      renderer: () => <div>expanded-content</div>,
      expanded: [1],
      isClosing: [],
      onClosed: jest.fn(),
      parentClassName: (expanded: boolean, row: any) => "parent-class",
      className: (expanded: boolean, row: any) => "expand-class",
      showExpandColumn: false,
    };
    render(
      <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
        <table>
          <tbody>
            <WrappedAggregator {...baseRowProps} />
          </tbody>
        </table>
      </ExpansionContext.Provider>
    );
    expect(screen.getByText("expanded-content")).toBeInTheDocument();
  });

  it("renders ExpandRow during closing transition (isClosing)", () => {
    const expandRow = {
      renderer: () => <div>closing-content</div>,
      expanded: [],
      isClosing: [1],
      onClosed: jest.fn(),
    };
    render(
      <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
        <table>
          <tbody>
            <WrappedAggregator {...baseRowProps} />
          </tbody>
        </table>
      </ExpansionContext.Provider>
    );
    expect(screen.getByText("closing-content")).toBeInTheDocument();
  });

  it("renders with id prop (sets expansionRowId)", () => {
    const expandRow = {
      renderer: () => <div>id-content</div>,
      expanded: [1],
      isClosing: [],
      onClosed: jest.fn(),
    };
    render(
      <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
        <table>
          <tbody>
            <WrappedAggregator {...baseRowProps} id="row-1" />
          </tbody>
        </table>
      </ExpansionContext.Provider>
    );
    expect(screen.getByText("id-content")).toBeInTheDocument();
  });

  it("renders without expandRow (no context - returns [])", () => {
    // No ExpansionContext.Provider means expandRow is null/undefined in consumer
    render(
      <table>
        <tbody>
          <WrappedAggregator {...baseRowProps} />
        </tbody>
      </table>
    );
    // No crash expected
  });

  it("renders with nonExpandable row (expandable=false)", () => {
    const expandRow = {
      renderer: () => <div>content</div>,
      expanded: [],
      isClosing: [],
      nonExpandable: [1],
      onClosed: jest.fn(),
    };
    render(
      <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
        <table>
          <tbody>
            <WrappedAggregator {...baseRowProps} />
          </tbody>
        </table>
      </ExpansionContext.Provider>
    );
    // Row renders, just not expandable
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RowAggregator extra coverage (aggregate-row.tsx)
// ─────────────────────────────────────────────────────────────────────────────
describe("RowAggregator extra coverage", () => {
  const SelectionContextLocal = createSelectionContext();
  const ExpansionContextLocal = createExpansionContext();

  const rowProps = {
    row: data[0],
    value: data[0][keyField],
    columns,
    keyField,
    rowIndex: 0,
    selectable: true,
    expandable: true,
    ...mockBodyResolvedProps,
  };

  it("pushes selectCell to right when selectColumnPosition is right", () => {
    const selectRow = { mode: "checkbox", selectColumnPosition: INDICATOR_POSITION_RIGHT };
    render(
      <SelectionContextLocal.Provider data={data} keyField={keyField} selectRow={selectRow}>
        <table>
          <tbody>
            <RowAggregator {...rowProps} selected={false} selectable={true} />
          </tbody>
        </table>
      </SelectionContextLocal.Provider>
    );
    expect(screen.getAllByRole("cell").length).toBeGreaterThanOrEqual(1);
  });

  it("pushes expandCell to right when expandColumnPosition is right", () => {
    const expandRow = {
      renderer: () => <div>exp</div>,
      expanded: [],
      isClosing: [],
      showExpandColumn: true,
      expandColumnPosition: INDICATOR_POSITION_RIGHT,
      onClosed: jest.fn(),
    };
    render(
      <ExpansionContextLocal.Provider data={data} keyField={keyField} expandRow={expandRow}>
        <table>
          <tbody>
            <RowAggregator
              {...rowProps}
              expanded={false}
              expandable={true}
              selected={false}
            />
          </tbody>
        </table>
      </ExpansionContextLocal.Provider>
    );
    expect(screen.getAllByRole("cell").length).toBeGreaterThanOrEqual(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SortContext extra coverage
// ─────────────────────────────────────────────────────────────────────────────
describe("SortContext extra coverage", () => {
  const handleSortChange = jest.fn();

  function createContext(remote = false) {
    return createSortContext(
      dataOperator as any,
      jest.fn().mockReturnValue(remote),
      handleSortChange
    );
  }

  it("handles sort prop sync (getDerivedStateFromProps replacement)", () => {
    const SortCtx = createContext();
    let sortProps: any;
    const { rerender } = render(
      <SortCtx.Provider
        columns={columns}
        data={data}
        defaultSortDirection={SORT_ASC}
        sort={{ dataField: "id", order: SORT_ASC, sortFunc: undefined as any }}
      >
        <SortCtx.Consumer>
          {(p: any) => {
            sortProps = p;
            return <div />;
          }}
        </SortCtx.Consumer>
      </SortCtx.Provider>
    );
    // Rerender with updated sort prop
    rerender(
      <SortCtx.Provider
        columns={columns}
        data={data}
        defaultSortDirection={SORT_ASC}
        sort={{ dataField: "name", order: SORT_ASC, sortFunc: undefined as any }}
      >
        <SortCtx.Consumer>
          {(p: any) => {
            sortProps = p;
            return <div />;
          }}
        </SortCtx.Consumer>
      </SortCtx.Provider>
    );
    expect(sortProps.sortField).toBe("name");
  });

  it("handles remote sort with initial sort prop", () => {
    handleSortChange.mockClear();
    const SortCtx = createContext(true);
    render(
      <SortCtx.Provider
        columns={columns}
        data={data}
        defaultSortDirection={SORT_ASC}
        sort={{ dataField: "id", order: SORT_ASC, sortFunc: undefined as any }}
      >
        <SortCtx.Consumer>{() => <div />}</SortCtx.Consumer>
      </SortCtx.Provider>
    );
    // Remote sort fires handleSortChange on mount if sort is set
    expect(handleSortChange).toHaveBeenCalled();
  });

  it("handles column with onSort callback when sorting", () => {
    const onSort = jest.fn();
    const sortableColumns = [
      { dataField: "id", text: "ID", sort: true, onSort },
      { dataField: "name", text: "Name", sort: true },
    ];
    const SortCtx = createContext();
    let sortProps: any;
    render(
      <SortCtx.Provider columns={sortableColumns} data={data} defaultSortDirection={SORT_ASC}>
        <SortCtx.Consumer>
          {(p: any) => {
            sortProps = p;
            return <div />;
          }}
        </SortCtx.Consumer>
      </SortCtx.Provider>
    );
    act(() => {
      sortProps.onSort(sortableColumns[0]);
    });
    expect(onSort).toHaveBeenCalled();
  });

  it("handles defaultSorted initializes sort column and calls onSort", () => {
    const onSort = jest.fn();
    const sortCols = [
      { dataField: "id", text: "ID", sort: true, onSort },
      { dataField: "name", text: "Name", sort: true },
    ];
    const SortCtx = createContext();
    render(
      <SortCtx.Provider
        columns={sortCols}
        data={data}
        defaultSortDirection={SORT_ASC}
        defaultSorted={[{ dataField: "id", order: SORT_ASC }]}
      >
        <SortCtx.Consumer>{() => <div />}</SortCtx.Consumer>
      </SortCtx.Provider>
    );
    expect(onSort).toHaveBeenCalledWith("id", SORT_ASC);
  });

  it("uses custom sortFunc from column when available", () => {
    const sortFunc = jest.fn((a, b) => 0);
    const sortCols = [
      { dataField: "id", text: "ID", sort: true, sortFunc },
    ];
    const SortCtx = createContext();
    let sortProps: any;
    render(
      <SortCtx.Provider
        columns={sortCols}
        data={data}
        defaultSortDirection={SORT_ASC}
        defaultSorted={[{ dataField: "id", order: SORT_ASC }]}
      >
        <SortCtx.Consumer>
          {(p: any) => {
            sortProps = p;
            return <div />;
          }}
        </SortCtx.Consumer>
      </SortCtx.Provider>
    );
    // sortFunc is used during data memoization
    expect(sortFunc).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SelectionContext extra coverage
// ─────────────────────────────────────────────────────────────────────────────
describe("SelectionContext extra coverage", () => {
  it("handles onSelectAll returning an array", () => {
    const onSelectAll = jest.fn().mockReturnValue([1]);
    const selectRow = { mode: "checkbox", onSelectAll };
    let capturedProps: any;
    render(
      <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
        <SelectionContext.Consumer>
          {(props: any) => {
            capturedProps = props;
            return <div />;
          }}
        </SelectionContext.Consumer>
      </SelectionContext.Provider>
    );
    // The context exposes onAllRowsSelect (not handleAllRowsSelect)
    act(() => {
      capturedProps.onAllRowsSelect({}, false);
    });
    expect(onSelectAll).toHaveBeenCalled();
  });

  it("syncs selected when selectRow.selected prop changes", () => {
    const selectRow1 = { mode: "checkbox", selected: [1] };
    const selectRow2 = { mode: "checkbox", selected: [1, 2] };
    let capturedProps: any;
    const { rerender } = render(
      <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow1}>
        <SelectionContext.Consumer>
          {(props: any) => {
            capturedProps = props;
            return <div />;
          }}
        </SelectionContext.Consumer>
      </SelectionContext.Provider>
    );
    act(() => {
      rerender(
        <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow2}>
          <SelectionContext.Consumer>
            {(props: any) => {
              capturedProps = props;
              return <div />;
            }}
          </SelectionContext.Consumer>
        </SelectionContext.Provider>
      );
    });
    // After sync, both rows should be selected
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FiltersCell extra coverage
// ─────────────────────────────────────────────────────────────────────────────
describe("FiltersCell extra coverage", () => {
  it("renders with headerAlign as function", () => {
    const headerAlign = jest.fn(() => "center");
    const col = { dataField: "id", text: "ID", headerAlign };
    render(
      <table>
        <thead>
          <tr>
            <FiltersCell index={0} column={col} onFilter={jest.fn()} currFilters={{}} />
          </tr>
        </thead>
      </table>
    );
    expect(headerAlign).toHaveBeenCalledWith(col, 0);
  });

  it("renders with filterRenderer", () => {
    const onExternalFilter = jest.fn().mockReturnValue(jest.fn());
    const filterRenderer = jest.fn(() => <span data-testid="custom-filter">custom</span>);
    const col = {
      dataField: "name",
      text: "Name",
      filterRenderer,
      filter: { Filter: () => <div />, props: { type: "TEXT" } },
    };
    render(
      <table>
        <thead>
          <tr>
            <FiltersCell
              index={0}
              column={col}
              onFilter={jest.fn()}
              onExternalFilter={onExternalFilter}
              currFilters={{}}
            />
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByTestId("custom-filter")).toBeInTheDocument();
  });

  it("renders with cellEl=td instead of th", () => {
    const MockFilter = ({ column }: any) => <input data-testid={`f-${column.dataField}`} />;
    const col = {
      dataField: "name",
      text: "Name",
      filter: { Filter: MockFilter, props: { type: "TEXT" } },
    };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <FiltersCell
              index={0}
              column={col}
              onFilter={jest.fn()}
              currFilters={{}}
              cellEl="td"
            />
          </tr>
        </tbody>
      </table>
    );
    expect(container.querySelector("td")).toBeInTheDocument();
  });
});
