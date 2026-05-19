import React, { useRef, useEffect } from "react";
import { INDICATOR_POSITION_LEFT } from "../const";
import ExpandCell from "../row-expand/expand-cell";
import SelectionCell from "../row-selection/selection-cell";
import _ from "../utils";
import { useRowEventDelegater } from "./event-delegater";
import RowPureContent from "./row-pure-content";
import {
  RowProps,
  shouldRowContentUpdate,
  shouldUpdatedBySelfProps
} from "./should-updater";

const RowAggregator = React.memo((props: RowProps) => {
  const {
    row,
    columns,
    keyField,
    rowIndex,
    style,
    className,
    attrs,
    selectRow,
    expandRow,
    expanded,
    expandable,
    selected,
    selectable,
    visibleColumnSize,
    tabIndexCell,
    id,
    ...rest
  } = props;

  const { delegate, createClickEventHandler } = useRowEventDelegater({
    row,
    selected,
    keyField,
    selectable,
    expandable,
    rowIndex: rowIndex!,
    expanded,
    expandRow,
    selectRow,
    DELAY_FOR_DBCLICK: (props as any).DELAY_FOR_DBCLICK,
  });

  const key = _.get(row, keyField!);
  const { hideSelectColumn, selectColumnPosition, clickToSelect } = selectRow;
  const { showExpandColumn = undefined, expandColumnPosition = undefined } =
    expandRow ?? {};

  const newAttrs = delegate({ ...attrs });
  const isClickToExpand = expandRow && !!expandRow.renderer;
  if (clickToSelect || isClickToExpand) {
    newAttrs.onClick = createClickEventHandler(newAttrs.onClick as any);
  }

  if (isClickToExpand) {
    newAttrs.tabIndex = 0;
  }

  const prevProps = useRef<RowProps>(props);
  const shouldUpdateRowContent = shouldRowContentUpdate(prevProps.current, props);

  useEffect(() => {
    prevProps.current = props;
  });

  let tabIndexStart = rowIndex! * visibleColumnSize! + 1;

  const isRenderFunctionColumnInLeft = (position = INDICATOR_POSITION_LEFT): boolean => {
    return position === INDICATOR_POSITION_LEFT;
  };

  const childrens = [
    <RowPureContent
      key="row"
      row={row}
      columns={columns}
      keyField={keyField}
      rowIndex={rowIndex}
      shouldUpdate={shouldUpdateRowContent}
      tabIndexStart={tabIndexCell ? tabIndexStart : -1}
      {...rest}
    />,
  ];

  if (!hideSelectColumn) {
    const selectCell = (
      <SelectionCell
        {...selectRow}
        key="selection-cell"
        rowKey={key}
        rowIndex={rowIndex}
        selected={selected}
        disabled={!selectable}
        tabIndex={tabIndexCell ? (tabIndexStart += 1) : -1}
      />
    );
    if (isRenderFunctionColumnInLeft(selectColumnPosition)) {
      childrens.unshift(selectCell);
    } else {
      childrens.push(selectCell);
    }
  }

  if (showExpandColumn) {
    const expandCell = (
      <ExpandCell
        {...expandRow}
        key="expand-cell"
        rowKey={key}
        rowIndex={rowIndex}
        expanded={expanded}
        expandable={expandable}
        tabIndex={tabIndexCell ? (tabIndexStart += 1) : -1}
      />
    );
    if (isRenderFunctionColumnInLeft(expandColumnPosition)) {
      childrens.unshift(expandCell);
    } else {
      childrens.push(expandCell);
    }
  }

  return (
    <tr id={id} style={style} className={className} {...newAttrs}>
      {childrens}
    </tr>
  );
}, (prevProps, nextProps) => {
  if (
    prevProps.selected !== nextProps.selected ||
    prevProps.expanded !== nextProps.expanded ||
    prevProps.expandable !== nextProps.expandable ||
    prevProps.selectable !== nextProps.selectable ||
    prevProps.selectRow !== nextProps.selectRow ||
    prevProps.expandRow !== nextProps.expandRow ||
    shouldUpdatedBySelfProps(prevProps, nextProps) ||
    shouldRowContentUpdate(prevProps, nextProps)
  ) {
    return false;
  }
  return true;
});

export default RowAggregator;
