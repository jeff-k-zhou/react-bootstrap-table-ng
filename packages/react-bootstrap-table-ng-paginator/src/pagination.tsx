/* eslint react/require-default-props: 0 */
/* eslint arrow-body-style: 0 */
import cs from "classnames";
import React from "react";
import Const from "./const";
import { PaginationListWithAdapter } from "./pagination-list-adapter";
import { PaginationTotalWithAdapter } from "./pagination-total-adapter";
import { SizePerPageDropdownWithAdapter } from "./size-per-page-dropdown-adapter";
import { usePagination } from "./hooks/usePagination";

const Pagination: React.FC<any> = (props) => {
  const {
    tableId,
    currPage,
    pageStartIndex = Const.PAGE_START_INDEX,
    showTotal = Const.SHOW_TOTAL,
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
    disablePageTitle = false,
    paginationSize = Const.PAGINATION_SIZE,
    withFirstAndLast = Const.With_FIRST_AND_LAST,
    alwaysShowAllBtns = Const.SHOW_ALL_PAGE_BTNS,
    firstPageText = Const.FIRST_PAGE_TEXT,
    prePageText = Const.PRE_PAGE_TEXT,
    nextPageText = Const.NEXT_PAGE_TEXT,
    lastPageText = Const.LAST_PAGE_TEXT,
    nextPageTitle = Const.NEXT_PAGE_TITLE,
    prePageTitle = Const.PRE_PAGE_TITLE,
    firstPageTitle = Const.FIRST_PAGE_TITLE,
    lastPageTitle = Const.LAST_PAGE_TITLE,
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
    dataSize,
    pageStartIndex,
    paginationSize,
    withFirstAndLast,
    firstPageText,
    prePageText,
    nextPageText,
    lastPageText,
    alwaysShowAllBtns,
    sizePerPageList,
    onPageChange,
    onSizePerPageChange,
    nextPageTitle,
    prePageTitle,
    firstPageTitle,
    lastPageTitle,
    disablePageTitle,
  });

  const pages = getPageStatus();

  const pageListClass = cs(
    "react-bootstrap-table-pagination-list",
    "col-md-6 col-xs-6 col-6 col-sm-6 col-lg-6",
    {
      "react-bootstrap-table-pagination-list-hidden":
        hidePageListOnlyOnePage && totalPages === 1,
    }
  );

  return (
    <div className="row react-bootstrap-table-pagination">
      <div className="col-md-6 col-xs-6 col-6 col-sm-6 col-lg-6">
        <SizePerPageDropdownWithAdapter
          bootstrap4={bootstrap4}
          bootstrap5={bootstrap5}
          tableId={tableId}
          sizePerPageList={sizePerPageList}
          currSizePerPage={currSizePerPage}
          hideSizePerPage={hideSizePerPage}
          sizePerPageRenderer={sizePerPageRenderer}
          sizePerPageOptionRenderer={sizePerPageOptionRenderer}
          onSizePerPageChange={handleChangeSizePerPage}
        />
        {showTotal ? (
          <PaginationTotalWithAdapter
            currPage={currPage}
            currSizePerPage={currSizePerPage}
            pageStartIndex={pageStartIndex}
            dataSize={dataSize}
            paginationTotalRenderer={paginationTotalRenderer}
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
            currPage={currPage}
            currSizePerPage={currSizePerPage}
            dataSize={dataSize}
            pageStartIndex={pageStartIndex}
            lastPage={lastPage}
            totalPages={totalPages}
            pageButtonRenderer={pageButtonRenderer}
            onPageChange={handleChangePage}
            paginationSize={paginationSize}
            withFirstAndLast={withFirstAndLast}
            firstPageText={firstPageText}
            prePageText={prePageText}
            nextPageText={nextPageText}
            lastPageText={lastPageText}
            alwaysShowAllBtns={alwaysShowAllBtns}
          />
        </div>
      )}
    </div>
  );
};

export default Pagination;
