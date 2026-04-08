import { useCallback, useMemo } from "react";
import Const from "../const";

export interface UsePaginationProps {
  currPage: number;
  currSizePerPage: number;
  dataSize: number;
  pageStartIndex: number;
  paginationSize: number;
  withFirstAndLast: boolean;
  firstPageText: string;
  prePageText: string;
  nextPageText: string;
  lastPageText: string;
  alwaysShowAllBtns: boolean;
  sizePerPageList: any[];
  onPageChange: (page: number, currSizePerPage: number) => void;
  onSizePerPageChange?: (sizePerPage: number, page: number) => void;
  nextPageTitle?: string;
  prePageTitle?: string;
  firstPageTitle?: string;
  lastPageTitle?: string;
  disablePageTitle?: boolean;
}

export const usePagination = (props: UsePaginationProps) => {
  const {
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
    nextPageTitle = Const.NEXT_PAGE_TITLE,
    prePageTitle = Const.PRE_PAGE_TITLE,
    firstPageTitle = Const.FIRST_PAGE_TITLE,
    lastPageTitle = Const.LAST_PAGE_TITLE,
    disablePageTitle = false,
  } = props;

  const totalPages = useMemo(() => {
    return Math.ceil(dataSize / currSizePerPage);
  }, [dataSize, currSizePerPage]);

  const lastPage = useMemo(() => {
    return pageStartIndex + totalPages - 1;
  }, [pageStartIndex, totalPages]);

  const backToPrevPage = useCallback(() => {
    return currPage - 1 < pageStartIndex ? pageStartIndex : currPage - 1;
  }, [currPage, pageStartIndex]);

  const calculatePages = useCallback(() => {
    let pages: any = [];
    let endPage = totalPages;
    if (endPage <= 0) return [];

    let startPage = Math.max(
      currPage - Math.floor(paginationSize / 2),
      pageStartIndex
    );
    endPage = startPage + paginationSize - 1;

    if (endPage > lastPage) {
      endPage = lastPage;
      startPage = endPage - paginationSize + 1;
    }

    if (alwaysShowAllBtns) {
      if (withFirstAndLast) {
        pages.push({ type: 'first', page: firstPageText });
        pages.push({ type: 'pre', page: prePageText });
      } else {
        pages.push({ type: 'pre', page: prePageText });
      }
    } else if (startPage !== pageStartIndex && totalPages > paginationSize) {
      if (withFirstAndLast) {
        pages.push({ type: 'first', page: firstPageText });
        pages.push({ type: 'pre', page: prePageText });
      } else {
        pages.push({ type: 'pre', page: prePageText });
      }
    } else if (totalPages > 1 && pages.length === 0) {
      pages.push({ type: 'pre', page: prePageText });
    }

    for (let i = startPage; i <= endPage; i += 1) {
      if (i >= pageStartIndex) pages.push({ type: 'page', page: i });
    }

    if (alwaysShowAllBtns || (endPage <= lastPage && pages.length > 1)) {
      pages.push({ type: 'next', page: nextPageText });
    }
    if (withFirstAndLast && (alwaysShowAllBtns || (endPage <= lastPage && pages.length > 1))) {
      pages.push({ type: 'last', page: lastPageText });
    }

    return pages;
  }, [
    currPage,
    paginationSize,
    pageStartIndex,
    withFirstAndLast,
    firstPageText,
    prePageText,
    nextPageText,
    lastPageText,
    alwaysShowAllBtns,
    totalPages,
    lastPage,
  ]);

  const getPageStatus = useCallback(() => {
    const pages = calculatePages();
    const isStart = (pageItem: any) =>
      currPage === pageStartIndex &&
      (pageItem.type === 'first' || pageItem.type === 'pre');
    const isEnd = (pageItem: any) =>
      currPage === lastPage &&
      (pageItem.type === 'next' || pageItem.type === 'last');

    return pages
      .filter((pageItem: any) => {
        if (alwaysShowAllBtns) {
          return true;
        }
        return !(isStart(pageItem) || isEnd(pageItem));
      })
      .map((pageItem: any) => {
        let title: any;
        const active = pageItem.page === currPage;
        const disabled = isStart(pageItem) || isEnd(pageItem);

        if (pageItem.type === 'next') {
          title = nextPageTitle;
        } else if (pageItem.type === 'pre') {
          title = prePageTitle;
        } else if (pageItem.type === 'first') {
          title = firstPageTitle;
        } else if (pageItem.type === 'last') {
          title = lastPageTitle;
        } else {
          title = `${pageItem.page}`;
        }

        const pageResult: any = { page: pageItem.page, active, disabled, title };
        if (!disablePageTitle) {
          pageResult.title = title;
        }
        return pageResult;
      });
  }, [
    calculatePages,
    currPage,
    pageStartIndex,
    firstPageText,
    prePageText,
    nextPageText,
    lastPageText,
    alwaysShowAllBtns,
    lastPage,
    nextPageTitle,
    prePageTitle,
    firstPageTitle,
    lastPageTitle,
    disablePageTitle,
  ]);

  const handleChangePage = useCallback(
    (newPage: any) => {
      let page: any;
      if (newPage === prePageText) {
        page = backToPrevPage();
      } else if (newPage === nextPageText) {
        page = currPage + 1 > lastPage ? lastPage : currPage + 1;
      } else if (newPage === lastPageText) {
        page = lastPage;
      } else if (newPage === firstPageText) {
        page = pageStartIndex;
      } else {
        page = parseInt(newPage, 10);
      }
      if (page !== currPage) {
        onPageChange(page, currSizePerPage);
      }
    },
    [
      backToPrevPage,
      currPage,
      pageStartIndex,
      prePageText,
      nextPageText,
      lastPageText,
      firstPageText,
      onPageChange,
      lastPage,
    ]
  );

  const handleChangeSizePerPage = useCallback(
    (sizePerPage: any) => {
      const selectedSize =
        typeof sizePerPage === "string"
          ? parseInt(sizePerPage, 10)
          : sizePerPage;
      let newCurrPage = currPage;
      if (selectedSize !== currSizePerPage) {
        const newTotalPages = Math.ceil(dataSize / selectedSize);
        const newLastPage = pageStartIndex + newTotalPages - 1;
        if (newCurrPage > newLastPage) newCurrPage = newLastPage;
        if (onSizePerPageChange) {
          onSizePerPageChange(selectedSize, newCurrPage);
        }
      }
    },
    [currPage, currSizePerPage, dataSize, pageStartIndex, onSizePerPageChange]
  );

  const getSizePerPageStatus = useCallback(() => {
    return sizePerPageList.map((_sizePerPage: any) => {
      const pageText =
        typeof _sizePerPage.text !== "undefined"
          ? _sizePerPage.text
          : _sizePerPage;
      const pageNumber =
        typeof _sizePerPage.value !== "undefined"
          ? _sizePerPage.value
          : _sizePerPage;
      return {
        text: `${pageText}`,
        page: pageNumber,
      };
    });
  }, [sizePerPageList]);

  const fromTo = useMemo(() => {
    const offset = Math.abs(Const.PAGE_START_INDEX - pageStartIndex);

    let from = (currPage - pageStartIndex) * currSizePerPage;
    from = dataSize === 0 ? 0 : from + 1;
    let to = Math.min(currSizePerPage * (currPage + offset), dataSize);
    if (to > dataSize) to = dataSize;

    return [from, to];
  }, [dataSize, currPage, currSizePerPage, pageStartIndex]);

  return {
    totalPages,
    lastPage,
    getPageStatus,
    handleChangePage,
    handleChangeSizePerPage,
    getSizePerPageStatus,
    fromTo,
  };
};
