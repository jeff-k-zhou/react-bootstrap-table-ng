import React, { Component, ReactNode } from "react";
import _ from "../utils";

interface FilterProps {
  data: any;
  currFilters: any;
}

interface SearchProps {
  data: any;
}

interface SortProps {
  data: any;
}

interface PaginationProps {
  data: any;
}

//
interface DataProviderProps {
  data: any[];
  children: ReactNode;
}

interface DataProviderState {
  data: any[];
}

interface DataContextValue {
  data: any[];
  getData: (
    filterProps?: FilterProps,
    searchProps?: SearchProps,
    sortProps?: SortProps,
    paginationProps?: PaginationProps
  ) => any[];
}

const defaultDataContext = { data: [], getData: () => [] };
const DataContext = React.createContext<DataContextValue>(defaultDataContext);

const DataProvider: React.FC<DataProviderProps> = (props) => {
  const { data: propData, children } = props;
  const [data] = React.useState(propData);

  const getData = React.useCallback(
    (
      filterProps?: FilterProps,
      searchProps?: SearchProps,
      sortProps?: SortProps,
      paginationProps?: PaginationProps
    ) => {
      if (paginationProps) {
        return paginationProps.data;
      } else if (sortProps) {
        return sortProps.data;
      } else if (searchProps) {
        return searchProps.data;
      } else if (filterProps) {
        if (
          filterProps.data.length < propData.length &&
          !_.isEmptyObject(Object.keys(filterProps.currFilters))
        ) {
          return filterProps.data;
        }
      }
      return propData;
    },
    [propData]
  );

  return (
    <DataContext.Provider
      value={{
        data,
        getData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default () => ({
  Provider: DataProvider,
  Consumer: DataContext.Consumer,
});
