import React, { useCallback } from 'react';
import { SORT_DESC } from '../const';

export const useRemoteResolver = (props: any) => {
  const { remote, onTableChange, pagination, filter, sort, search, data } = props;

  const propsRef = React.useRef(props);
  React.useLayoutEffect(() => {
    propsRef.current = props;
  });

  const isRemotePagination = useCallback(() => {
    const { remote } = propsRef.current;
    return (
      remote === true ||
      (typeof remote === 'object' && remote.pagination)
    );
  }, []);

  const isRemoteFiltering = useCallback(() => {
    const { remote } = propsRef.current;
    return (
      remote === true ||
      (typeof remote === 'object' && remote.filter) ||
      isRemotePagination()
    );
  }, [isRemotePagination]);

  const isRemoteSort = useCallback(() => {
    const { remote } = propsRef.current;
    return (
      remote === true ||
      (typeof remote === 'object' && remote.sort) ||
      isRemotePagination()
    );
  }, [isRemotePagination]);

  const isRemoteCellEdit = useCallback(() => {
    const { remote } = propsRef.current;
    return (
      remote === true ||
      (typeof remote === 'object' && remote.cellEdit)
    );
  }, []);

  const isRemoteSearch = useCallback(() => {
    const { remote } = propsRef.current;
    return (
      remote === true ||
      (typeof remote === 'object' && remote.search) ||
      isRemotePagination()
    );
  }, [isRemotePagination]);

  const getNewestState = useCallback((state = {}) => {
    const { pagination, filter, sort, search, data } = propsRef.current;
    let page: any;
    let sizePerPage: any;
    let filters = {};
    let sortField: any;
    let sortOrder: any;
    let searchText: any;

    if (pagination && pagination.options) {
      page = pagination.options.page || 1;
      sizePerPage = pagination.options.sizePerPage || 10;
    }
    if (filter && filter.props) {
      filters = filter.props.currFilters || {};
    }
    if (sort && sort.props) {
      sortField = sort.props.sortField;
      sortOrder = sort.props.sortOrder || SORT_DESC;
    }
    if (search && search.props) {
      searchText = search.props.searchText;
    }

    return {
      page,
      sizePerPage,
      filters,
      sortField,
      sortOrder,
      searchText,
      data,
      ...state
    };
  }, []);

  const handleRemotePageChange = useCallback((page: number, sizePerPage: number) => {
    const { onTableChange } = propsRef.current;
    onTableChange('pagination', getNewestState({ page, sizePerPage }));
  }, [getNewestState]);

  const handleRemoteFilterChange = useCallback((filters: any) => {
    const { onTableChange, pagination } = propsRef.current;
    const newState: any = { filters };
    if (isRemotePagination()) {
      const options = pagination.options || {};
      newState.page = typeof options.pageStartIndex !== 'undefined'
        ? options.pageStartIndex
        : 1;
    }
    onTableChange('filter', getNewestState(newState));
  }, [getNewestState, isRemotePagination]);

  const handleRemoteSortChange = useCallback((sortField: string, sortOrder: string | undefined) => {
    const { onTableChange } = propsRef.current;
    onTableChange('sort', getNewestState({ sortField, sortOrder }));
  }, [getNewestState]);

  const handleRemoteCellChange = useCallback((rowId: any, dataField: string, newValue: any) => {
    const { onTableChange } = propsRef.current;
    const cellEdit = { rowId, dataField, newValue };
    onTableChange('cellEdit', getNewestState({ cellEdit }));
  }, [getNewestState]);

  const handleRemoteSearchChange = useCallback((searchText: string) => {
    const { onTableChange } = propsRef.current;
    onTableChange('search', getNewestState({ searchText }));
  }, [getNewestState]);

  return {
    isRemotePagination,
    isRemoteFiltering,
    isRemoteSort,
    isRemoteCellEdit,
    isRemoteSearch,
    handleRemotePageChange,
    handleRemoteFilterChange,
    handleRemoteSortChange,
    handleRemoteCellChange,
    handleRemoteSearchChange,
    getNewestState
  };
};

export default (Base: any) => {
  return React.forwardRef((props: any, ref: any) => {
    const remoteResolver = useRemoteResolver(props);
    return <Base {...props} {...remoteResolver} ref={ref} />;
  }) as any;
};

