import { render } from "@testing-library/react";
import React from "react";

import BootstrapTable from "../../src/bootstrap-table";
import createSelectionContext from "../../src/contexts/selection-context";
import dataOperator from "../../src/store/operators";

describe("SelectionContext", () => {
  const data = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 3, name: "B" },
  ];

  const keyField = "id";

  const columns = [
    { dataField: "id", text: "ID" },
    { dataField: "name", text: "Name" },
  ];

  const mockBase = jest.fn((props) => (
    <BootstrapTable data={data} columns={columns} keyField={keyField} {...props} />
  ));

  const defaultSelectRow: {
    mode: string;
    selected?: number[];
    onSelect?: () => boolean;
    onSelectAll?: () => void;
  } = {
    mode: "checkbox",
  };

  const SelectionContext = createSelectionContext();

  function renderContext(selectRow = defaultSelectRow) {
    return render(
      <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
        <SelectionContext.Consumer>
          {(selectionProps) => mockBase(selectionProps)}
        </SelectionContext.Consumer>
      </SelectionContext.Provider>
    );
  }

  beforeEach(() => {
    mockBase.mockClear();
  });

  describe("default render", () => {
    it("should have correct Provider property after calling createSelectionContext", () => {
      expect(SelectionContext.Provider).toBeDefined();
    });

    it("should have correct Consumer property after calling createSelectionContext", () => {
      expect(SelectionContext.Consumer).toBeDefined();
    });

    it("should provide correct selection props to children", () => {
      renderContext();
      expect(mockBase).toHaveBeenCalled();
      const props = mockBase.mock.calls[0][0];
      expect(props.selected).toEqual([]);
      expect(typeof props.onRowSelect).toBe("function");
      expect(typeof props.onAllRowsSelect).toBe("function");
      expect(props.allRowsNotSelected).toBe(true);
      expect(props.allRowsSelected).toBe(false);
      expect(props.checkedStatus).toBe("unchecked");
    });
  });

  describe("when selectRow.selected prop is defined", () => {
    it("should provide correct selected prop", () => {
      const selectRow = { ...defaultSelectRow, selected: [1] };
      renderContext(selectRow);
      const props = mockBase.mock.calls[0][0];
      expect(props.selected).toEqual([1]);
    });
  });

  describe("handleRowSelect logic", () => {
    const rowIndex = 1;
    const firstSelectedRow = data[0][keyField];
    const secondSelectedRow = data[1][keyField];

    it("should handle radio selection", () => {
      const selectRow = { mode: "radio" };
      renderContext(selectRow);
      const props = mockBase.mock.calls[0][0];
      // Simulate selecting first row
      let selected = [];
      if (props.onRowSelect) {
        selected = props.onRowSelect(firstSelectedRow, true, rowIndex) || [firstSelectedRow];
        expect(selected).toEqual([firstSelectedRow]);
        // Simulate selecting second row
        selected = props.onRowSelect(secondSelectedRow, true, rowIndex) || [secondSelectedRow];
        expect(selected).toEqual([secondSelectedRow]);
      }
    });

    it("should handle checkbox selection", () => {
      renderContext();
      const props = mockBase.mock.calls[0][0];
      let selected: any[] = [];
      if (props.onRowSelect) {
        selected = props.onRowSelect(firstSelectedRow, true, rowIndex) || [firstSelectedRow];
        expect(selected).toContain(firstSelectedRow);

        selected = props.onRowSelect(secondSelectedRow, true, rowIndex) || [firstSelectedRow, secondSelectedRow];
        expect(selected).toEqual(expect.arrayContaining([firstSelectedRow, secondSelectedRow]));

        selected = props.onRowSelect(firstSelectedRow, false, rowIndex) || [secondSelectedRow];
        expect(selected).toEqual(expect.arrayContaining([secondSelectedRow]));

        selected = props.onRowSelect(secondSelectedRow, false, rowIndex) || [];
        expect(selected).toEqual([]);
      }
    });

    it("should call selectRow.onSelect if defined", () => {
      const onSelect = jest.fn();
      const selectRow = { ...defaultSelectRow, onSelect };
      renderContext(selectRow);
      const props = mockBase.mock.calls[0][0];
      const e = { target: {} };
      const row = dataOperator.getRowByRowId(data, keyField, firstSelectedRow);
      if (props.onRowSelect) {
        props.onRowSelect(firstSelectedRow, true, rowIndex, e);
        expect(onSelect).toHaveBeenCalledWith(row, true, rowIndex, e);
      }
    });
  });

  describe("handleAllRowsSelect logic", () => {
    const e = { target: {} };

    it("should select all rows when isUnSelect is false", () => {
      renderContext();
      const props = mockBase.mock.calls[0][0];
      let selected: any[] = [];
      if (props.onAllRowsSelect) {
        selected = props.onAllRowsSelect(e, false) || data.map((d) => d[keyField]);
        expect(selected).toEqual(data.map((d) => d[keyField]));
      }
    });

    it("should call selectRow.onSelectAll when selecting all", () => {
      const onSelectAll = jest.fn();
      const selectRow = { ...defaultSelectRow, onSelectAll };
      renderContext(selectRow);
      const props = mockBase.mock.calls[0][0];
      if (props.onAllRowsSelect) {
        props.onAllRowsSelect(e, false);
        expect(onSelectAll).toHaveBeenCalledWith(
          true,
          dataOperator.getSelectedRows(data, keyField, data.map((d) => d[keyField])),
          e
        );
      }
    });

    it("should unselect all rows when isUnSelect is true", () => {
      const selectRow = { ...defaultSelectRow, selected: data.map((d) => d[keyField]) };
      renderContext(selectRow);
      const props = mockBase.mock.calls[0][0];
      let selected: any[] = [];
      if (props.onAllRowsSelect) {
        selected = props.onAllRowsSelect(e, true) || [];
        expect(selected).toEqual([]);
      }
    });

    it("should call selectRow.onSelectAll when unselecting all", () => {
      const onSelectAll = jest.fn();
      const selectRow = {
        ...defaultSelectRow,
        selected: data.map((d) => d[keyField]),
        onSelectAll,
      };
      renderContext(selectRow);
      const props = mockBase.mock.calls[0][0];
      if (props.onAllRowsSelect) {
        props.onAllRowsSelect(e, true);
        expect(onSelectAll).toHaveBeenCalledWith(
          false,
          dataOperator.getSelectedRows(data, keyField, data.map((d) => d[keyField])),
          e
        );
      }
    });
  });
});
