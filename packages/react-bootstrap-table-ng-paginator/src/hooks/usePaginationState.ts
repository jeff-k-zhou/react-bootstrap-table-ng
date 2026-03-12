import React, { useState, useCallback, useRef, useEffect, useMemo, useLayoutEffect } from "react";
import EventEmitter from "events";
import Const from "../const";
import { alignPage } from "../page";

export const usePaginationState = (props: any) => {
  const { pagination, bootstrap4, tableId, remoteEmitter: propRemoteEmitter } = props;
  const options = pagination!.options!;
  const sizePerPageList = options.sizePerPageList || Const.SIZE_PER_PAGE_LIST;

  const [currPage, setCurrPage] = useState(() => {
    if (typeof options.page !== "undefined") return options.page;
    if (typeof options.pageStartIndex !== "undefined") return options.pageStartIndex;
    return Const.PAGE_START_INDEX;
  });

  const [currSizePerPage, setCurrSizePerPage] = useState(() => {
    if (typeof options.sizePerPage !== "undefined") return options.sizePerPage;
    if (typeof sizePerPageList[0] === "object") return (sizePerPageList[0] as any).value;
    return sizePerPageList[0] as number;
  });

  const [dataSize, setDataSize] = useState(options.totalSize);

  const dataChangeListenerRef = useRef(new EventEmitter());
  const remoteEmitterRef = useRef<any>(null);

  // Store the latest isRemotePagination prop in a ref to avoid unstable function references
  // (e.g. when the caller passes an inline arrow function like `() => false`).
  const isRemotePaginationPropRef = useRef(props.isRemotePagination);
  const propRemoteEmitterRef = useRef(propRemoteEmitter);
  useLayoutEffect(() => {
    isRemotePaginationPropRef.current = props.isRemotePagination;
    propRemoteEmitterRef.current = propRemoteEmitter;
  });

  // Stable callback – never changes identity, reads latest prop values via refs.
  const isRemotePagination = useCallback(() => {
    if (typeof isRemotePaginationPropRef.current === "function") {
      return isRemotePaginationPropRef.current();
    }
    const e = { result: undefined };
    const emitter = remoteEmitterRef.current || propRemoteEmitterRef.current;
    emitter?.emit("isRemotePagination", e);
    return e.result;
  }, []); // [] – intentionally stable

  const handleDataSizeChange = useCallback(
    (newDataSize: any) => {
      const pageStartIndex =
        typeof options.pageStartIndex === "undefined"
          ? Const.PAGE_START_INDEX
          : options.pageStartIndex;

      setCurrPage((prevPage: number) =>
        alignPage(
          newDataSize,
          dataSize,
          prevPage,
          currSizePerPage,
          pageStartIndex
        )
      );
      setDataSize(newDataSize);
    },
    [options.pageStartIndex, dataSize, currSizePerPage]
  );

  useEffect(() => {
    const emitter = dataChangeListenerRef.current;
    emitter.on("filterChanged", handleDataSizeChange);
    return () => {
      emitter.off("filterChanged", handleDataSizeChange);
    };
  }, [handleDataSizeChange]);

  const handleChangePage = useCallback(
    (page: any) => {
      if (options.onPageChange) {
        options.onPageChange(page, currSizePerPage);
      }

      setCurrPage(page);

      if (isRemotePagination()) {
        const emitter = remoteEmitterRef.current || propRemoteEmitter;
        emitter?.emit("paginationChange", page, currSizePerPage);
      }
    },
    [options, currSizePerPage, isRemotePagination, propRemoteEmitter]
  );

  const handleChangeSizePerPage = useCallback(
    (sizePerPage: any, page: any) => {
      if (options.onSizePerPageChange) {
        options.onSizePerPageChange(sizePerPage, page);
      }

      setCurrPage(page);
      setCurrSizePerPage(sizePerPage);

      if (isRemotePagination()) {
        const emitter = remoteEmitterRef.current || propRemoteEmitter;
        emitter?.emit("paginationChange", page, sizePerPage);
      }
    },
    [options, isRemotePagination, propRemoteEmitter]
  );

  const getPaginationProps = useCallback(() => {
    const effectiveDataSize = isRemotePagination() ? options.totalSize! : dataSize!;
    const withFirstAndLast =
      typeof options.withFirstAndLast === "undefined"
        ? Const.With_FIRST_AND_LAST
        : options.withFirstAndLast;
    const alwaysShowAllBtns =
      typeof options.alwaysShowAllBtns === "undefined"
        ? Const.SHOW_ALL_PAGE_BTNS
        : options.alwaysShowAllBtns;
    const hideSizePerPage =
      typeof options.hideSizePerPage === "undefined"
        ? Const.HIDE_SIZE_PER_PAGE
        : options.hideSizePerPage;
    const hidePageListOnlyOnePage =
      typeof options.hidePageListOnlyOnePage === "undefined"
        ? Const.HIDE_PAGE_LIST_ONLY_ONE_PAGE
        : options.hidePageListOnlyOnePage;
    const pageStartIndex =
      typeof options.pageStartIndex === "undefined"
        ? Const.PAGE_START_INDEX
        : options.pageStartIndex;

    return {
      ...options,
      bootstrap4,
      tableId,
      page: currPage,
      sizePerPage: currSizePerPage,
      pageStartIndex,
      hidePageListOnlyOnePage,
      hideSizePerPage,
      alwaysShowAllBtns,
      withFirstAndLast,
      totalSize: effectiveDataSize,
      dataSize: effectiveDataSize,
      sizePerPageList,
      paginationSize: options.paginationSize || Const.PAGINATION_SIZE,
      showTotal: options.showTotal,
      pageListRenderer: options.pageListRenderer,
      pageButtonRenderer: options.pageButtonRenderer,
      sizePerPageRenderer: options.sizePerPageRenderer,
      paginationTotalRenderer: options.paginationTotalRenderer,
      sizePerPageOptionRenderer: options.sizePerPageOptionRenderer,
      firstPageText: options.firstPageText || Const.FIRST_PAGE_TEXT,
      prePageText: options.prePageText || Const.PRE_PAGE_TEXT,
      nextPageText: options.nextPageText || Const.NEXT_PAGE_TEXT,
      lastPageText: options.lastPageText || Const.LAST_PAGE_TEXT,
      prePageTitle: options.prePageTitle || Const.PRE_PAGE_TITLE,
      nextPageTitle: options.nextPageTitle || Const.NEXT_PAGE_TITLE,
      firstPageTitle: options.firstPageTitle || Const.FIRST_PAGE_TITLE,
      lastPageTitle: options.lastPageTitle || Const.LAST_PAGE_TITLE,
      onPageChange: handleChangePage,
      onSizePerPageChange: handleChangeSizePerPage,
    };
  }, [
    isRemotePagination,
    options,
    dataSize,
    bootstrap4,
    tableId,
    currPage,
    currSizePerPage,
    sizePerPageList,
    handleChangePage,
    handleChangeSizePerPage,
  ]);

  return {
    currPage,
    setCurrPage,
    currSizePerPage,
    setCurrSizePerPage,
    dataSize,
    setDataSize,
    dataChangeListener: dataChangeListenerRef.current,
    remoteEmitterRef,
    isRemotePagination,
    handleChangePage,
    handleChangeSizePerPage,
    getPaginationProps,
  };
};
