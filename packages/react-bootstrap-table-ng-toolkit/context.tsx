import React, { useState, useCallback, useMemo, useRef } from "react";
import createSearchContext from "./src/search/context";
import { getMetaInfo, save, transform } from "./src/csv/exporter";

const ToolkitContext = React.createContext<any>(null);

const csvDefaultOptions = {
  fileName: "spreadsheet.csv",
  separator: ",",
  ignoreHeader: false,
  ignoreFooter: true,
  noAutoBOM: true,
  blobType: "text/plain;charset=utf-8",
  exportAll: true,
  onlyExportSelection: false,
  onlyExportFiltered: false,
};

const ToolkitProvider = (props: any) => {
  const {
    search,
    columnToggle: columnToggleEnabled,
    columns,
    data,
    keyField,
    exportCSV,
    bootstrap4 = false,
    bootstrap5 = false,
    columnResize = false,
    children,
    insertRow,
    deleteRow,
  } = props;

  const [searchText, setSearchText] = useState(() => {
    return typeof search === "object" ? search.defaultSearch || "" : "";
  });

  const [columnToggle, setColumnToggle] = useState(() => {
    if (columnToggleEnabled) {
      return columns.reduce((obj: any, column: any) => {
        obj[column.dataField] = !column.hidden;
        return obj;
      }, {});
    }
    return {};
  });

  const dependencyModules = useRef<any>(null);
  const tableExposedAPIEmitter = useRef<any>(null);

  const setDependencyModules = useCallback((_: any) => {
    dependencyModules.current = _;
  }, []);

  const registerExposedAPI = useCallback((emitter: any) => {
    tableExposedAPIEmitter.current = emitter;
  }, []);

  const onSearch = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const onClear = useCallback(() => {
    setSearchText("");
  }, []);

  const onColumnToggle = useCallback((dataField: string) => {
    setColumnToggle((prev: any) => ({
      ...prev,
      [dataField]: !prev[dataField],
    }));
  }, []);

  const handleExportCSV = useCallback(
    (source: any) => {
      const meta = getMetaInfo(columns);
      const options =
        exportCSV === true
          ? csvDefaultOptions
          : {
              ...csvDefaultOptions,
              ...(typeof exportCSV === "object" ? exportCSV : {}),
            };

      let exportData: any;
      if (typeof source !== "undefined") {
        exportData = source;
      } else if (options.exportAll) {
        exportData = data;
      } else if (options.onlyExportFiltered) {
        const payload: { result: any } = { result: undefined };
        tableExposedAPIEmitter.current?.emit("get.filtered.rows", payload);
        exportData = payload.result;
      } else {
        const payload = { result: undefined };
        tableExposedAPIEmitter.current?.emit("get.table.data", payload);
        exportData = payload.result;
      }

      if (options.onlyExportSelection) {
        const payload = { result: undefined };
        tableExposedAPIEmitter.current?.emit("get.selected.rows", payload);
        const selections = (payload.result as unknown as any[]) ?? [];
        exportData = exportData.filter((row: any) =>
          selections.includes(row[keyField as string])
        );
      }

      const content = transform(
        exportData,
        meta,
        columns,
        dependencyModules.current,
        options
      );
      save(content, options);
    },
    [columns, exportCSV, data, keyField]
  );

  const getSelectedRows = useCallback(() => {
    const payload = { result: undefined };
    tableExposedAPIEmitter.current?.emit("get.selected.rows", payload);
    return (payload.result as unknown as any[]) ?? [];
  }, []);

  const handleDeleteRow = useCallback(() => {
    const selections = getSelectedRows();
    if (typeof deleteRow === 'function') {
      deleteRow(selections);
    }
  }, [getSelectedRows, deleteRow]);

  const handleInsertRow = useCallback((newRow: any) => {
    if (typeof insertRow === 'function') {
      insertRow(newRow);
    }
  }, [insertRow]);

  const searchContextValue = useMemo(() => {
    if (search) {
      return createSearchContext(search);
    }
    return null;
  }, [search]);

  const baseProps = useMemo(() => {
    const tableProps: any = {
      keyField,
      columns,
      data,
      search: search ?? false,
      exportCSV: exportCSV ?? false,
      bootstrap4,
      bootstrap5,
      columnResize,
      children,
      setDependencyModules,
      registerExposedAPI,
    };

    if (search && searchContextValue) {
      tableProps.search = {
        searchContext: searchContextValue as any,
        searchText,
      };
    }

    if (columnToggleEnabled) {
      tableProps.columnToggle = {
        toggles: columnToggle as any,
      };
    }

    return tableProps;
  }, [
    keyField,
    columns,
    data,
    search,
    exportCSV,
    bootstrap4,
    bootstrap5,
    columnResize,
    children,
    setDependencyModules,
    registerExposedAPI,
    searchContextValue,
    searchText,
    columnToggle,
    columnToggleEnabled,
  ]);

  const contextValue = useMemo(
    () => ({
      searchProps: {
        searchText,
        onSearch,
        onClear,
      },
      csvProps: {
        onExport: handleExportCSV,
      },
      columnToggleProps: {
        columns,
        toggles: columnToggle as any,
        onColumnToggle,
      },
      opProps: {
        onInsert: handleInsertRow,
        onDelete: handleDeleteRow,
        getSelections: getSelectedRows,
      },
      baseProps,
    }),
    [
      searchText,
      onSearch,
      onClear,
      handleExportCSV,
      columns,
      columnToggle,
      onColumnToggle,
      handleInsertRow,
      handleDeleteRow,
      getSelectedRows,
      baseProps,
    ]
  );

  return (
    <ToolkitContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </ToolkitContext.Provider>
  );
};

export { ToolkitContext, ToolkitProvider };
export default ToolkitProvider;
