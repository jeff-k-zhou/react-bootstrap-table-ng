import React, { Component, ReactNode } from "react";

export interface ExpansionHeaderCellProps {
  isAnyExpands?: boolean;
  onAllRowExpand?: (
    e: React.MouseEvent<HTMLTableHeaderCellElement>,
    expandAll: boolean
  ) => void;
  expandHeaderColumnRenderer?: (args: { isAnyExpands: boolean }) => ReactNode;
}

const ExpansionHeaderCell: React.FC<ExpansionHeaderCellProps> = (props) => {
  const { isAnyExpands, onAllRowExpand, expandHeaderColumnRenderer } = props;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onAllRowExpand!(e as any, !isAnyExpands);
  };

  // Keyboard activation (WCAG 2.1.1)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onAllRowExpand!(e as any, !isAnyExpands);
    }
  };

  const expandLabel = isAnyExpands ? "Collapse all rows" : "Expand all rows";

  return (
    <th
      className="expand-cell-header"
      scope="col"
      data-row-selection
    >
      <button
        type="button"
        className="btn btn-link p-0 border-0"
        tabIndex={0}
        aria-expanded={isAnyExpands ?? false}
        aria-label={expandLabel}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{ color: "inherit", textDecoration: "none" }}
      >
        {expandHeaderColumnRenderer
          ? expandHeaderColumnRenderer({ isAnyExpands: isAnyExpands ?? false })
          : isAnyExpands
          ? "(-)"
          : "(+)"}
      </button>
    </th>
  );
};

export default ExpansionHeaderCell;
