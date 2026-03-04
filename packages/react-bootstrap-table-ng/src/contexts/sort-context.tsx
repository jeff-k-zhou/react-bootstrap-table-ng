import React, { ReactNode } from "react";
import { SORT_ASC, SORT_DESC } from "../const";
import { ColumnDescription, SortOrder } from "../types";
import dataOperator from "../store/operators";

type DataOperator = {
  nextOrder: (
    column: ColumnDescription,
    state: { sortOrder: SortOrder | undefined; sortColumn: ColumnDescription | undefined },
    defaultSortDirection: SortOrder
  ) => SortOrder;
  sort: (
    data: any[],
    order: SortOrder | undefined,
    sortColumn: ColumnDescription | undefined
  ) => any[];
};

type HandleSortChange = (
  dataField: string,
  sortOrder: SortOrder | undefined
) => void;

//
interface SortContextValue {
  data: any[];
  sortOrder: SortOrder | undefined;
  onSort: (column: ColumnDescription) => void;
  sortField: string | null;
}

interface SortProviderProps {
  data: any[];
  columns: any[];
  children: ReactNode;
  defaultSorted?: Array<{
    dataField: string;
    order: typeof SORT_ASC | typeof SORT_DESC;
  }>;
  sort?: {
    dataField: string;
    order: typeof SORT_ASC | typeof SORT_DESC;
    sortFunc: (a: any, b: any, order: string, dataField: string) => number;
  };
  defaultSortDirection: typeof SORT_ASC | typeof SORT_DESC;
}

const createSortContext = (
  dataOperator: DataOperator,
  isRemoteSort: () => boolean,
  handleSortChange: HandleSortChange
) => {
  const defaultSortContext = {
    data: [],
    sortOrder: undefined,
    onSort: () => { },
    sortField: null,
  };
  const SortContext = React.createContext<SortContextValue>(defaultSortContext);

  const SortProvider = React.forwardRef<any, SortProviderProps>((props, ref) => {
    const {
      data: propData,
      columns,
      children,
      defaultSorted,
      defaultSortDirection,
      sort,
    } = props;

    const [sortOrder, setSortOrder] = React.useState<SortOrder | undefined>(() => {
      if (defaultSorted && defaultSorted.length > 0) {
        return (defaultSorted[0].order as SortOrder) || defaultSortDirection;
      } else if (sort && sort.dataField && sort.order) {
        return sort.order as SortOrder;
      }
      return undefined;
    });

    const [sortColumn, setSortColumn] = React.useState<ColumnDescription | undefined>(() => {
      let initialSortField: string | undefined;
      let initialSortOrder: SortOrder | undefined;

      if (defaultSorted && defaultSorted.length > 0) {
        initialSortOrder = (defaultSorted[0].order as SortOrder) || defaultSortDirection;
        initialSortField = defaultSorted[0].dataField;
      } else if (sort && sort.dataField && sort.order) {
        initialSortOrder = sort.order as SortOrder;
        initialSortField = sort.dataField;
      }

      if (initialSortField) {
        const sortColumns = columns.filter((col) => col.dataField === initialSortField);
        if (sortColumns.length > 0) {
          const col = sortColumns[0];
          if (col.onSort) {
            col.onSort(initialSortField, initialSortOrder!);
          }
          return col;
        }
      }

      return undefined;
    });

    React.useImperativeHandle(ref, () => ({
      state: {
        sortOrder,
        sortColumn,
      },
    }));


    // Handle remote sort on mount
    React.useEffect(() => {
      if (isRemoteSort() && sortOrder && sortColumn) {
        handleSortChange(sortColumn.dataField, sortOrder);
      }
    }, []);

    // Sync with sort prop (getDerivedStateFromProps replacement)
    React.useEffect(() => {
      if (sort && sort.dataField && sort.order) {
        setSortOrder(sort.order);
        setSortColumn(columns.find((col) => col.dataField === sort.dataField));
      }
    }, [sort, columns]);

    const handleSort = React.useCallback(
      (column: ColumnDescription) => {
        const nextOrder = dataOperator.nextOrder(
          column,
          { sortOrder, sortColumn },
          defaultSortDirection
        );

        if (column.onSort) {
          column.onSort(column.dataField, nextOrder);
        }

        if (isRemoteSort()) {
          handleSortChange(column.dataField, nextOrder);
        }
        setSortOrder(nextOrder as SortOrder);
        setSortColumn(column);
      },
      [sortOrder, sortColumn, defaultSortDirection]
    );

    const data = React.useMemo(() => {
      let result = propData;
      if (!isRemoteSort() && sortColumn) {
        const sortFunc = sortColumn.sortFunc
          ? sortColumn.sortFunc
          : sort && sort.sortFunc;
        result = dataOperator.sort(result, sortOrder, { ...sortColumn, sortFunc });
      }
      return result;
    }, [propData, sortOrder, sortColumn, sort]);

    return (
      <SortContext.Provider
        value={{
          data,
          sortOrder,
          onSort: handleSort,
          sortField: sortColumn ? sortColumn.dataField : null,
        }}
      >
        {children}
      </SortContext.Provider>
    );
  });

  return {
    Provider: SortProvider,
    Consumer: SortContext.Consumer,
  };
};

export default createSortContext;
