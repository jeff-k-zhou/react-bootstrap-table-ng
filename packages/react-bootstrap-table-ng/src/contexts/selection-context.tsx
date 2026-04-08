import React, { Component, ReactNode } from "react";
import _ from "../utils";

import {
  CHECKBOX_STATUS_CHECKED,
  CHECKBOX_STATUS_INDETERMINATE,
  CHECKBOX_STATUS_UNCHECKED,
  ROW_SELECT_SINGLE,
} from "../const";
import dataOperator from "../store/operators";
import { getSelectionSummary } from "../store/selection";

export interface SelectionContextValue {
  selected?: (string | number)[];
  onRowSelect?: (
    rowKey: any,
    checked: boolean,
    rowIndex: number,
    e: any
  ) => void;
  onAllRowsSelect?: (e: any, isUnSelect: boolean) => void;
  allRowsSelected?: boolean;
  allRowsNotSelected?: boolean;
  checkedStatus?: string;
  mode?: string;
  hideSelectColumn?: boolean;
  clickToSelect?: boolean;
  clickToSelectAndEditCell?: boolean;
  onSelect?: (
    row: any,
    checked: boolean,
    rowIndex: number,
    e: any
  ) => boolean | undefined;
  onSelectAll?: (checked: boolean, selectedRows: any[], e: any) => void | (string | number)[];
  nonSelectable?: (string | number)[];
  hideSelectAll?: boolean;
  selectionHeaderRenderer?: (args: {
    mode?: string;
    checked: boolean;
    indeterminate: boolean;
  }) => React.ReactNode;
  headerColumnStyle?:
  | React.CSSProperties
  | ((checkedStatus: string) => React.CSSProperties);
}

interface SelectionProviderProps {
  children: ReactNode;
  data: any[];
  keyField: string;
  selectRow: {
    selected?: any[];
    mode?: string;
    hideSelectColumn?: boolean;
    clickToSelect?: boolean;
    clickToSelectAndEditCell?: boolean;
    onSelect?: (
      row: any,
      checked: boolean,
      rowIndex: number,
      e: any
    ) => boolean;
    onSelectAll?: (
      checked: boolean,
      selectedRows: any[],
      e: any
    ) => void | (string | number)[];
    nonSelectable?: (string | number)[];
    hideSelectAll?: boolean;
    selectionHeaderRenderer?: (args: {
      mode?: string;
      checked: boolean;
      indeterminate: boolean;
    }) => React.ReactNode;
    headerColumnStyle?:
    | React.CSSProperties
    | ((checkedStatus: string) => React.CSSProperties);
  };
}

const defaultSelectionContext = {};
const SelectionContext = React.createContext<SelectionContextValue>(
  defaultSelectionContext
);

const SelectionProvider = React.forwardRef<any, SelectionProviderProps>((props, ref) => {
  const { data, keyField, selectRow, children } = props;
  const [selected, setSelected] = React.useState<(string | number)[]>(selectRow.selected || []);

  React.useImperativeHandle(ref, () => ({
    selected,
    getSelected: () => selected,
  }));

  // Sync with internal state when prop changes
  React.useEffect(() => {
    if (selectRow.selected && !_.isEqual(selectRow.selected, selected)) {
      setSelected(selectRow.selected);
    }
  }, [selectRow.selected]);

  const handleRowSelect = React.useCallback(
    (rowKey: any, checked: boolean, rowIndex: number, e: any) => {
      const { mode, onSelect } = selectRow;

      setSelected((prevSelected) => {
        let currSelected = [...prevSelected];
        let result = true;

        if (onSelect) {
          const row = dataOperator.getRowByRowId(data, keyField, rowKey);
          result = onSelect(row, checked, rowIndex, e);
        }

        if (result === true || result === undefined) {
          if (mode === ROW_SELECT_SINGLE) {
            currSelected = [rowKey];
          } else if (checked) {
            currSelected.push(rowKey);
          } else {
            currSelected = currSelected.filter((value) => value !== rowKey);
          }
        }
        return currSelected;
      });
    },
    [data, keyField, selectRow.onSelect, selectRow.mode]
  );

  const handleAllRowsSelect = React.useCallback(
    (e: any, isUnSelect: boolean) => {
      const { onSelectAll, nonSelectable } = selectRow;

      setSelected((prevSelected) => {
        let currSelected: any[];

        if (!isUnSelect) {
          currSelected = prevSelected.concat(
            dataOperator.selectableKeys(data, keyField, nonSelectable)
          );
        } else {
          currSelected = prevSelected.filter(
            (s) =>
              typeof data.find((d) => _.get(d, keyField) === s) === "undefined"
          );
        }

        if (onSelectAll) {
          const result = onSelectAll(
            !isUnSelect,
            dataOperator.getSelectedRows(
              data,
              keyField,
              isUnSelect ? prevSelected : currSelected
            ),
            e
          );
          if (Array.isArray(result)) {
            currSelected = result;
          }
        }
        return currSelected;
      });
    },
    [data, keyField, selectRow.onSelectAll, selectRow.nonSelectable]
  );

  const { allRowsSelected, allRowsNotSelected } = getSelectionSummary(
    data,
    keyField,
    selected
  );

  let checkedStatus: string;
  if (allRowsSelected) {
    checkedStatus = CHECKBOX_STATUS_CHECKED;
  } else if (allRowsNotSelected) {
    checkedStatus = CHECKBOX_STATUS_UNCHECKED;
  } else {
    checkedStatus = CHECKBOX_STATUS_INDETERMINATE;
  }

  return (
    <SelectionContext.Provider
      value={{
        ...selectRow,
        selected,
        onRowSelect: handleRowSelect,
        onAllRowsSelect: handleAllRowsSelect,
        allRowsSelected,
        allRowsNotSelected,
        checkedStatus,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
});

export default () => ({
  Provider: SelectionProvider,
  Consumer: SelectionContext.Consumer,
});
