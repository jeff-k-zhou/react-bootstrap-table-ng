import React, { FC } from "react";
import { usePagination } from "./hooks/usePagination";

export default (WrappedComponent: any) => {
  const PaginationHandler: FC<any> = (props) => {
    const {
      currPage,
      currSizePerPage,
      dataSize,
      totalSize,
      pageStartIndex,
      paginationSize,
      withFirstAndLast,
      firstPageText,
      prePageText,
      nextPageText,
      lastPageText,
      alwaysShowAllBtns,
      onPageChange,
      onSizePerPageChange,
    } = props;

    const {
      totalPages,
      lastPage,
      handleChangePage,
      handleChangeSizePerPage,
    } = usePagination({
      currPage,
      currSizePerPage,
      dataSize: totalSize ?? dataSize,
      pageStartIndex,
      paginationSize,
      withFirstAndLast,
      firstPageText,
      prePageText,
      nextPageText,
      lastPageText,
      alwaysShowAllBtns,
      onPageChange,
      onSizePerPageChange,
    } as any);

    return (
      <WrappedComponent
        {...props}
        lastPage={lastPage}
        totalPages={totalPages}
        onPageChange={handleChangePage}
        onSizePerPageChange={handleChangeSizePerPage}
      />
    );
  };

  return PaginationHandler;
};
