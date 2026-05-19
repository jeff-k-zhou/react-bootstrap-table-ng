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
  /** ID of the expansion row element — used for aria-controls */
  expansionRowId?: string;
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
    expansionRowId,
  } = props;



  const expandLabel = expandable
    ? expanded
      ? "Collapse row"
      : "Expand row"
    : undefined;

  const content = expandColumnRenderer
    ? expandColumnRenderer({
      expandable,
      expanded,
      rowKey,
    })
    : expandable
      ? expanded
        ? "(-)"
        : "(+)"
      : "";

  return (
    <td className="expand-cell" data-testid="expand-cell">
      {expandable ? (
        <button
          type="button"
          className="btn btn-link p-0 border-0"
          tabIndex={tabIndex !== undefined && tabIndex !== -1 ? tabIndex : 0}
          aria-expanded={expanded}
          aria-label={expandLabel}
          aria-controls={expansionRowId}
          onClick={(e) => {
            e.stopPropagation();
            onRowExpand(rowKey, !expanded, rowIndex, e as any);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onRowExpand(rowKey, !expanded, rowIndex, e as any);
            }
          }}
          style={{ color: "inherit", textDecoration: "none" }}
        >
          {content}
        </button>
      ) : (
        content
      )}
    </td>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.rowIndex === nextProps.rowIndex &&
    prevProps.expanded === nextProps.expanded &&
    prevProps.rowKey === nextProps.rowKey &&
    prevProps.tabIndex === nextProps.tabIndex &&
    prevProps.onRowExpand === nextProps.onRowExpand &&
    prevProps.expandColumnRenderer === nextProps.expandColumnRenderer &&
    prevProps.expansionRowId === nextProps.expansionRowId
  );
});

export default ExpandCell;
