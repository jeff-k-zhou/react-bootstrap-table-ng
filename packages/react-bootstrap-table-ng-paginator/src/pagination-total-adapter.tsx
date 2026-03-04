/* eslint react/prop-types: 0 */
import React from "react";
import { usePagination } from "./hooks/usePagination";
import PaginationTotal from "./pagination-total";

const paginationTotalAdapter = (WrappedComponent: any) => {
  return (props: any) => {
    const {
      currPage,
      currSizePerPage,
      pageStartIndex,
      dataSize,
      paginationTotalRenderer,
      // Default values from usePaginationState or props
      paginationSize = 5,
      withFirstAndLast = true,
      alwaysShowAllBtns = false,
      firstPageText = "<<",
      prePageText = "<",
      nextPageText = ">",
      lastPageText = ">>",
      onPageChange = () => {},
    } = props;

    const { fromTo } = usePagination({
      currPage,
      currSizePerPage,
      dataSize,
      pageStartIndex,
      paginationSize,
      withFirstAndLast,
      alwaysShowAllBtns,
      firstPageText,
      prePageText,
      nextPageText,
      lastPageText,
      sizePerPageList: props.sizePerPageList || [],
      onPageChange,
    });

    const [from, to] = fromTo;

    return (
      <WrappedComponent
        from={from}
        to={to}
        dataSize={dataSize}
        paginationTotalRenderer={paginationTotalRenderer}
      />
    );
  };
};

export const PaginationTotalWithAdapter =
  paginationTotalAdapter(PaginationTotal);
export default paginationTotalAdapter;
