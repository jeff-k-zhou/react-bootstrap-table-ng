import React, { MouseEvent } from "react";
import { useCellEventDelegater } from "./cell-event-delegater";
import _ from "./utils";

export interface CellProps {
  row: any;
  rowindex: number;
  column: any;
  columnindex: number;
  atstart?: (rowIndex: number, columnIndex: number) => void;
  editable?: string;
  clicktoedit?: string;
  dbclicktoedit?: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  tabIndex?: number;
}

const Cell = React.memo((props: CellProps) => {
  const {
    row,
    column,
    atstart,
    rowindex,
    columnindex,
    editable,
    clicktoedit,
    dbclicktoedit,
    ...rest
  } = props;

  const { dataField, formatter, formatExtraData } = column;

  const delegate = useCellEventDelegater({
    column,
    columnIndex: columnindex,
    index: rowindex,
  });

  const attrs = delegate({ ...rest });
  let content = column.isDummyField ? null : _.get(row, dataField);

  if (formatter) {
    content = column.formatter(content, row, rowindex, formatExtraData);
  }

  const createHandleEditingCell = React.useCallback(
    (originFunc: (e: MouseEvent) => void) => (e: MouseEvent) => {
      if ((clicktoedit || dbclicktoedit) && _.isFunction(originFunc)) {
        originFunc(e);
      }
      if (atstart) {
        atstart(rowindex, columnindex);
      }
    },
    [atstart, rowindex, columnindex, clicktoedit, dbclicktoedit]
  );

  if (clicktoedit === "true" && editable === "true") {
    attrs.onClick = createHandleEditingCell(attrs.onClick);
  } else if (dbclicktoedit === "true" && editable === "true") {
    attrs.onDoubleClick = createHandleEditingCell(attrs.onDoubleClick);
  }

  return (
    <td {...attrs}>
      {typeof content === "boolean" ? `${content}` : content}
    </td>
  );
}, (prevProps, nextProps) => {
  // Return true if passing nextProps to render would return the same result as passing prevProps to render
  let shouldUpdate = false;
  
  if (nextProps.column.isDummyField) {
    shouldUpdate = !_.isEqual(prevProps.row, nextProps.row);
  } else {
    shouldUpdate =
      _.get(prevProps.row, prevProps.column.dataField) !==
      _.get(nextProps.row, nextProps.column.dataField);
  }

  if (shouldUpdate) return false;

  shouldUpdate =
    (nextProps.column.formatter
      ? !_.isEqual(prevProps.row, nextProps.row)
      : false) ||
    prevProps.column.hidden !== nextProps.column.hidden ||
    prevProps.column.isDummyField !== nextProps.column.isDummyField ||
    prevProps.rowindex !== nextProps.rowindex ||
    prevProps.columnindex !== nextProps.columnindex ||
    prevProps.className !== nextProps.className ||
    prevProps.title !== nextProps.title ||
    prevProps.editable !== nextProps.editable ||
    prevProps.clicktoedit !== nextProps.clicktoedit ||
    prevProps.dbclicktoedit !== nextProps.dbclicktoedit ||
    !_.isEqual(prevProps.style, nextProps.style) ||
    !_.isEqual(
      prevProps.column.formatExtraData,
      nextProps.column.formatExtraData
    ) ||
    !_.isEqual(prevProps.column.events, nextProps.column.events) ||
    !_.isEqual(prevProps.column.attrs, nextProps.column.attrs) ||
    prevProps.tabIndex !== nextProps.tabIndex;

  return !shouldUpdate;
});

export default Cell;
