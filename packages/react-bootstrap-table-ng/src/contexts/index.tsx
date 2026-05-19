import EventEmitter from "events";
import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useId,
  useImperativeHandle,
  useCallback,
} from "react";
import { useRemoteResolver } from "../props-resolver/remote-resolver";
import dataOperator from "../store/operators";
import _ from "../utils";
import { BootstrapContext } from "./bootstrap";
import createColumnContext from "./column-context";
import createDataContext from "./data-context";
import createRowExpandContext from "./row-expand-context";
import createSelectionContext from "./selection-context";
import createSortContext from "./sort-context";

const EMPTY_OBJECT = {};

const withContext = (Base: any) => {
  const BootstrapTableContainer = React.forwardRef((props: any, ref: any) => {
    const generatedId = useId();
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

    const tableRef = useRef<any>(null);
    const selectionContextRef = useRef<any>(null);
    const rowExpandContextRef = useRef<any>(null);
    const paginationContextRef = useRef<any>(null);
    const sortContextRef = useRef<any>(null);
    const searchContextRef = useRef<any>(null);
    const filterContextRef = useRef<any>(null);
    const cellEditContextRef = useRef<any>(null);

    const remoteEmitter = useRef(new EventEmitter()).current;

    const remoteResolver = useRemoteResolver(props);

    const onColumnResize = useCallback((dataField: string, width: number) => {
      setColumnWidths((prevState) => ({
        ...prevState,
        [dataField]: width,
      }));
    }, []);

    // Initial setup for remoteEmitter and registerExposedAPI
    useEffect(() => {
      const handleRemotePageChange = (page: number, sizePerPage: number) => {
        remoteResolver.handleRemotePageChange(page, sizePerPage);
      };
      remoteEmitter.on("paginationChange", handleRemotePageChange);

      remoteEmitter.on("isRemotePagination", (e: any) => {
        e.result = remoteResolver.isRemotePagination();
      });

      if (props.registerExposedAPI) {
        const exposedAPIEmitter = new EventEmitter();
        exposedAPIEmitter.on(
          "get.table.data",
          (payload: any) => (payload.result = tableRef.current?.getData())
        );
        exposedAPIEmitter.on(
          "get.selected.rows",
          (payload: any) =>
            (payload.result = selectionContextRef.current?.getSelected())
        );
        exposedAPIEmitter.on("get.filtered.rows", (payload: any) => {
          if (searchContextRef.current) {
            payload.result = searchContextRef.current.getSearched();
          } else if (filterContextRef.current) {
            payload.result = filterContextRef.current.getFiltered();
          } else {
            payload.result = tableRef.current?.getData();
          }
        });
        props.registerExposedAPI(exposedAPIEmitter);
      }

      if (props.setPaginationRemoteEmitter) {
        props.setPaginationRemoteEmitter(remoteEmitter);
      }

      if (props.setDependencyModules) {
        props.setDependencyModules(_);
      }

      return () => {
        remoteEmitter.removeListener("paginationChange", handleRemotePageChange);
        remoteEmitter.removeAllListeners("isRemotePagination");
      };
    }, []); // Run once on mount

    // Expose API
    useImperativeHandle(ref, () => ({
      ...remoteResolver,
      get table() { return tableRef.current; },
      get selectionContext() { return selectionContextRef.current; },
      get rowExpandContext() { return rowExpandContextRef.current; },
      get paginationContext() { return paginationContextRef.current; },
      get sortContext() { return sortContextRef.current; },
      get searchContext() { return searchContextRef.current; },
      get filterContext() { return filterContextRef.current; },
      get cellEditContext() { return cellEditContextRef.current; },
    }));

    // Context objects - using useMemo to keep them stable
    const DataContextObj = useMemo(() => createDataContext(), []);

    const sortEnabled = props.columns.some((col: any) => col.sort);
    const SortContextObj = useMemo(() => {
      if (sortEnabled) {
        return createSortContext(
          dataOperator as any,
          remoteResolver.isRemoteSort,
          remoteResolver.handleRemoteSortChange
        );
      }
      return null;
    }, [
      sortEnabled,
      remoteResolver.isRemoteSort,
      remoteResolver.handleRemoteSortChange,
    ]);

    const columnContextEnabled =
      props.columnToggle ||
      props.columnResize ||
      props.columns.some((col: any) => col.hidden);
    const ColumnContextObj = useMemo(() => {
      if (columnContextEnabled) {
        return createColumnContext();
      }
      return null;
    }, [columnContextEnabled]);

    const SelectionContextObj = useMemo(() => {
      if (props.selectRow) {
        return createSelectionContext();
      }
      return null;
    }, [!!props.selectRow]);

    const RowExpandContextObj = useMemo(() => {
      if (props.expandRow) {
        return createRowExpandContext();
      }
      return null;
    }, [!!props.expandRow]);

    const CellEditContextObj = useMemo(() => {
      if (props.cellEdit && props.cellEdit.createContext) {
        return props.cellEdit.createContext(
          _,
          dataOperator,
          remoteResolver.isRemoteCellEdit,
          remoteResolver.handleRemoteCellChange
        );
      }
      return null;
    }, [
      !!props.cellEdit,
      remoteResolver.isRemoteCellEdit,
      remoteResolver.handleRemoteCellChange,
    ]);

    const FilterContextObj = useMemo(() => {
      if (props.filter) {
        const context = props.filter.createContext(
          _,
          remoteResolver.isRemoteFiltering,
          remoteResolver.handleRemoteFilterChange
        );
        return {
          ...context,
          _: _,
          isRemoteFiltering: remoteResolver.isRemoteFiltering,
          handleFilterChange: remoteResolver.handleRemoteFilterChange,
        };
      }
      return null;
    }, [
      !!props.filter,
      remoteResolver.isRemoteFiltering,
      remoteResolver.handleRemoteFilterChange,
    ]);

    const PaginationContextObj = useMemo(() => {
      if (props.pagination) {
        return props.pagination.createContext(
          remoteResolver.isRemotePagination,
          remoteResolver.handleRemotePageChange
        );
      }
      return null;
    }, [
      !!props.pagination,
      remoteResolver.isRemotePagination,
      remoteResolver.handleRemotePageChange,
    ]);

    const SearchContextObj = useMemo(() => {
      if (props.search && props.search.searchContext) {
        const context = props.search.searchContext(
          _,
          remoteResolver.isRemoteSearch,
          remoteResolver.handleRemoteSearchChange
        );
        return {
          ...context,
          _: _,
          isRemoteSearch: remoteResolver.isRemoteSearch,
          handleRemoteSearchChange: remoteResolver.handleRemoteSearchChange,
          options: context.options,
        };
      }
      return null;
    }, [
      !!props.search,
      remoteResolver.isRemoteSearch,
      remoteResolver.handleRemoteSearchChange,
    ]);

    const { keyField, columns, bootstrap4, bootstrap5, data } = props;
    const baseProps = useMemo(() => ({ keyField, columns }), [keyField, columns]);

    const bootstrapContextValue = useMemo(() => ({ bootstrap4, bootstrap5 }), [bootstrap4, bootstrap5]);

    const renderTable = (
      rootProps: any,
      filterProps?: any,
      searchProps?: any,
      sortProps?: any,
      paginationProps?: any,
      columnToggleProps?: any
    ) => {
      const resolvedColumns =
        columnToggleProps && columnToggleProps.columns
          ? columnToggleProps.columns.map((column: any) => {
            if (columnWidths[column.dataField]) {
              return {
                ...column,
                width: columnWidths[column.dataField],
              };
            }
            return column;
          })
          : columns;

      return (
        <Base
          ref={(n: any) => {
            tableRef.current = n;
          }}
          {...props}
          {...sortProps}
          {...filterProps}
          {...searchProps}
          {...paginationProps}
          {...columnToggleProps}
          columns={resolvedColumns}
          data={rootProps.getData(
            filterProps,
            searchProps,
            sortProps,
            paginationProps
          )}
        />
      );
    };

    const renderProviderTree = () => {
      // Data flows from DataContext -> CellEdit -> Filter -> Search -> Sort -> Pagination -> RowExpand -> Selection -> Column -> renderTable

      // Initial context is CellEdit
      let currentTree = (
        <DataContextObj.Consumer>
          {(innerRootProps: any) => {
            const wrapFilter = (cellEditProps?: any) => {
              if (!FilterContextObj) return wrapSearch(cellEditProps);
              return (
                <FilterContextObj.Provider
                  {...baseProps}
                  ref={(n: any) => { filterContextRef.current = n; }}
                  data={innerRootProps.getData()}
                  filter={props.filter.options || EMPTY_OBJECT}
                  dataChangeListener={props.dataChangeListener}
                  _={FilterContextObj._}
                  isRemoteFiltering={FilterContextObj.isRemoteFiltering}
                  handleFilterChange={FilterContextObj.handleFilterChange}
                >
                  <FilterContextObj.Consumer>
                    {(filterProps: any) => wrapSearch(cellEditProps, filterProps)}
                  </FilterContextObj.Consumer>
                </FilterContextObj.Provider>
              );
            };

            const wrapSearch = (cellEditProps?: any, filterProps?: any) => {
              if (!SearchContextObj) return wrapSort(cellEditProps, filterProps);
              return (
                <SearchContextObj.Provider
                  {...baseProps}
                  ref={(n: any) => { searchContextRef.current = n; }}
                  data={innerRootProps.getData(filterProps)}
                  searchText={props.search.searchText}
                  dataChangeListener={props.dataChangeListener}
                  options={SearchContextObj.options || EMPTY_OBJECT}
                  _={SearchContextObj._}
                  isRemoteSearch={SearchContextObj.isRemoteSearch}
                  handleRemoteSearchChange={SearchContextObj.handleRemoteSearchChange}
                >
                  <SearchContextObj.Consumer>
                    {(searchProps: any) => wrapSort(cellEditProps, filterProps, searchProps)}
                  </SearchContextObj.Consumer>
                </SearchContextObj.Provider>
              );
            };

            const wrapSort = (cellEditProps?: any, filterProps?: any, searchProps?: any) => {
              if (!SortContextObj) return wrapPagination(cellEditProps, filterProps, searchProps);
              return (
                <SortContextObj.Provider
                  {...baseProps}
                  ref={(n: any) => { sortContextRef.current = n; }}
                  defaultSorted={props.defaultSorted}
                  defaultSortDirection={props.defaultSortDirection}
                  sort={props.sort}
                  data={innerRootProps.getData(filterProps, searchProps)}
                >
                  <SortContextObj.Consumer>
                    {(sortProps: any) => wrapPagination(cellEditProps, filterProps, searchProps, sortProps)}
                  </SortContextObj.Consumer>
                </SortContextObj.Provider>
              );
            };

            const wrapPagination = (cellEditProps?: any, filterProps?: any, searchProps?: any, sortProps?: any) => {
              if (!PaginationContextObj) return wrapRowExpand(cellEditProps, filterProps, searchProps, sortProps);
              return (
                <PaginationContextObj.Provider
                  ref={(n: any) => { paginationContextRef.current = n; }}
                  pagination={props.pagination}
                  data={innerRootProps.getData(filterProps, searchProps, sortProps)}
                  bootstrap4={props.bootstrap4}
                  bootstrap5={props.bootstrap5}
                  isRemotePagination={remoteResolver.isRemotePagination}
                  remoteEmitter={remoteEmitter}
                  onDataSizeChange={props.onDataSizeChange}
                  tableId={props.id || generatedId}
                >
                  <PaginationContextObj.Consumer>
                    {(paginationProps: any) => wrapRowExpand(cellEditProps, filterProps, searchProps, sortProps, paginationProps)}
                  </PaginationContextObj.Consumer>
                </PaginationContextObj.Provider>
              );
            };

            const wrapRowExpand = (cellEditProps?: any, filterProps?: any, searchProps?: any, sortProps?: any, paginationProps?: any) => {
              if (!RowExpandContextObj) return wrapSelection(cellEditProps, filterProps, searchProps, sortProps, paginationProps);
              return (
                <RowExpandContextObj.Provider
                  {...baseProps}
                  ref={(n: any) => { rowExpandContextRef.current = n; }}
                  expandRow={props.expandRow}
                  data={innerRootProps.getData(filterProps, searchProps, sortProps, paginationProps)}
                >
                  {wrapSelection(cellEditProps, filterProps, searchProps, sortProps, paginationProps)}
                </RowExpandContextObj.Provider>
              );
            };

            const wrapSelection = (cellEditProps?: any, filterProps?: any, searchProps?: any, sortProps?: any, paginationProps?: any) => {
              if (!SelectionContextObj) return wrapColumn(cellEditProps, filterProps, searchProps, sortProps, paginationProps);
              return (
                <SelectionContextObj.Provider
                  {...baseProps}
                  ref={(n: any) => { selectionContextRef.current = n; }}
                  selectRow={props.selectRow}
                  data={innerRootProps.getData(filterProps, searchProps, sortProps, paginationProps)}
                >
                  {wrapColumn(cellEditProps, filterProps, searchProps, sortProps, paginationProps)}
                </SelectionContextObj.Provider>
              );
            };

            const wrapColumn = (cellEditProps?: any, filterProps?: any, searchProps?: any, sortProps?: any, paginationProps?: any) => {
              if (!ColumnContextObj) return renderTable(innerRootProps, filterProps, searchProps, sortProps, paginationProps);
              return (
                <ColumnContextObj.Provider
                  {...baseProps}
                  data={innerRootProps.getData(filterProps, searchProps, sortProps, paginationProps)}
                  toggles={props.columnToggle ? props.columnToggle.toggles : null}
                  onColumnResize={onColumnResize}
                >
                  <ColumnContextObj.Consumer>
                    {(columnToggleProps: any) => renderTable(innerRootProps, filterProps, searchProps, sortProps, paginationProps, columnToggleProps)}
                  </ColumnContextObj.Consumer>
                </ColumnContextObj.Provider>
              );
            };

            if (CellEditContextObj) {
              return (
                <CellEditContextObj.Provider
                  {...baseProps}
                  ref={(n: any) => { cellEditContextRef.current = n; }}
                  selectRow={props.selectRow}
                  cellEdit={props.cellEdit}
                  data={innerRootProps.getData()}
                >
                  <CellEditContextObj.Consumer>
                    {(cellEditProps: any) => wrapFilter(cellEditProps)}
                  </CellEditContextObj.Consumer>
                </CellEditContextObj.Provider>
              );
            }
            return wrapFilter();
          }}
        </DataContextObj.Consumer>
      );

      return currentTree;
    };

    return (
      <BootstrapContext.Provider value={bootstrapContextValue}>
        <DataContextObj.Provider {...baseProps} data={data}>
          {renderProviderTree()}
        </DataContextObj.Provider>
      </BootstrapContext.Provider>
    );

  });

  (BootstrapTableContainer as any).displayName = "BootstrapTableContainer";
  return BootstrapTableContainer;
};

export default withContext;

