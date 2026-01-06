import React from "react";
import { render } from "@testing-library/react";
import BootstrapTable from "../../react-bootstrap-table-ng/src/bootstrap-table";
import _ from "../../react-bootstrap-table-ng/src/utils";
import { FILTER_TYPES, textFilter } from "..";
import createFilterContext from "../src/context";

describe("FilterContext", () => {
  let FilterContext: any;

  const data = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
  ];

  const columns = [
    { dataField: "id", text: "ID", filter: textFilter() },
    { dataField: "name", text: "Name", filter: textFilter() },
  ];

  const mockBase = jest.fn((props) => (
    <BootstrapTable keyField="id" data={data} columns={columns} {...props} />
  ));

  const handleFilterChange = jest.fn();

  function renderContext(
    enableRemote?: boolean,
    tableColumns?: any[],
    dataChangeListener?: any
  ) {
    if (!enableRemote) enableRemote = false;
    if (!tableColumns) tableColumns = columns;

    mockBase.mockReset();
    handleFilterChange.mockReset();
    FilterContext = createFilterContext(
      _,
      jest.fn().mockReturnValue(enableRemote),
      handleFilterChange
    );
    const filterOptions = {};

    return render(
      <FilterContext.Provider
        columns={tableColumns}
        data={data}
        filter={filterOptions}
        dataChangeListener={dataChangeListener}
      >
        <FilterContext.Consumer>
          {(filterProps: any) => mockBase(filterProps)}
        </FilterContext.Consumer>
      </FilterContext.Provider>
    );
  }

  describe("default render", () => {
    it("should have correct Provider and Consumer property after calling createFilterContext", () => {
      renderContext();
      expect(FilterContext.Provider).toBeDefined();
      expect(FilterContext.Consumer).toBeDefined();
    });

    it("should call mockBase with correct props", () => {
      renderContext();
      expect(mockBase).toHaveBeenCalledWith(
        expect.objectContaining({
          data,
          onFilter: expect.any(Function),
          onExternalFilter: expect.any(Function),
          currFilters: expect.any(Object),
        })
      );
    });
  });

  describe("when remote filter is enable", () => {
    it("should pass original data without internal filtering", () => {
      renderContext(true);
      expect(mockBase).toHaveBeenCalledWith(
        expect.objectContaining({
          data,
          onFilter: expect.any(Function),
          onExternalFilter: expect.any(Function),
          currFilters: expect.any(Object),
        })
      );
    });
  });

  describe("onFilter", () => {
    it("should update currFilters correctly for empty/undefined/[] filterVal", () => {
      renderContext();
      const filterProps = mockBase.mock.calls[0][0];
      const filterVals = ["", undefined, []];
      filterVals.forEach((filterVal) => {
        filterProps.onFilter(columns[1], FILTER_TYPES.TEXT)(filterVal);
        expect(Object.keys(filterProps.currFilters)).toHaveLength(0);
      });
    });

    it("should update currFilters correctly for existing filterVal", () => {
      renderContext();
      const filterProps = mockBase.mock.calls[0][0];
      filterProps.onFilter(columns[1], FILTER_TYPES.TEXT)("3");
      expect(Object.keys(filterProps.currFilters)).toHaveLength(1);
    });

    it("should call handleFilterChange when remote filter is enabled", () => {
      renderContext(true);
      const filterProps = mockBase.mock.calls[0][0];
      filterProps.onFilter(columns[1], FILTER_TYPES.TEXT)("3");
      expect(handleFilterChange).toHaveBeenCalledTimes(1);
      expect(handleFilterChange).toHaveBeenCalledWith(filterProps.currFilters);
    });

    it("should not call handleFilterChange when remote filter is enabled but initialize argument is true", () => {
      renderContext(true);
      const filterProps = mockBase.mock.calls[0][0];
      filterProps.onFilter(columns[1], FILTER_TYPES.TEXT, true)("3");
      expect(handleFilterChange).not.toHaveBeenCalled();
    });

    it("should call filter.props.onFilter and set data correctly", () => {
      const mockReturn = [{ id: 1, name: "A" }];
      const filterVal = "A";
      const onFilterFn = jest.fn().mockReturnValue(mockReturn);
      const customColumns = columns.map((column, i) =>
        i === 1 ? { ...column, filter: textFilter({ onFilter: onFilterFn }) } : column
      );
      renderContext(false, customColumns);
      const filterProps = mockBase.mock.calls[0][0];
      filterProps.onFilter(customColumns[1], FILTER_TYPES.TEXT)(filterVal);
      expect(onFilterFn).toHaveBeenCalledTimes(1);
      expect(onFilterFn).toHaveBeenCalledWith(filterVal, data);
    });

    it("should call dataChangeListener.emit correctly", () => {
      const filterVal = "3";
      const dataChangeListener = { emit: jest.fn() };
      renderContext(false, columns, dataChangeListener);
      const filterProps = mockBase.mock.calls[0][0];
      filterProps.onFilter(columns[1], FILTER_TYPES.TEXT)(filterVal);
      expect(dataChangeListener.emit).toHaveBeenCalledWith(
        "filterChanged",
        0
      );
    });

    it("should set correct currFilters in combination", () => {
      renderContext();
      const filterProps = mockBase.mock.calls[0][0];
      filterProps.onFilter(columns[0], FILTER_TYPES.TEXT)("3");
      expect(Object.keys(filterProps.currFilters)).toHaveLength(1);

      filterProps.onFilter(columns[0], FILTER_TYPES.TEXT)("2");
      expect(Object.keys(filterProps.currFilters)).toHaveLength(1);

      filterProps.onFilter(columns[1], FILTER_TYPES.TEXT)("2");
      expect(Object.keys(filterProps.currFilters)).toHaveLength(2);

      filterProps.onFilter(columns[1], FILTER_TYPES.TEXT)("");
      expect(Object.keys(filterProps.currFilters)).toHaveLength(1);

      filterProps.onFilter(columns[0], FILTER_TYPES.TEXT)("");
      expect(Object.keys(filterProps.currFilters)).toHaveLength(0);
    });
  });
});
