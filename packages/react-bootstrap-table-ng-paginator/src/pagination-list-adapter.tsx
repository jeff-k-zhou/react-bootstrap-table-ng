/* eslint react/prop-types: 0 */
import React, { Component } from "react";

import { usePagination } from "./hooks/usePagination";
import PaginationList from "./pagination-list";

const paginationListAdapter = (WrappedComponent: any) => {
  return (props: any) => {
    const {
      lastPage,
      totalPages,
      pageButtonRenderer,
      onPageChange,
      disablePageTitle,
      hidePageListOnlyOnePage,
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
      nextPageTitle,
      prePageTitle,
      firstPageTitle,
      lastPageTitle,
    } = props;

    const { getPageStatus } = usePagination({
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
      nextPageTitle,
      prePageTitle,
      firstPageTitle,
      lastPageTitle,
      disablePageTitle,
    });

    const pages = getPageStatus();

    if (totalPages === 1 && hidePageListOnlyOnePage) {
      return null;
    }

    return (
      <WrappedComponent
        pageButtonRenderer={pageButtonRenderer}
        onPageChange={onPageChange}
        pages={pages}
        tableId={props.tableId}
        paginationListAriaLabel={props.paginationListAriaLabel}
      />
    );
  };
};

export const PaginationListWithAdapter = paginationListAdapter(PaginationList);
export default paginationListAdapter;
