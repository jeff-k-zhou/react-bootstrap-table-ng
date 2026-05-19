
import React from "react";

interface PaginationTotalProps {
  from: number;
  to: number;
  dataSize: number;
  paginationTotalRenderer?: (from: number, to: number, dataSize: number) => React.ReactElement | null;
}

const PaginationTotal = (props: PaginationTotalProps) => {
  if (props.paginationTotalRenderer) {
    return props.paginationTotalRenderer(props.from, props.to, props.dataSize);
  }
  return (
    <span
      className="react-bootstrap-table-pagination-total"
      aria-live="polite"
      aria-atomic="true"
    >
      &nbsp;Showing rows {props.from} to&nbsp;{props.to} of&nbsp;
      {props.dataSize}
    </span>
  );
};


export default PaginationTotal;
