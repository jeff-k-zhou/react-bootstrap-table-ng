/**
 * @jest-environment jsdom
 */

import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import dataOperator from "../../react-bootstrap-table-ng/src/store/operators";
import _ from "../../react-bootstrap-table-ng/src/utils";

import cellEditFactory, { CLICK_TO_CELL_EDIT, DBCLICK_TO_CELL_EDIT, DELAY_FOR_DBCLICK } from "../index";
import createCellEditContext, { Consumer } from "../src/context";

describe("CellEditContext", () => {
  let cellEdit: any;
  let CellEditContext: any;

  const data = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
  ];

  const keyField = "id";

  const columns = [
    { dataField: "id", text: "ID" },
    { dataField: "name", text: "Name" },
  ];

  const defaultCellEdit = {
    mode: CLICK_TO_CELL_EDIT,
    beforeSaveCell: () => {},
    afterSaveCell: () => {},
  };

  const defaultSelectRow = {};

  let capturedProps: any = null;
  const handleCellChange = jest.fn();

  function renderContext(
    customCellEdit: any = defaultCellEdit,
    enableRemote = false,
    selectRow = defaultSelectRow,
    extraProps: any = {}
  ) {
    capturedProps = null;
    handleCellChange.mockReset();
    CellEditContext = createCellEditContext(
      _,
      dataOperator,
      jest.fn().mockReturnValue(enableRemote),
      handleCellChange
    );
    cellEdit = cellEditFactory(customCellEdit);
    return render(
      <CellEditContext.Provider
        cellEdit={cellEdit}
        keyField={keyField}
        columns={columns}
        selectRow={selectRow}
        data={data}
        {...extraProps}
      >
        <Consumer>
          {(props: any) => {
            capturedProps = props;
            return <div data-testid="cell-edit-consumer">rendered</div>;
          }}
        </Consumer>
      </CellEditContext.Provider>
    );
  }

  describe("default render", () => {
    beforeEach(() => {
      renderContext();
    });

    it("should have correct Provider property after calling createCellEditContext", () => {
      expect(CellEditContext.Provider).toBeDefined();
    });

    it("should pass correct cell editing props to children element", () => {
      expect(capturedProps).toEqual(
        expect.objectContaining({
          ...defaultCellEdit,
          DBCLICK_TO_CELL_EDIT,
          DELAY_FOR_DBCLICK,
          nonEditableRows: [],
          ridx: null,
          cidx: null,
          message: null,
        })
      );
    });
  });

  describe("remote cell editing errorMessage in props", () => {
    it("sets message when errorMessage is provided in remote mode", () => {
      renderContext({ ...defaultCellEdit, errorMessage: "Remote error" }, true);
      expect(capturedProps.message).toBe("Remote error");
    });

    it("clears message when errorMessage is not provided in remote mode", () => {
      renderContext({ ...defaultCellEdit }, true);
      expect(capturedProps.message).toBeNull();
    });
  });

  describe("startEditing", () => {
    it("starts editing when selectRow is not defined", () => {
      renderContext();
      act(() => {
        capturedProps.atstart(0, 1);
      });
      expect(capturedProps.ridx).toBe(0);
      expect(capturedProps.cidx).toBe(1);
    });

    it("starts editing when clickToEdit is true", () => {
      renderContext(defaultCellEdit, false, { clickToSelect: true, clickToEdit: true });
      act(() => {
        capturedProps.atstart(1, 0);
      });
      expect(capturedProps.ridx).toBe(1);
      expect(capturedProps.cidx).toBe(0);
    });

    it("starts editing when clickToSelect is false", () => {
      renderContext(defaultCellEdit, false, { clickToSelect: false, clickToEdit: false });
      act(() => {
        capturedProps.atstart(0, 0);
      });
      expect(capturedProps.ridx).toBe(0);
      expect(capturedProps.cidx).toBe(0);
    });

    it("does not start editing when clickToSelect is true and clickToEdit is false", () => {
      renderContext(defaultCellEdit, false, { clickToSelect: true, clickToEdit: false });
      act(() => {
        capturedProps.atstart(0, 0);
      });
      expect(capturedProps.ridx).toBeNull();
      expect(capturedProps.cidx).toBeNull();
    });
  });

  describe("escapeEditing", () => {
    it("resets ridx and cidx when onEscape is called", () => {
      renderContext();
      act(() => {
        capturedProps.atstart(1, 1);
      });
      expect(capturedProps.ridx).toBe(1);

      act(() => {
        capturedProps.onEscape();
      });
      expect(capturedProps.ridx).toBeNull();
      expect(capturedProps.cidx).toBeNull();
    });
  });

  describe("handleCellUpdate", () => {
    const row = data[0];
    const column = columns[1];
    const newValue = "New A";

    it("updates cell in non-remote mode and triggers afterSaveCell", () => {
      const afterSaveCell = jest.fn();
      renderContext({ ...defaultCellEdit, afterSaveCell }, false);

      act(() => {
        capturedProps.atstart(0, 1);
      });

      act(() => {
        capturedProps.onUpdate(row, column, newValue);
      });

      expect(afterSaveCell).toHaveBeenCalledWith(
        "A",
        "New A",
        row,
        column
      );
      expect(capturedProps.ridx).toBeNull();
    });

    it("calls handleCellChange in remote mode", () => {
      const afterSaveCell = jest.fn();
      renderContext({ ...defaultCellEdit, afterSaveCell }, true);

      act(() => {
        capturedProps.onUpdate(row, column, newValue);
      });

      expect(handleCellChange).toHaveBeenCalledWith(1, "name", "New A");
      expect(afterSaveCell).not.toHaveBeenCalled();
    });

    it("handles beforeSaveCell returning async object", () => {
      const beforeSaveCell = jest.fn().mockReturnValue({ async: true });
      renderContext({ ...defaultCellEdit, beforeSaveCell }, false);

      act(() => {
        capturedProps.onUpdate(row, column, newValue);
      });

      expect(beforeSaveCell).toHaveBeenCalled();
      expect(handleCellChange).not.toHaveBeenCalled();
    });

    it("handles beforeSaveCell calling done(false) which calls onEscape", () => {
      const beforeSaveCell = jest.fn((oldVal, newVal, r, c, done) => {
        done(false);
      });
      renderContext({ ...defaultCellEdit, beforeSaveCell }, false);

      act(() => {
        capturedProps.atstart(0, 1);
      });

      act(() => {
        capturedProps.onUpdate(row, column, newValue);
      });

      expect(beforeSaveCell).toHaveBeenCalled();
      expect(capturedProps.ridx).toBeNull();
    });

    it("handles beforeSaveCell calling done(true) which saves", () => {
      const afterSaveCell = jest.fn();
      const beforeSaveCell = jest.fn((oldVal, newVal, r, c, done) => {
        done(true);
      });
      renderContext({ ...defaultCellEdit, beforeSaveCell, afterSaveCell }, false);

      act(() => {
        capturedProps.onUpdate(row, column, newValue);
      });

      expect(afterSaveCell).toHaveBeenCalled();
    });

    it("handles onUpdate when beforeSaveCell and afterSaveCell are omitted", () => {
      renderContext({ mode: CLICK_TO_CELL_EDIT }, false);
      act(() => {
        capturedProps.onUpdate(row, column, newValue);
      });
      // data is mutated in place by dataOperator.editCell; capturedProps does not expose data
      // so we check the original data array reference
      expect(data[0].name).toBe(newValue);
    });

    it("handles beforeSaveCell calling done() without arguments (default true)", () => {
      const beforeSaveCell = jest.fn((oldVal, newVal, r, c, done) => {
        done();
      });
      renderContext({ mode: CLICK_TO_CELL_EDIT, beforeSaveCell }, false);
      act(() => {
        capturedProps.onUpdate(row, column, newValue);
      });
      expect(beforeSaveCell).toHaveBeenCalled();
    });
  });

  describe("nonEditableRows", () => {
    it("calls nonEditableRows callback if provided", () => {
      const nonEditableRows = jest.fn().mockReturnValue([1]);
      renderContext({ ...defaultCellEdit, nonEditableRows });
      expect(capturedProps.nonEditableRows).toEqual([1]);
      expect(nonEditableRows).toHaveBeenCalled();
    });
  });
});


