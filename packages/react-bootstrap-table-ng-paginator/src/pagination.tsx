/* eslint react/require-default-props: 0 */
/* eslint arrow-body-style: 0 */
import cs from "classnames";
import React from "react";
import Const from "./const";
import { PaginationListWithAdapter } from "./pagination-list-adapter";
import { PaginationTotalWithAdapter } from "./pagination-total-adapter";
import { SizePerPageDropdownWithAdapter } from "./size-per-page-dropdown-adapter";
import { usePagination } from "./hooks/usePagination";
import { PaginationJumpWithAdapter } from "./pagination-jump-adapter";

const Pagination: React.FC<any> = (props) => {
  const {
    tableId,
    currPage,
    pageStartIndex = Const.PAGE_START_INDEX,
    showTotal = Const.SHOW_TOTAL,
    showPageJump = Const.SHOW_PAGE_JUMP,
    dataSize,
    pageListRenderer = null,
    pageButtonRenderer = null,
    paginationTotalRenderer = Const.PAGINATION_TOTAL,
    hidePageListOnlyOnePage = Const.HIDE_PAGE_LIST_ONLY_ONE_PAGE,
    onPageChange,
    sizePerPageList = Const.SIZE_PER_PAGE_LIST,
    currSizePerPage,
    hideSizePerPage = Const.HIDE_SIZE_PER_PAGE,
    sizePerPageRenderer = null,
    sizePerPageOptionRenderer = null,
    onSizePerPageChange,
    bootstrap4 = false,
    bootstrap5 = false,
    firstPageText = Const.FIRST_PAGE_TEXT,
    prePageText = Const.PRE_PAGE_TEXT,
    nextPageText = Const.NEXT_PAGE_TEXT,
    lastPageText = Const.LAST_PAGE_TEXT,
    prePageTitle = Const.PRE_PAGE_TITLE,
    nextPageTitle = Const.NEXT_PAGE_TITLE,
    firstPageTitle = Const.FIRST_PAGE_TITLE,
    lastPageTitle = Const.LAST_PAGE_TITLE,
    withFirstAndLast = Const.WITH_FIRST_AND_LAST,
    alwaysShowAllBtns = Const.SHOW_ALL_PAGE_BTNS,
    paginationSize = Const.PAGINATION_SIZE,
    totalSize = null,
    disablePageTitle = Const.DISABLE_PAGE_TITLE,
    ...rest
  } = props;

  const {
    totalPages,
    lastPage,
    getPageStatus,
    handleChangePage,
    handleChangeSizePerPage,
  } = usePagination({
    currPage,
    currSizePerPage,
    dataSize: totalSize ?? dataSize,
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
    sizePerPageList,
    onPageChange,
    onSizePerPageChange,
    disablePageTitle,
  } as any);

  const pageListClass = cs(
    "react-bootstrap-table-pagination-list",
    "col-md-5 col-xs-5 col-5 col-sm-5 col-lg-5",
    {
      "react-bootstrap-table-pagination-list-hidden":
        hidePageListOnlyOnePage && totalPages <= 1,
    }
  );

  const pages = getPageStatus();

  return (
    <div className="row react-bootstrap-table-pagination">
      <div className="col-md-5 col-xs-5 col-5 col-sm-5 col-lg-5">
        <SizePerPageDropdownWithAdapter
          bootstrap4={bootstrap4}
          bootstrap5={bootstrap5}
          tableId={tableId}
          sizePerPageList={sizePerPageList}
          currSizePerPage={currSizePerPage}
          hideSizePerPage={hideSizePerPage}
          onSizePerPageChange={handleChangeSizePerPage}
          sizePerPageRenderer={sizePerPageRenderer}
          sizePerPageOptionRenderer={sizePerPageOptionRenderer}
        />
        {showTotal ? (
          <PaginationTotalWithAdapter
            currPage={currPage}
            currSizePerPage={currSizePerPage}
            dataSize={dataSize}
            pageStartIndex={pageStartIndex}
            paginationTotalRenderer={paginationTotalRenderer}
          />
        ) : null}
      </div>
      <div className="col-md-2 col-xs-2 col-2 col-sm-2 col-lg-2 d-flex justify-content-center align-items-center">
        {showPageJump ? (
          <PaginationJumpWithAdapter
            tableId={tableId}
            currPage={currPage}
            pageStartIndex={pageStartIndex}
            lastPage={lastPage}
            totalPages={totalPages}
            onPageChange={handleChangePage}
          />
        ) : null}
      </div>
      {pageListRenderer ? (
        pageListRenderer({
          pages,
          onPageChange: handleChangePage,
        })
      ) : (
        <div className={pageListClass}>
          <PaginationListWithAdapter
          {...rest}
            tableId={tableId}
            lastPage={lastPage}
            totalPages={totalPages}
            pageButtonRenderer={pageButtonRenderer}
            onPageChange={handleChangePage}
            disablePageTitle={disablePageTitle}
            hidePageListOnlyOnePage={hidePageListOnlyOnePage}
            currPage={currPage}
            currSizePerPage={currSizePerPage}
            dataSize={dataSize}
            pageStartIndex={pageStartIndex}
            paginationSize={paginationSize}
            withFirstAndLast={withFirstAndLast}
            alwaysShowAllBtns={alwaysShowAllBtns}
            firstPageText={firstPageText}
            prePageText={prePageText}
            nextPageText={nextPageText}
            lastPageText={lastPageText}
            prePageTitle={prePageTitle}
            nextPageTitle={nextPageTitle}
            firstPageTitle={firstPageTitle}
            lastPageTitle={lastPageTitle}
            getPageStatus={getPageStatus}
          />
        </div>
      )}
    </div>
  );
};

export default Pagination;
