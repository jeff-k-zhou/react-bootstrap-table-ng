import React, { ReactNode, useMemo } from "react";

import { ExpandRowProps, SelectRowProps } from "./types";
import { ROW_SELECT_DISABLED } from "./const";
import withRowExpansion from "./row-expand/row-consumer";
import withRowSelection from "./row-selection/row-consumer";
import RowAggregator from "./row/aggregate-row";
import RowSection from "./row/row-section";
import { RowProps } from "./row/should-updater";
import SimpleRow from "./row/simple-row";
import _ from "./utils";

interface BodyProps {
  keyField: string;
  data: any[];
  columns: any[];
  selectRow?: SelectRowProps<any> | undefined;
  cellEdit: any;
  tabIndexCell?: boolean;
  isEmpty?: boolean;
  noDataIndication?:
  | (() => React.ReactElement | string)
  | React.ReactElement
  | string
  | undefined;
  visibleColumnSize?: number;
  rowStyle?:
  | React.CSSProperties
  | ((row: any, index: number) => React.CSSProperties);
  rowClasses?: string | ((row: any, index: number) => string);
  rowEvents?: Record<string, any> | null;
  expandRow?: ExpandRowProps<any, any> | undefined;
  className?: string;
}

const Body: React.FC<BodyProps> = (props) => {
  const {
    columns,
    data,
    tabIndexCell,
    keyField,
    isEmpty,
    noDataIndication,
    visibleColumnSize,
    cellEdit,
    selectRow,
    rowStyle,
    rowClasses,
    rowEvents,
    expandRow,
    className,
  } = props;

  const { EditingCell, RowComponent } = useMemo(() => {
    let currentEditingCell: any = null;
    if (cellEdit?.createContext) {
      currentEditingCell = cellEdit.createEditingCell(
        _,
        cellEdit.options.onStartEdit
      );
    }

    let currentRowComponent: any = SimpleRow;
    const selectRowEnabled = selectRow?.mode !== ROW_SELECT_DISABLED;
    const expandRowEnabled = !!expandRow?.renderer;

    if (expandRowEnabled) {
      currentRowComponent = withRowExpansion(RowAggregator);
    }

    if (selectRowEnabled) {
      currentRowComponent = withRowSelection(
        expandRowEnabled ? currentRowComponent : RowAggregator
      );
    }

    if (cellEdit?.createContext) {
      currentRowComponent = cellEdit.withRowLevelCellEdit(
        currentRowComponent,
        selectRowEnabled,
        keyField,
        _
      );
    }

    return {
      EditingCell: currentEditingCell,
      RowComponent: currentRowComponent,
    };
  }, [cellEdit, selectRow, expandRow, keyField]);

  let content: ReactNode;

  if (isEmpty) {
    const indication = typeof noDataIndication === "function"
      ? (noDataIndication as Function)()
      : noDataIndication;
    if (!indication) {
      return null;
    }
    content = <RowSection content={indication} colSpan={visibleColumnSize} />;
  } else {
    const selectRowEnabled = selectRow?.mode !== ROW_SELECT_DISABLED;
    const expandRowEnabled = !!expandRow?.renderer;

    const additionalRowProps: RowProps = {};

    if (cellEdit?.createContext) {
      additionalRowProps.EditingCellComponent = EditingCell;
    }

    if (selectRowEnabled || expandRowEnabled) {
      additionalRowProps.expandRow = expandRow;
      additionalRowProps.selectRow = selectRow;
    }

    content = data.map((row, index) => {
      if (row) {
        const key = _.get(row, keyField);
        const baseRowProps: any = {
          key,
          row,
          tabIndexCell,
          columns,
          keyField,
          cellEdit,
          value: key,
          rowIndex: index,
          visibleColumnSize,
          attrs: rowEvents || {},
          ...additionalRowProps,
        };

        baseRowProps.style = typeof rowStyle === "function"
          ? (rowStyle(row, index) as any)
          : (rowStyle as any);
        baseRowProps.className = typeof rowClasses === "function"
          ? (rowClasses(row, index) as any)
          : rowClasses;

        const { key: rowKey, ...rest } = baseRowProps;
        return <RowComponent key={rowKey} {...rest} />;
      } else {
        return null;
      }
    });
  }
  return <tbody className={className}>{content}</tbody>;
};

export default Body;
