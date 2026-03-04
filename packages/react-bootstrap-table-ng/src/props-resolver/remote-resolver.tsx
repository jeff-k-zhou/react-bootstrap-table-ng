import React from 'react';
import { SORT_DESC } from '../const';

export default (Base: any) => {
  const isClassComponent = Base && Base.prototype && Base.prototype.isReactComponent;
  const ExtendBase: any = isClassComponent
    ? Base
    : class extends React.Component<any, any> {
        render() {
          // @ts-ignore
          return <Base {...this.props} />;
        }
      };

  class RemoteResolver extends ExtendBase {
    getNewestState(state = {}) {
      let page: any;
      let sizePerPage: any;
      let filters = {};
      let sortField: any;
      let sortOrder: any;
      let searchText: any;

      const props = (this as any).props;
      if (props.pagination && props.pagination.options) {
        page = props.pagination.options.page || 1;
        sizePerPage = props.pagination.options.sizePerPage || 10;
      }
      if (props.filter && props.filter.props) {
        filters = props.filter.props.currFilters || {};
      }
      if (props.sort && props.sort.props) {
        sortField = props.sort.props.sortField;
        sortOrder = props.sort.props.sortOrder || SORT_DESC;
      }
      if (props.search && props.search.props) {
        searchText = props.search.props.searchText;
      }

      return {
        page,
        sizePerPage,
        filters,
        sortField,
        sortOrder,
        searchText,
        data: props.data,
        ...state
      };
    }

    isRemotePagination = () => {
      const { remote } = (this as any).props;
      return (
        remote === true ||
        (typeof remote === 'object' && remote.pagination)
      );
    }

    isRemoteFiltering = () => {
      const { remote } = (this as any).props;
      return (
        remote === true ||
        (typeof remote === 'object' && remote.filter) ||
        this.isRemotePagination()
      );
    }

    isRemoteSort = () => {
      const { remote } = (this as any).props;
      return (
        remote === true ||
        (typeof remote === 'object' && remote.sort) ||
        this.isRemotePagination()
      );
    }

    isRemoteCellEdit = () => {
      const { remote } = (this as any).props;
      return (
        remote === true ||
        (typeof remote === 'object' && remote.cellEdit)
      );
    }

    isRemoteSearch = () => {
      const { remote } = (this as any).props;
      return (
        remote === true ||
        (typeof remote === 'object' && remote.search) ||
        this.isRemotePagination()
      );
    }

    handleRemotePageChange = (page: number, sizePerPage: number) => {
      (this as any).props.onTableChange('pagination', this.getNewestState({ page, sizePerPage }));
    }

    handleRemoteFilterChange = (filters: any) => {
      const newState: any = { filters };
      if (this.isRemotePagination()) {
        const options = (this as any).props.pagination.options || {};
        newState.page = typeof options.pageStartIndex !== 'undefined'
          ? options.pageStartIndex
          : 1;
      }
      (this as any).props.onTableChange('filter', this.getNewestState(newState));
    }

    handleRemoteSortChange = (sortField: string, sortOrder: string | undefined) => {
      (this as any).props.onTableChange('sort', this.getNewestState({ sortField, sortOrder }));
    }

    handleRemoteCellChange = (rowId: any, dataField: string, newValue: any) => {
      const cellEdit = { rowId, dataField, newValue };
      (this as any).props.onTableChange('cellEdit', this.getNewestState({ cellEdit }));
    }

    handleRemoteSearchChange = (searchText: string) => {
      (this as any).props.onTableChange('search', this.getNewestState({ searchText }));
    }
  }

  return RemoteResolver as any as new (props: any) => React.Component<any, any>;
};
