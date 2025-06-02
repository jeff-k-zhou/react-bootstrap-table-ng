import { render } from "@testing-library/react";
import React from "react";

import { SORT_ASC, SORT_DESC } from "../..";
import BootstrapTable from "../../src/bootstrap-table";
import createSortContext from "../../src/contexts/sort-context";
import dataOperator from "../../src/store/operators";

describe("SortContext", () => {
  let columns: any;
  let SortContext: any;
  let data: any;

  const mockBase = jest.fn((props) => (
    <BootstrapTable data={data} columns={columns} keyField="id" {...props} />
  ));

  const handleRemoteSortChange = jest.fn();

  function renderContext(enableRemote = false, providerProps = {}) {
    handleRemoteSortChange.mockReset();
    mockBase.mockReset();
    SortContext = createSortContext(
      dataOperator,
      jest.fn().mockReturnValue(enableRemote),
      handleRemoteSortChange
    );
    return render(
      <SortContext.Provider columns={columns} data={data} {...providerProps}>
        <SortContext.Consumer>
          {(sortProps: any) => mockBase(sortProps)}
        </SortContext.Consumer>
      </SortContext.Provider>
    );
  }

  beforeEach(() => {
    data = [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
    ];
    columns = [
      { dataField: "id", text: "ID", sort: true },
      { dataField: "name", text: "Name", sort: true },
    ];
    mockBase.mockClear();
    handleRemoteSortChange.mockClear();
  });

  describe("default render", () => {
    it("should have correct Provider property after calling createSortContext", () => {
      renderContext();
      expect(SortContext.Provider).toBeDefined();
    });

    it("should have correct Consumer property after calling createSortContext", () => {
      renderContext();
      expect(SortContext.Consumer).toBeDefined();
    });

    it("should provide correct sort props to children element", () => {
      renderContext();
      expect(mockBase).toHaveBeenCalled();
      const props = mockBase.mock.calls[0][0];
      expect(props.data).toEqual(data);
      expect(props.sortOrder).toBeUndefined();
      expect(typeof props.onSort).toBe("function");
      expect(props.sortField).toBeNull();
    });
  });

  describe("handleSort function", () => {
    let sortColumn: any;
    let nextOrderSpy: any;

    beforeEach(() => {
      sortColumn = columns[0];
      nextOrderSpy = jest.spyOn(dataOperator, "nextOrder");
    });

    afterEach(() => {
      nextOrderSpy.mockRestore();
    });

    describe("when remote.sort is false", () => {
      it("should set sort props and call dataOperator.nextOrder correctly", () => {
        renderContext(false);
        const props = mockBase.mock.calls[0][0];
        // Simulate sort
        props.onSort(sortColumn);
        expect(nextOrderSpy).toHaveBeenCalledTimes(1);
        expect(nextOrderSpy).toHaveBeenCalledWith(
          sortColumn,
          { sortColumn: undefined, sortOrder: undefined },
          undefined
        );
      });
    });

    describe("when remote.sort is true", () => {
      it("should call handleRemoteSortChange", () => {
        renderContext(true);
        const props = mockBase.mock.calls[0][0];
        props.onSort(sortColumn);
        expect(handleRemoteSortChange).toHaveBeenCalledTimes(1);
        expect(handleRemoteSortChange).toHaveBeenCalledWith(
          sortColumn.dataField,
          SORT_DESC
        );
      });
    });

    describe("when column.onSort prop is defined", () => {
      const onSortCB = jest.fn();

      it("should call column.onSort function correctly", () => {
        columns[0].onSort = onSortCB;
        renderContext(false);
        const props = mockBase.mock.calls[0][0];
        props.onSort(sortColumn);
        expect(onSortCB).toHaveBeenCalledTimes(1);
        expect(onSortCB).toHaveBeenCalledWith(columns[0].dataField, SORT_DESC);

        // Simulate toggling sort order
        props.onSort(sortColumn);
        expect(onSortCB).toHaveBeenCalledTimes(2);
        expect(onSortCB).toHaveBeenCalledWith(columns[0].dataField, SORT_ASC);
      });
    });
  });

  describe("when defaultSorted prop is defined", () => {
    const defaultSorted = [
      {
        dataField: "name",
        order: SORT_DESC,
      },
    ];

    it("should provide correct sort props to children element", () => {
      renderContext(false, { defaultSorted });
      expect(mockBase).toHaveBeenCalled();
      const props = mockBase.mock.calls[0][0];
      expect(props.sortOrder).toBe(defaultSorted[0].order);
      expect(props.sortField).toBe("name");
    });

    it("should call column.onSort if defined", () => {
      const onSortCB = jest.fn();
      columns[1].onSort = onSortCB;
      renderContext(false, { defaultSorted });
      expect(onSortCB).toHaveBeenCalledTimes(1);
      expect(onSortCB).toHaveBeenCalledWith(
        defaultSorted[0].dataField,
        defaultSorted[0].order
      );
    });

    it("should call handleRemoteSortChange if remote.sort is true", () => {
      renderContext(true, { defaultSorted });
      expect(handleRemoteSortChange).toHaveBeenCalledTimes(1);
      expect(handleRemoteSortChange).toHaveBeenCalledWith(
        defaultSorted[0].dataField,
        defaultSorted[0].order
      );
    });
  });
});
