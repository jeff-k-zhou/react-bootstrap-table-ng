/* eslint react/prop-types: 0 */
import React from "react";
import PaginationJump from "./pagination-jump";

const paginationJumpAdapter = (WrappedComponent: any) => {
  return (props: any) => {
    const {
      currPage,
      pageStartIndex,
      lastPage,
      totalPages,
      onPageChange,
      tableId,
    } = props;

    // Only render when there is more than one page
    if (totalPages <= 1) return null;

    return (
      <WrappedComponent
        tableId={tableId}
        currPage={currPage}
        firstPage={pageStartIndex}
        lastPage={lastPage}
        onPageChange={onPageChange}
      />
    );
  };
};

export const PaginationJumpWithAdapter = paginationJumpAdapter(PaginationJump);
export default paginationJumpAdapter;
