import React, { Component, ReactNode } from "react";
import dataOperator from "../store/operators";
import _ from "../utils";

interface RowExpandProviderProps {
  children: ReactNode;
  data: any[];
  keyField: string;
  expandRow: {
    expanded?: (string | number)[];
    isClosing?: (string | number)[];
    onExpand?: (row: any, expanded: boolean, rowIndex: number, e: any) => void;
    onExpandAll?: (expandAll: boolean, expandedRows: any[], e: any) => void;
    onlyOneExpanding?: boolean;
    nonExpandable?: (string | number)[];
    renderer?: () => void;
  };
}

export interface RowExpandContextValue {
  expanded: (string | number)[];
  isClosing: (string | number)[];
  nonExpandable?: (string | number)[];
  onClosed: (closedRow: any) => void;
  isAnyExpands: boolean;
  onRowExpand: (
    rowKey: any,
    expanded: boolean,
    rowIndex: number,
    e: any
  ) => void;
  onAllRowExpand: (e: any, expandAll: boolean) => void;
  onExpand?: (row: any, expanded: boolean, rowIndex: number, e: any) => void;
  onExpandAll?: (expandAll: boolean, expandedRows: any[], e: any) => void;
  onlyOneExpanding?: boolean;
}

const defaultRowExpandContext = {
  expanded: [],
  isClosing: [],
  onClosed: () => {},
  isAnyExpands: false,
  onRowExpand: () => {},
  onAllRowExpand: () => {},
};
const RowExpandContext = React.createContext<RowExpandContextValue>(
  defaultRowExpandContext
);

const RowExpandProvider = React.forwardRef<any, RowExpandProviderProps>((props, ref) => {
  const { children, data, keyField, expandRow } = props;

  const [expanded, setExpanded] = React.useState<(string | number)[]>(expandRow.expanded || []);
  const [isClosing, setIsClosing] = React.useState<(string | number)[]>(expandRow.isClosing || []);

  React.useImperativeHandle(ref, () => ({
    state: {
      expanded,
    },
  }));

  // Sync with internal state when prop changes (getDerivedStateFromProps replacement)
  React.useEffect(() => {
    if (expandRow && expandRow.expanded) {
      const { nonExpandable = [] } = expandRow;
      const nextExpanded = expandRow.expanded.filter(
        (rowId) => !_.contains(nonExpandable, rowId)
      );

      // Only update if the content has actually changed to avoid unnecessary re-renders
      if (!_.isEqual(expanded, nextExpanded)) {
        const nextClosing = expanded.reduce((acc: any, cur: any) => {
          if (!_.contains(nextExpanded, cur)) {
            acc.push(cur);
          }
          return acc;
        }, []);

        setExpanded(nextExpanded);
        setIsClosing(nextClosing);
      }
    }
  }, [expandRow.expanded, expandRow.nonExpandable]);

  const onClosed = React.useCallback((closedRow: any) => {
    setIsClosing((prev) => prev.filter((value) => value !== closedRow));
  }, []);

  const handleRowExpand = React.useCallback(
    (rowKey: any, isExpanded: boolean, rowIndex: number, e: any) => {
      const { onExpand, onlyOneExpanding, nonExpandable } = expandRow;

      if (nonExpandable && _.contains(nonExpandable, rowKey)) {
        return;
      }

      setExpanded((prevExpanded) => {
        let currExpanded = [...prevExpanded];

        if (isExpanded) {
          if (onlyOneExpanding) {
            setIsClosing((prevClosing) => prevClosing.concat(prevExpanded));
            currExpanded = [rowKey];
          } else {
            currExpanded.push(rowKey);
          }
        } else {
          setIsClosing((prevClosing) => [...prevClosing, rowKey]);
          currExpanded = currExpanded.filter((value) => value !== rowKey);
        }

        return currExpanded;
      });

      if (onExpand) {
        const row = dataOperator.getRowByRowId(data, keyField, rowKey);
        onExpand(row, isExpanded, rowIndex, e);
      }
    },
    [data, keyField, expandRow.onExpand, expandRow.onlyOneExpanding, expandRow.nonExpandable]
  );

  const handleAllRowExpand = React.useCallback(
    (e: any, expandAll: boolean) => {
      const { onExpandAll, nonExpandable } = expandRow;

      setExpanded((prevExpanded) => {
        let currExpanded: any[];

        if (expandAll) {
          currExpanded = prevExpanded.concat(
            dataOperator.expandableKeys(data, keyField, nonExpandable)
          );
        } else {
          currExpanded = prevExpanded.filter(
            (s) =>
              typeof data.find((d) => _.get(d, keyField) === s) === "undefined"
          );
        }

        if (onExpandAll) {
          onExpandAll(
            expandAll,
            dataOperator.getExpandedRows(data, keyField, currExpanded),
            e
          );
        }
        return currExpanded;
      });
    },
    [data, keyField, expandRow.onExpandAll, expandRow.nonExpandable]
  );

  const value = React.useMemo(
    () => ({
      ...expandRow,
      nonExpandable: expandRow.nonExpandable,
      expanded,
      isClosing,
      onClosed,
      isAnyExpands: dataOperator.isAnyExpands(data, keyField, expanded),
      onRowExpand: handleRowExpand,
      onAllRowExpand: handleAllRowExpand,
    }),
    [
      expandRow,
      expanded,
      isClosing,
      onClosed,
      data,
      keyField,
      handleRowExpand,
      handleAllRowExpand,
    ]
  );

  return (
    <RowExpandContext.Provider value={value}>
      {children}
    </RowExpandContext.Provider>
  );
});

export default () => ({
  Provider: RowExpandProvider,
  Consumer: RowExpandContext.Consumer,
});
