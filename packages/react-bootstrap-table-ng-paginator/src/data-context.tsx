/* eslint react/prop-types: 0 */
/* eslint react/require-default-props: 0 */
/* eslint no-lonely-if: 0 */

import React from "react";

import { PaginationDataProviderProps } from "..";
import Const from "./const";
import { alignPage, getByCurrPage } from "./page";
import Pagination from "./pagination";
import createBaseContext from "./state-context";

import { usePaginationState } from "./hooks/usePaginationState";

const PaginationDataContext = React.createContext<any>(null);

const PaginationDataProvider = React.forwardRef<any, PaginationDataProviderProps>((props, ref) => {
  const {
    data: propData,
    pagination,
    onDataSizeChange,
    children,
  } = props;

  const {
    currPage,
    setCurrPage,
    currSizePerPage,
    getPaginationProps,
    isRemotePagination,
    remoteEmitterRef,
  } = usePaginationState(props);

  React.useImperativeHandle(ref, () => ({
    currPage,
    currSizePerPage,
  }));

  const prevDataLengthRef = React.useRef(propData.length);

  React.useEffect(() => {
    const options = pagination!.options!;
    const { custom, onPageChange } = options;
    const pageStartIndex =
      typeof options.pageStartIndex !== "undefined"
        ? options.pageStartIndex
        : Const.PAGE_START_INDEX;

    if (!isRemotePagination() && !custom) {
      const newPage = alignPage(
        propData.length,
        prevDataLengthRef.current,
        currPage,
        currSizePerPage,
        pageStartIndex
      );

      if (currPage !== newPage) {
        if (onPageChange) {
          onPageChange(newPage, currSizePerPage);
        }
        setCurrPage(newPage);
      }
    }

    if (onDataSizeChange && propData.length !== prevDataLengthRef.current) {
      onDataSizeChange({ dataSize: prevDataLengthRef.current });
    }
    prevDataLengthRef.current = propData.length;
  }, [
    propData.length,
    pagination,
    onDataSizeChange,
    currPage,
    currSizePerPage,
    isRemotePagination,
    setCurrPage,
  ]);

  const options = pagination!.options!;
  const effectiveCurrSizePerPage = options.sizePerPage ?? currSizePerPage;
  const pageStartIndex =
    typeof options.pageStartIndex === "undefined"
      ? Const.PAGE_START_INDEX
      : options.pageStartIndex;

  let data = propData;
  let effectiveCurrPage = options.page ?? currPage;

  if (!isRemotePagination() && data.length <= (effectiveCurrPage - 1) * effectiveCurrSizePerPage) {
    const totalPages = Math.floor(data.length / effectiveCurrSizePerPage) + 1;
    effectiveCurrPage = effectiveCurrPage > totalPages ? totalPages : currPage;
    // Note: We don't use setCurrPage here to avoid render loops, similar to the class component's direct assignment
  }

  const slicedData = isRemotePagination()
    ? data
    : getByCurrPage(data, effectiveCurrPage, effectiveCurrSizePerPage, pageStartIndex);

  const renderDefaultPagination = () => {
    if (!options.custom) {
      const {
        page: paginationPage,
        sizePerPage: paginationSizePerPage,
        dataSize,
        ...rest
      } = getPaginationProps();
      return (
        <Pagination
          {...rest}
          key="pagination"
          dataSize={dataSize || propData.length}
          currPage={paginationPage}
          currSizePerPage={paginationSizePerPage}
        />
      );
    }
    return null;
  };

  return (
    <PaginationDataContext.Provider
      value={{
        data: slicedData,
        setRemoteEmitter: (emitter: any) => {
          remoteEmitterRef.current = emitter;
        },
      }}
    >
      {children}
      {renderDefaultPagination()}
    </PaginationDataContext.Provider>
  );
});

export default () => ({
  Provider: PaginationDataProvider,
  Consumer: PaginationDataContext.Consumer,
});
