import React, { Component, MouseEvent } from "react";

interface ExpandCellProps {
  rowKey: any;
  expanded: boolean;
  expandable: boolean;
  onRowExpand: (
    rowKey: any,
    expanded: boolean,
    rowIndex: number | undefined,
    e: MouseEvent
  ) => void;
  expandColumnRenderer?: (params: {
    expandable: boolean;
    expanded: boolean;
    rowKey: any;
  }) => React.ReactNode;
  rowIndex?: number;
  tabIndex?: number;
}

const ExpandCell: React.FC<ExpandCellProps> = React.memo((props) => {
  const {
    rowKey,
    expanded,
    expandable,
    onRowExpand,
    expandColumnRenderer,
    rowIndex,
    tabIndex,
  } = props;

  const handleClick = (e: React.MouseEvent<HTMLTableDataCellElement>) => {
    e.stopPropagation();
    onRowExpand(rowKey, !expanded, rowIndex, e);
  };

  const attrs: { tabIndex?: number } = {};
  if (tabIndex !== undefined && tabIndex !== -1) attrs.tabIndex = tabIndex;

  return (
    <td className="expand-cell" onClick={handleClick} data-testid="expand-cell" {...attrs}>
      {expandColumnRenderer
        ? expandColumnRenderer({
          expandable,
          expanded,
          rowKey,
        })
        : expandable
          ? expanded
            ? "(-)"
            : "(+)"
          : ""}
    </td>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.rowIndex === nextProps.rowIndex &&
    prevProps.expanded === nextProps.expanded &&
    prevProps.rowKey === nextProps.rowKey &&
    prevProps.tabIndex === nextProps.tabIndex &&
    prevProps.onRowExpand === nextProps.onRowExpand &&
    prevProps.expandColumnRenderer === nextProps.expandColumnRenderer
  );
});

export default ExpandCell;
