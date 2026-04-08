import { useMemo, useCallback } from "react";
import _ from "../utils";
import { BootstrapTableProps } from "../types";
import { ROW_SELECT_DISABLED } from "../const";

export const useTableLogic = (props: BootstrapTableProps) => {
  const {
    data,
    keyField,
    columns,
    hiddenRows,
    columnToggle,
    selectRow,
    expandRow,
  } = props;

  // Validation logic
  const validateProps = useCallback(() => {
    if (!keyField) {
      throw new Error("Please specify a field as key via keyField");
    }
    // Note: visibleColumnSize check is moved to the calculation itself
  }, [keyField]);

  // Data logic (from PropsBaseResolver)
  const isEmpty = useMemo(() => data.length === 0, [data.length]);

  const visibleRows = useMemo(() => {
    if (!hiddenRows || hiddenRows.length === 0) return data;
    return data.filter((row: any) => {
      const key = _.get(row, keyField);
      return !_.contains(hiddenRows, key);
    });
  }, [data, hiddenRows, keyField]);

  // Column logic (from ColumnResolver)
  const getVisibleColumnSize = useCallback(
    (includeSelectColumn = true) => {
      let columnLen;
      if (columnToggle && columnToggle.toggles) {
        const toggles = columnToggle.toggles;
        columnLen = Object.keys(toggles).filter((name) => toggles[name]).length;
      } else {
        columnLen = columns.filter((c: any) => !c.hidden).length;
      }

      if (!includeSelectColumn) return columnLen;

      if (selectRow && !selectRow.hideSelectColumn && selectRow.mode !== ROW_SELECT_DISABLED) {
        columnLen += 1;
      }
      if (expandRow && expandRow.showExpandColumn) {
        columnLen += 1;
      }
      return columnLen;
    },
    [columnToggle, columns, selectRow, expandRow]
  );

  return useMemo(() => ({
    validateProps,
    isEmpty,
    visibleRows,
    getVisibleColumnSize,
  }), [validateProps, isEmpty, visibleRows, getVisibleColumnSize]);
};
