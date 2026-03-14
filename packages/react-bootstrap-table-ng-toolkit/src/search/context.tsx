import React, { useState, useMemo, useEffect, useRef, useImperativeHandle } from "react";
import _ from "lodash";
import { TableSearchProps } from "../..";

interface DataChangeListener {
  emit: (event: string, value: any) => void;
}

interface SearchProviderProps {
  data: any[];
  dataChangeListener?: DataChangeListener;
  children: any;
  columns: any[];
  searchText?: string;
  options?: TableSearchProps;
  isRemoteSearch: () => boolean;
  handleRemoteSearchChange: (searchText: string) => void;
}

const SearchContext = React.createContext<any>(null);

const SearchProvider = React.forwardRef<any, SearchProviderProps>((props, ref) => {
  const {
    data,
    searchText = "",
    children,
    dataChangeListener,
    columns,
    options = {
      searchFormatted: false,
      afterSearch: undefined,
    },
    isRemoteSearch,
    handleRemoteSearchChange,
  } = props;

  const [stateData, setStateData] = useState<any[]>(data);
  const isInitialMount = useRef(true);

  useImperativeHandle(ref, () => ({
    getSearched: () => stateData,
  }));

  const searchResult = useMemo(() => {
    if (isRemoteSearch()) {
      return data;
    }

    const lowerSearchText = (searchText || "").toLowerCase();

    if (!lowerSearchText) return data;

    return data.filter((row: any, ridx: any) => {
      for (let cidx = 0; cidx < columns.length; cidx += 1) {
        const column = columns[cidx];
        if (column.searchable === false) continue;
        let targetValue = _.get(row, column.dataField);
        if (column.formatter && options.searchFormatted) {
          targetValue = column.formatter(
            targetValue,
            row,
            ridx,
            column.formatExtraData
          );
        } else if (column.filterValue) {
          targetValue = column.filterValue(targetValue, row);
        }
        if (typeof options.onColumnMatch === 'function') {
          if (
            options.onColumnMatch({
              searchText: lowerSearchText,
              value: targetValue,
              column,
              row,
            })
          ) {
            return true;
          }
        } else {
          if (targetValue !== null && typeof targetValue !== "undefined") {
            targetValue = targetValue.toString().toLowerCase();
            if (targetValue.indexOf(lowerSearchText) > -1) {
              return true;
            }
          }
        }
      }
      return false;
    });
  }, [data, searchText, columns, options, isRemoteSearch]);

  useEffect(() => {
    if (isRemoteSearch()) {
      handleRemoteSearchChange(searchText);
    }
  }, [searchText, isRemoteSearch, handleRemoteSearchChange]);

  useEffect(() => {
    if (!isRemoteSearch()) {
      if (options.afterSearch && !isInitialMount.current) {
        options.afterSearch(searchResult);
      }
      if (dataChangeListener) {
        dataChangeListener.emit("filterChanged", searchResult.length);
      }
      setStateData(searchResult);
    }
    isInitialMount.current = false;
  }, [searchResult, dataChangeListener, isRemoteSearch, options]);

  // Handle remote search data updates
  useEffect(() => {
    if (isRemoteSearch()) {
      setStateData(data);
    }
  }, [data, isRemoteSearch]);

  const content = typeof children === 'function' ? children({ data: stateData }) : children;

  return (
    <SearchContext.Provider value={{ data: stateData }}>
      {content}
    </SearchContext.Provider>
  );
});

export default (options: TableSearchProps) => (
  __: any,
  isRemoteSearch: () => boolean,
  handleRemoteSearchChange: (searchText: string) => void
) => ({
  Provider: SearchProvider,
  Consumer: SearchContext.Consumer,
  options,
});
