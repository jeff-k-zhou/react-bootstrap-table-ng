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

  const handleCheckBoxClick = (e: React.MouseEvent<HTMLTableHeaderCellElement>) => {
    onAllRowExpand!(e, !isAnyExpands);
  };

  const attrs = {
    onClick: handleCheckBoxClick,
  };

  return (
    <th className="expand-cell-header" data-row-selection {...attrs}>
      {expandHeaderColumnRenderer
        ? expandHeaderColumnRenderer({ isAnyExpands: isAnyExpands ?? false })
        : isAnyExpands
        ? "(-)"
        : "(+)"}
    </th>
  );
};

export default ExpansionHeaderCell;
