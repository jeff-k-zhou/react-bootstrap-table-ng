/* eslint react/prop-types: 0 */
/* eslint react/require-default-props: 0 */
/* eslint camelcase: 0 */

import React from "react";

import { EQ, FILTER_TYPES, LIKE } from "..";
import { filters } from "./filter";

export interface FilterProviderProps {
  data: any[];
  columns: any[];
  dataChangeListener?: any;
  filter: any;
  children: any;
}

export const FilterContext = React.createContext<any>({});

export default (
  _: any,
  isRemoteFiltering: () => boolean,
  handleFilterChange: (filters: any) => void
) => {
  const FilterProvider = React.forwardRef<any, FilterProviderProps>((props, ref) => {
    const { data: propData, columns, children, filter, dataChangeListener } = props;
    const [currFilters, setCurrFilters] = React.useState<{ [key: string]: any }>({});
    const [clearFilters, setClearFilters] = React.useState<{ [key: string]: any }>({});
    const [data, setData] = React.useState<any[]>(propData);

    React.useImperativeHandle(ref, () => ({
      currFilters,
      getFiltered: () => data,
    }));

    // Fire the initial remote call once when defaults have been registered.
    // The mount-only effect ([] deps) ran too early — currFilters was still {}
    // because TextFilters hadn't registered their defaultValues yet.
    const initialRemoteFired = React.useRef(false);
    React.useEffect(() => {
      if (initialRemoteFired.current) return;
      if (isRemoteFiltering() && Object.keys(currFilters).length > 0) {
        initialRemoteFired.current = true;
        handleFilterChange(currFilters);
      }
    }, [currFilters, isRemoteFiltering, handleFilterChange]);

    React.useEffect(() => {
      if (!isRemoteFiltering()) {
        const result = filters(
          propData,
          columns,
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
    }, [propData, columns, currFilters, clearFilters, isRemoteFiltering, _]);

    const onFilter = React.useCallback(
      (column: any, filterType: any, initialize = false) => {
        return (filterVal: any) => {
          setCurrFilters((prevCurrFilters: any) => {
            const nextCurrFilters = { ...prevCurrFilters };
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

            setClearFilters(nextClearFilters);

            if (isRemoteFiltering()) {
              if (!initialize) {
                handleFilterChange(nextCurrFilters);
              }
            }

            return nextCurrFilters;
          });
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

  return {
    Provider: FilterProvider,
    Consumer: FilterContext.Consumer,
  };
};
