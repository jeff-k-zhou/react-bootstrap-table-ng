import React, { useRef, useEffect } from "react";
import { useRowEventDelegater } from "./event-delegater";
import RowPureContent from "./row-pure-content";
import { RowProps, shouldRowContentUpdate, shouldUpdatedBySelfProps } from "./should-updater";

const SimpleRow = React.memo((props: RowProps) => {
  const {
    editable = true,
    className = undefined,
    style = {},
    attrs = {},
    visibleColumnSize,
    tabIndexCell,
    ...rest
  } = props;

  const { delegate } = useRowEventDelegater({
    row: props.row,
    selected: props.selected,
    keyField: props.keyField,
    selectable: props.selectable,
    expandable: props.expandable,
    rowIndex: props.rowIndex!,
    expanded: props.expanded,
    expandRow: props.expandRow,
    selectRow: props.selectRow,
    DELAY_FOR_DBCLICK: (props as any).DELAY_FOR_DBCLICK,
  });

  const trAttrs = delegate(attrs);
  const tabIndexStart = props.rowIndex! * visibleColumnSize! + 1;

  const prevProps = useRef<RowProps>(props);
  // Compare previous props to current props to see if children need rendering
  const shouldUpdateContent = shouldRowContentUpdate(prevProps.current, props);

  useEffect(() => {
    prevProps.current = props;
  });

  return (
    <tr style={style} className={className} {...trAttrs}>
      <RowPureContent
        shouldUpdate={shouldUpdateContent}
        tabIndexStart={tabIndexCell ? tabIndexStart : -1}
        {...rest}
      />
    </tr>
  );
}, (prevProps, nextProps) => {
  const shouldUpdateRowContent = shouldRowContentUpdate(prevProps, nextProps);
  const shouldUpdateSelfProps = shouldUpdatedBySelfProps(prevProps, nextProps);
  
  // Return true to skip rendering (i.e. props are equal/no update needed)
  return !(shouldUpdateRowContent || shouldUpdateSelfProps);
});

export default SimpleRow;
