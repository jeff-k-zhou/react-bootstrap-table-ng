/* eslint react/prop-types: 0 */
/* eslint react/require-default-props: 0 */
/* eslint camelcase: 0 */

import React from "react";

import { EQ, FILTER_TYPES, LIKE } from "./const";
import { filters } from "./filter";

export interface FilterProviderProps {
  data: any[];
  columns: any[];
  dataChangeListener?: any;
  filter: any;
  children: any;
}

export const FilterContext = React.createContext<any>({});
export const FilterProvider = React.forwardRef<any, FilterProviderProps & {
  _: any;
  isRemoteFiltering: () => boolean;
  handleFilterChange: (filters: any) => void;
}>((props, ref) => {
  const {
    data: propData,
    columns,
    children,
    filter,
    dataChangeListener,
    _,
    isRemoteFiltering,
    handleFilterChange,
  } = props;

  const currFiltersRef = React.useRef<{ [key: string]: any }>({});
  const [currFilters, setCurrFilters] = React.useState<{ [key: string]: any }>({});
  const [clearFilters, setClearFilters] = React.useState<{ [key: string]: any }>({});
  const [data, setData] = React.useState<any[]>(propData);
  const rendered = React.useRef(false);

  // Keep a ref to the latest columns so the filter effect doesn't need to
  // re-run every time columns gets a new reference (e.g. when filter factories
  // are called inline inside a parent component's render function).
  const columnsRef = React.useRef(columns);
  React.useLayoutEffect(() => {
    columnsRef.current = columns;
  });

  React.useImperativeHandle(ref, () => ({
    currFilters,
    getFiltered: () => data,
  }));

  React.useEffect(() => {
    rendered.current = true;
    if (isRemoteFiltering()) {
      const initialFilters = currFiltersRef.current;
      if (Object.keys(initialFilters).length > 0) {
        handleFilterChange(initialFilters);
      }
    }
  }, []);

  React.useEffect(() => {
    if (!isRemoteFiltering()) {
      const result = filters(
        propData,
        columnsRef.current,
        _
      )(currFilters, clearFilters);
      if (filter && filter.afterFilter) {
        filter.afterFilter(result, currFilters);
      }
      setData(result);
      if (dataChangeListener) {
        dataChangeListener.emit("filterChanged", result.length);
      }
    } else {
      setData(propData);
    }
  }, [propData, currFilters, clearFilters, isRemoteFiltering, _]);

  const onFilter = React.useCallback(
    (column: any, filterType: any, initialize = false) => {
      return (filterVal: any) => {
        const nextCurrFilters = { ...currFiltersRef.current };
        let nextClearFilters = {};
        const { dataField, filter: colFilter } = column;

        const needClearFilters =
          !_.isDefined(filterVal) || filterVal === "" || filterVal.length === 0;

        if (needClearFilters) {
          delete nextCurrFilters[dataField];
          nextClearFilters = { [dataField]: { clear: true, filterVal } };
        } else {
          const {
            comparator = filterType === FILTER_TYPES.SELECT ? EQ : LIKE,
            caseSensitive = false,
          } = colFilter.props;
          nextCurrFilters[dataField] = {
            filterVal,
            filterType,
            comparator,
            caseSensitive,
          };
        }

        currFiltersRef.current = nextCurrFilters;
        setClearFilters(nextClearFilters);
        setCurrFilters(nextCurrFilters);

        if (isRemoteFiltering()) {
          if (!initialize || rendered.current) {
            handleFilterChange(nextCurrFilters);
          }
        }
      };
    },
    [isRemoteFiltering, handleFilterChange, _]
  );

  const onExternalFilter = React.useCallback(
    (column: any, filterType: any) => {
      return (value: any) => {
        onFilter(column, filterType)(value);
      };
    },
    [onFilter]
  );

  return (
    <FilterContext.Provider
      value={{
        data,
        onFilter,
        onExternalFilter,
        currFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
});

export default (
  _: any,
  isRemoteFiltering: () => boolean,
  handleFilterChange: (filters: any) => void
) => {
  return {
    Provider: FilterProvider,
    Consumer: FilterContext.Consumer,
    isRemoteFiltering,
    handleFilterChange,
    _,
  };
};
