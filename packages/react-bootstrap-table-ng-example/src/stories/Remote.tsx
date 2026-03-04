/* eslint-disable import/no-anonymous-default-export */

import React from "react";

import BootstrapTable from "../../../react-bootstrap-table-ng";
import cellEditFactory from "../../../react-bootstrap-table-ng-editor";
import filterFactory, {
  LIKE,
  textFilter,
} from "../../../react-bootstrap-table-ng-filter";
import overlayFactory from "../../../react-bootstrap-table-ng-overlay";
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  PaginationTotalStandalone, SizePerPageDropdownStandalone
} from "../../../react-bootstrap-table-ng-paginator";
import ToolkitProvider, {
  Search, CSVExport
} from "../../../react-bootstrap-table-ng-toolkit";
import Code from "../components/common/code-block";
import { productsGenerator } from "../utils/common";

import "../../../react-bootstrap-table-ng-filter/style/react-bootstrap-table-ng-filter.scss";
import "../../../react-bootstrap-table-ng-paginator/style/react-bootstrap-table-ng-paginator.scss";
import "../../../react-bootstrap-table-ng-toolkit/style/react-bootstrap-table-ng-toolkit.scss";
import "../../../react-bootstrap-table-ng/style/react-bootstrap-table-ng.scss";
import "./stylesheet/storybook.scss";
import "./stylesheet/tomorrow.min.css";

const { SearchBar } = Search;

const remoteSortColumns = [
  {
    dataField: "id",
    text: "Product ID",
  },
  {
    dataField: "name",
    text: "Product Name",
    sort: true,
  },
  {
    dataField: "price",
    text: "Product Price",
    sort: true,
  },
];

const remoteSortSourceCode = `\
import BootstrapTable from 'react-bootstrap-table-ng';

const columns = [{
  dataField: 'id',
  text: 'Product ID',
}, {
  dataField: 'name',
  text: 'Product Name',
  filter: textFilter()
}, {
  dataField: 'price',
  text: 'Product Price',
  filter: textFilter()
}];

const RemoteSort = props => (
  <div>
    <BootstrapTable
      remote={ { sort: true } }
      keyField="id"
      data={ props.data }
      columns={ columns }
      onTableChange={ props.onTableChange }
    />
    <Code>{ sourceCode }</Code>
  </div>
);

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: products
    };
  }

  handleTableChange = (type, { sortField, sortOrder, data }) => {
    setTimeout(() => {
      let result;
      if (sortOrder === 'asc') {
        result = data.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return 1;
          } else if (b[sortField] > a[sortField]) {
            return -1;
          }
          return 0;
        });
      } else {
        result = data.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (b[sortField] > a[sortField]) {
            return 1;
          }
          return 0;
        });
      }
      this.setState(() => ({
        data: result
      }));
    }, 2000);
  }

  render() {
    return (
      <RemoteSort
        data={ this.state.data }
        onTableChange={ this.handleTableChange }
      />
    );
  }
}
`;

interface RemoteSortProps {
  data: any[];
  onTableChange: (type: any, context: any) => void;
  loading: boolean;
}

const remoteSortOverlay = overlayFactory({ spinner: true });

const RemoteSort = (props: any) => (
  <div>
    <BootstrapTable
      remote
      keyField="id"
      data={props.data}
      columns={remoteSortColumns}
      onTableChange={props.onTableChange}
      overlay={remoteSortOverlay}
      loading={props.loading}
    />
    <Code>{remoteSortSourceCode}</Code>
  </div>
);

interface RemoteSortState {
  data: any;
  loading: boolean;
}

class RemoteSortComponent extends React.Component<{}, RemoteSortState> {
  products = productsGenerator(5);

  constructor(props: any) {
    super(props);
    this.state = {
      data: this.products,
      loading: false,
    };
  }

  handleTableChange = (type: any, { sortField, sortOrder, data }: any) => {
    this.setState({ loading: true });
    setTimeout(() => {
      let result: any;
      if (sortOrder === "asc") {
        result = data.sort((a: any, b: any) => {
          if (a[sortField] > b[sortField]) {
            return 1;
          } else if (b[sortField] > a[sortField]) {
            return -1;
          }
          return 0;
        });
      } else {
        result = data.sort((a: any, b: any) => {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (b[sortField] > a[sortField]) {
            return 1;
          }
          return 0;
        });
      }
      this.setState(() => ({
        data: result,
        loading: false,
      }));
    }, 2000);
  };

  render() {
    return (
      <RemoteSort
        data={this.state.data}
        onTableChange={this.handleTableChange}
        loading={this.state.loading}
      />
    );
  }
}

const remoteFilterColumns = [
  {
    dataField: "id",
    text: "Product ID",
  },
  {
    dataField: "name",
    text: "Product Name",
    filter: textFilter(),
  },
  {
    dataField: "price",
    text: "Product Price",
    filter: textFilter(),
  },
];

const remoteFilterSourceCode = `\
import BootstrapTable from 'react-bootstrap-table-ng';
import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

const columns = [{
  dataField: 'id',
  text: 'Product ID',
}, {
  dataField: 'name',
  text: 'Product Name',
  filter: textFilter()
}, {
  dataField: 'price',
  text: 'Product Price',
  filter: textFilter()
}];

const RemoteFilter = props => (
  <div>
    <BootstrapTable
      remote={ { filter: true } }
      keyField="id"
      data={ props.data }
      columns={ columns }
      filter={ filterFactory() }
      onTableChange={ props.onTableChange }
    />
    <Code>{ sourceCode }</Code>
  </div>
);

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: products
    };
  }

  handleTableChange = (type, { filters }) => {
    setTimeout(() => {
      const result = products.filter((row) => {
        let valid = true;
        for (const dataField in filters) {
          const { filterVal, filterType, comparator } = filters[dataField];

          if (filterType === 'TEXT') {
            if (comparator === Comparator.LIKE) {
              valid = row[dataField].toString().indexOf(filterVal) > -1;
            } else {
              valid = row[dataField] === filterVal;
            }
          }
          if (!valid) break;
        }
        return valid;
      });
      this.setState(() => ({
        data: result
      }));
    }, 2000);
  }

  render() {
    return (
      <RemoteFilter
        data={ this.state.data }
        onTableChange={ this.handleTableChange }
      />
    );
  }
}
`;

interface RemoteFilterProps {
  data: any[];
  onTableChange: (type: any, context: any) => void;
  loading: boolean;
}

const remoteFilterFilter = filterFactory();
const remoteFilterOverlay = overlayFactory({ spinner: true });

const RemoteFilter = (props: RemoteFilterProps) => (
  <div>
    <BootstrapTable
      remote={{ filter: true }}
      keyField="id"
      data={props.data}
      columns={remoteFilterColumns}
      filter={remoteFilterFilter}
      onTableChange={props.onTableChange}
      loading={props.loading}
      overlay={remoteFilterOverlay}
    />
    <Code>{remoteFilterSourceCode}</Code>
  </div>
);


interface RemoteFilterState {
  data: any;
  loading: boolean;
}

class RemoteFilterComponent extends React.Component<{}, RemoteFilterState> {
  products = productsGenerator(17);

  constructor(props: any) {
    super(props);
    this.state = {
      data: this.products,
      loading: false,
    };
  }

  handleTableChange = (type: any, { filters }: any) => {
    this.setState({ loading: true });
    setTimeout(() => {
      const result = this.products.filter((row: any) => {
        let valid = true;
        for (const dataField in filters) {
          const { filterVal, filterType, comparator } = filters[dataField];

          if (filterType === "TEXT") {
            if (comparator === LIKE) {
              valid = row[dataField].toString().indexOf(filterVal) > -1;
            } else {
              valid = row[dataField] === filterVal;
            }
          }
          if (!valid) break;
        }
        return valid;
      });
      this.setState(() => ({
        data: result,
        loading: false,
      }));
    }, 2000);
  };

  render() {
    return (
      <RemoteFilter
        data={this.state.data}
        onTableChange={this.handleTableChange}
        loading={this.state.loading}
      />
    );
  }
}

const remotePaginationSourceCode = `\
import BootstrapTable from 'react-bootstrap-table-ng';
import paginationFactory from 'react-bootstrap-table-ng-paginator';
// ...
const RemotePagination = ({ data, page, sizePerPage, onTableChange, totalSize }) => (
  <div>
    <BootstrapTable
      remote
      keyField="id"
      data={ data }
      columns={ columns }
      pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
      onTableChange={ onTableChange }
    />
    <Code>{ sourceCode }</Code>
  </div>
);

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      data: products.slice(0, 10),
      sizePerPage: 10
    };
  }

  handleTableChange = (type, { page, sizePerPage }) => {
    const currentIndex = (page - 1) * sizePerPage;
    setTimeout(() => {
      this.setState(() => ({
        page,
        data: products.slice(currentIndex, currentIndex + sizePerPage),
        sizePerPage
      }));
    }, 2000);
  }

  render() {
    const { data, sizePerPage, page } = this.state;
    return (
      <RemotePagination
        data={ data }
        page={ page }
        sizePerPage={ sizePerPage }
        totalSize={ products.length }
        onTableChange={ this.handleTableChange }
      />
    );
  }
}
`;

interface RemotePaginationProps {
  data: any[];
  page: number;
  totalSize: number;
  sizePerPage: number;
  onTableChange: (type: any, context: any) => void;
  loading: boolean;
}

const remotePaginationOverlay = overlayFactory({ spinner: true });

const RemotePagination = ({
  data,
  page,
  sizePerPage,
  onTableChange,
  totalSize,
  loading,
}: RemotePaginationProps) => (
  <div>
    <BootstrapTable
      remote
      keyField="id"
      data={data}
      columns={[
        {
          dataField: "id",
          text: "Product ID",
        },
        {
          dataField: "name",
          text: "Product Name",
        },
        {
          dataField: "price",
          text: "Product Price",
        },
      ]}
      pagination={paginationFactory({ page, sizePerPage, totalSize })}
      onTableChange={onTableChange}
      loading={loading}
      overlay={remotePaginationOverlay}
    />
    <Code>{remotePaginationSourceCode}</Code>
  </div>
);


interface RemotePaginationState {
  data: any;
  sizePerPage: number;
  page: any;
  loading: boolean;
}

class RemotePaginationComponent extends React.Component<
  {},
  RemotePaginationState
> {
  products = productsGenerator(87);

  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      data: this.products.slice(0, 10),
      sizePerPage: 10,
      loading: false,
    };
  }

  handleTableChange = (type: any, { page, sizePerPage }: any) => {
    const currentIndex = (page - 1) * sizePerPage;
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState(() => ({
        page,
        data: this.products.slice(currentIndex, currentIndex + sizePerPage),
        sizePerPage,
        loading: false,
      }));
    }, 2000);
  };

  render() {
    const { data, sizePerPage, page, loading } = this.state;
    return (
      <RemotePagination
        data={data}
        page={page}
        sizePerPage={sizePerPage}
        totalSize={this.products.length}
        onTableChange={this.handleTableChange}
        loading={loading}
      />
    );
  }
}

const remoteSearchColumns = [
  {
    dataField: "id",
    text: "Product ID",
  },
  {
    dataField: "name",
    text: "Product Name",
  },
  {
    dataField: "price",
    text: "Product Price",
  },
];

const remoteSearchSourceCode = `\
import BootstrapTable from 'react-bootstrap-table-ng';
import ToolkitProvider, { Search } from 'react-bootstrap-table-ng-toolkit';
import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

const columns = [{
  dataField: 'id',
  text: 'Product ID',
}, {
  dataField: 'name',
  text: 'Product Name',
  filter: textFilter()
}, {
  dataField: 'price',
  text: 'Product Price',
  filter: textFilter()
}];

const RemoteFilter = props => (
  <div>
    <ToolkitProvider
      keyField="id"
      data={ props.data }
      columns={ columns }
      search
    >
      {
        toolkitprops => [
          <SearchBar { ...toolkitprops.searchProps } />,
          <BootstrapTable
            { ...toolkitprops.baseProps }
            remote={ { search: true } }
            onTableChange={ props.onTableChange }
          />
        ]
      }
    </ToolkitProvider>
    <Code>{ sourceCode }</Code>
  </div>
);

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: products
    };
  }

  handleTableChange = (type, { filters }) => {
    setTimeout(() => {
      const result = products.filter((row) => {
        let valid = true;
        for (const dataField in filters) {
          const { filterVal, filterType, comparator } = filters[dataField];

          if (filterType === 'TEXT') {
            if (comparator === Comparator.LIKE) {
              valid = row[dataField].toString().indexOf(filterVal) > -1;
            } else {
              valid = row[dataField] === filterVal;
            }
          }
          if (!valid) break;
        }
        return valid;
      });
      this.setState(() => ({
        data: result
      }));
    }, 2000);
  }

  render() {
    return (
      <RemoteFilter
        data={ this.state.data }
        onTableChange={ this.handleTableChange }
      />
    );
  }
}
`;

interface RemoteSearchProps {
  data: any[];
  onTableChange: (type: any, context: any) => void;
  loading: boolean;
}

const remoteSearchOverlay = overlayFactory({ spinner: true });

const RemoteSearch = (props: RemoteSearchProps) => (
  <div>
    <ToolkitProvider
      keyField="id"
      data={props.data}
      columns={remoteSearchColumns}
      search
    >
      {(toolkitprops) => (
        <div>
          <SearchBar {...toolkitprops.searchProps} />
          <BootstrapTable
            {...toolkitprops.baseProps}
            remote={{ search: true }}
            onTableChange={props.onTableChange}
            overlay={remoteSearchOverlay}
            loading={props.loading}
          />
        </div>
      )}
    </ToolkitProvider>
    <Code>{remoteSearchSourceCode}</Code>
  </div>
);


interface RemoteSearchState {
  data: any;
  loading: boolean;
}

class RemoteSearchComponent extends React.Component<{}, RemoteSearchState> {
  products = productsGenerator(17);

  constructor(props: any) {
    super(props);
    this.state = {
      data: this.products,
      loading: false,
    };
  }

  handleTableChange = (type: any, { searchText }: any) => {
    this.setState({ loading: true });
    setTimeout(() => {
      const result = this.products.filter((row: any) => {
        for (let cidx = 0; cidx < remoteSearchColumns.length; cidx += 1) {
          const column = remoteSearchColumns[cidx];
          let targetValue = row[column.dataField];
          if (targetValue !== null && typeof targetValue !== "undefined") {
            targetValue = targetValue.toString().toLowerCase();
            if (targetValue.indexOf(searchText) > -1) {
              return true;
            }
          }
        }
        return false;
      });
      this.setState(() => ({
        data: result,
        loading: false,
      }));
    }, 2000);
  };

  render() {
    return (
      <RemoteSearch
        data={this.state.data}
        onTableChange={this.handleTableChange}
        loading={this.state.loading}
      />
    );
  }
}

const remoteCellEditSourceCode = `\
import BootstrapTable from 'react-bootstrap-table-ng';
import cellEditFactory from 'react-bootstrap-table-ng-editor';
// ...

const RemoteCellEdit = (props) => {
  const cellEdit = {
    mode: 'click',
    errorMessage: props.errorMessage
  };

  return (
    <div>
      <BootstrapTable
        remote={ { cellEdit: true } }
        keyField="id"
        data={ props.data }
        columns={ columns }
        cellEdit={ cellEditFactory(cellEdit) }
        onTableChange={ props.onTableChange }
      />
      <Code>{ sourceCode }</Code>
    </div>
  );
};

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: products,
      errorMessage: null
    };
  }

  handleTableChange = (type, { data, cellEdit: { rowId, dataField, newValue } }) => {
    setTimeout(() => {
      if (newValue === 'test' && dataField === 'name') {
        this.setState(() => ({
          data,
          errorMessage: 'Oops, product name shouldn't be "test"'
        }));
      } else {
        const result = data.map((row) => {
          if (row.id === rowId) {
            const newRow = { ...row };
            newRow[dataField] = newValue;
            return newRow;
          }
          return row;
        });
        this.setState(() => ({
          data: result,
          errorMessage: null
        }));
      }
    }, 2000);
  }

  render() {
    return (
      <RemoteCellEdit
        data={ this.state.data }
        errorMessage={ this.state.errorMessage }
        onTableChange={ this.handleTableChange }
      />
    );
  }
}
`;

interface RemoteCellEditProps {
  data: any[];
  onTableChange: (type: any, context: any) => void;
  errorMessage: string;
  loading: boolean;
}

const remoteCellEditOverlay = overlayFactory({ spinner: true });

const RemoteCellEdit = (props: RemoteCellEditProps) => {
  const cellEdit = {
    mode: "click",
    errorMessage: props.errorMessage,
  };

  return (
    <div>
      <BootstrapTable
        remote={{ cellEdit: true }}
        keyField="id"
        data={props.data}
        columns={[
          {
            dataField: "id",
            text: "Product ID",
          },
          {
            dataField: "name",
            text: "Product Name",
          },
          {
            dataField: "price",
            text: "Product Price",
          },
        ]}
        cellEdit={cellEditFactory(cellEdit)}
        onTableChange={props.onTableChange}
        overlay={remoteCellEditOverlay}
        loading={props.loading}
      />
      <Code>{remoteCellEditSourceCode}</Code>
    </div>
  );
};


interface RemoteCellEditState {
  data: any;
  errorMessage: string;
  loading: boolean;
}

class RemoteCellEditComponent extends React.Component<{}, RemoteCellEditState> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: productsGenerator(),
      errorMessage: "",
      loading: false,
    };
  }

  handleTableChange = (
    type: any,
    { data, cellEdit: { rowId, dataField, newValue } }: any
  ) => {
    this.setState({ loading: true });
    setTimeout(() => {
      if (newValue === "test" && dataField === "name") {
        this.setState(() => ({
          data,
          errorMessage: 'Oops, product name shouldn\'t be "test"',
        }));
      } else {
        const result = data.map((row: any) => {
          if (row.id === rowId) {
            const newRow = { ...row };
            newRow[dataField] = newValue;
            return newRow;
          }
          return row;
        });
        this.setState(() => ({
          data: result,
          errorMessage: "",
          loading: false,
        }));
      }
    }, 2000);
  };

  render() {
    return (
      <RemoteCellEdit
        data={this.state.data}
        errorMessage={this.state.errorMessage}
        onTableChange={this.handleTableChange}
        loading={this.state.loading}
      />
    );
  }
}

const remoteAllSourceCode = `\
import BootstrapTable from 'react-bootstrap-table-ng';
import paginationFactory from 'react-bootstrap-table-ng-paginator';
import cellEditFactory from 'react-bootstrap-table-ng-editor';
import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table-ng-filter';
// ...

const columns = [{
  dataField: 'id',
  text: 'Product ID',
  sort: true
}, {
  dataField: 'name',
  text: 'Product Name',
  filter: textFilter({
    defaultValue: '8'
  }),
  sort: true
}, {
  dataField: 'price',
  text: 'Product Price',
  filter: textFilter(),
  sort: true
}];

const defaultSorted = [{
  dataField: 'name',
  order: 'desc'
}];

const cellEditProps = {
  mode: 'click'
};

const RemoteAll = ({ data, page, sizePerPage, onTableChange, totalSize }) => (
  <div>
    <BootstrapTable
      remote
      keyField="id"
      data={ data }
      columns={ columns }
      defaultSorted={ defaultSorted }
      filter={ filterFactory() }
      pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
      cellEdit={ cellEditFactory(cellEditProps) }
      onTableChange={ onTableChange }
    />
    <Code>{ sourceCode }</Code>
  </div>
);


class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      data: products.slice(0, 10),
      totalSize: products.length,
      sizePerPage: 10
    };
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  handleTableChange = (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) => {
    const currentIndex = (page - 1) * sizePerPage;
    setTimeout(() => {
      // Handle cell editing
      if (type === 'cellEdit') {
        const { rowId, dataField, newValue } = cellEdit;
        products = products.map((row) => {
          if (row.id === rowId) {
            const newRow = { ...row };
            newRow[dataField] = newValue;
            return newRow;
          }
          return row;
        });
      }
      let result = products;

      // Handle column filters
      result = result.filter((row) => {
        let valid = true;
        for (const dataField in filters) {
          const { filterVal, filterType, comparator } = filters[dataField];

          if (filterType === 'TEXT') {
            if (comparator === Comparator.LIKE) {
              valid = row[dataField].toString().indexOf(filterVal) > -1;
            } else {
              valid = row[dataField] === filterVal;
            }
          }
          if (!valid) break;
        }
        return valid;
      });
      // Handle column sort
      if (sortOrder === 'asc') {
        result = result.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return 1;
          } else if (b[sortField] > a[sortField]) {
            return -1;
          }
          return 0;
        });
      } else {
        result = result.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (b[sortField] > a[sortField]) {
            return 1;
          }
          return 0;
        });
      }
      this.setState(() => ({
        page,
        data: result.slice(currentIndex, currentIndex + sizePerPage),
        totalSize: result.length,
        sizePerPage
      }));
    }, 2000);
  }

  render() {
    const { data, sizePerPage, page } = this.state;
    return (
      <RemoteAll
        data={ data }
        page={ page }
        sizePerPage={ sizePerPage }
        totalSize={ this.state.totalSize }
        onTableChange={ this.handleTableChange }
      />
    );
  }
}
`;

const remoteAllColumns = [
  {
    dataField: "id",
    text: "Product ID",
    sort: true,
  },
  {
    dataField: "name",
    text: "Product Name",
    filter: textFilter({
      defaultValue: "8",
    }),
    sort: true,
  },
  {
    dataField: "price",
    text: "Product Price",
    filter: textFilter(),
    sort: true,
  },
];

const remoteAllDefaultSorted = [{ dataField: "name", order: "desc" }];
const remoteAllFilter = filterFactory();
const remoteAllOverlay = overlayFactory({ spinner: true });
const remoteAllCellEdit = cellEditFactory({ mode: "click" });

interface RemoteAllProps {
  data: any[];
  page: number;
  totalSize: number;
  sizePerPage: number;
  onTableChange: (type: any, context: any) => void;
  loading: boolean;
}

const RemoteAll = ({
  data,
  page,
  sizePerPage,
  onTableChange,
  totalSize,
  loading,
}: RemoteAllProps) => (
  <div>
    <h3>
      When <code>remote.pagination</code> is enabled, the filtering, sorting and
      searching will also change to remote mode automatically
    </h3>
    <BootstrapTable
      remote
      keyField="id"
      loading={loading}
      overlay={remoteAllOverlay}
      data={data}
      columns={remoteAllColumns}
      defaultSorted={remoteAllDefaultSorted}
      filter={remoteAllFilter}
      pagination={paginationFactory({ page, sizePerPage, totalSize })}
      onTableChange={onTableChange}
      cellEdit={remoteAllCellEdit}
    />
    <Code>{remoteAllSourceCode}</Code>
  </div>
);

let products = productsGenerator(87);

interface RemoteAllState {
  data: any;
  sizePerPage: number;
  page: number;
  totalSize: number;
  loading: boolean;
}

class RemoteAllComponent extends React.Component<{}, RemoteAllState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      data: products.slice(0, 10),
      totalSize: products.length,
      sizePerPage: 10,
      loading: false,
    };
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  handleTableChange = (
    type: any,
    { page, sizePerPage, filters, sortField, sortOrder, cellEdit }: any
  ) => {
    const currentIndex = (page - 1) * sizePerPage;
    this.setState({ loading: true });
    setTimeout(() => {
      // Handle cell editing
      if (type === "cellEdit") {
        const { rowId, dataField, newValue } = cellEdit;
        products = products.map((row: any) => {
          if (row.id === rowId) {
            const newRow = { ...row };
            newRow[dataField] = newValue;
            return newRow;
          }
          return row;
        });
      }
      let result = products;
      // Handle column filters
      result = result.filter((row: any) => {
        let valid = true;
        for (const dataField in filters) {
          const { filterVal, filterType, comparator } = filters[dataField];

          if (filterType === "TEXT") {
            if (comparator === LIKE) {
              valid = row[dataField].toString().indexOf(filterVal) > -1;
            } else {
              valid = row[dataField] === filterVal;
            }
          }
          if (!valid) break;
        }
        return valid;
      });
      // Handle column sort
      if (sortOrder === "asc") {
        result = result.sort((a: any, b: any) => {
          if (a[sortField] > b[sortField]) {
            return 1;
          } else if (b[sortField] > a[sortField]) {
            return -1;
          }
          return 0;
        });
      } else {
        result = result.sort((a: any, b: any) => {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (b[sortField] > a[sortField]) {
            return 1;
          }
          return 0;
        });
      }
      this.setState(() => ({
        page,
        data: result.slice(currentIndex, currentIndex + sizePerPage),
        totalSize: result.length,
        sizePerPage,
        loading: false,
      }));
    }, 2000);
  };

  render() {
    const { data, sizePerPage, page, loading } = this.state;
    return (
      <RemoteAll
        data={data}
        page={page}
        sizePerPage={sizePerPage}
        totalSize={this.state.totalSize}
        onTableChange={this.handleTableChange}
        loading={loading}
      />
    );
  }
}


const remoteAllExportSourceCode = `\
import BootstrapTable from 'react-bootstrap-table-ng';
import cellEditFactory from 'react-bootstrap-table-ng-editor';
import filterFactory, {
  LIKE,
  textFilter,
} from 'react-bootstrap-table-ng-filter';
import paginationFactory, { 
  PaginationProvider, PaginationListStandalone, PaginationTotalStandalone, SizePerPageDropdownStandalone
} from 'react-bootstrap-table-ng-paginator';
import ToolkitProvider, {
  Search, CSVExport 
} from 'react-bootstrap-table-ng-toolkit';
// import ... 

const productColumns = [
  {
    dataField: "id",
    text: "Product ID",
    sort: true,
  },
  {
    dataField: "name",
    text: "Product Name",
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: "price",
    text: "Product Price",
    filter: textFilter(),
    sort: true,
    hidden: true,
  },
];

const { ExportCSVButton } = CSVExport;

//leslint-disable-next-line react/proprtypes
const CustomToggleList = ({ columns, onColumnToggle, toggles }) => (
  <div className="btn-group btn-group-toggle" data-toggle="buttons" style={{ marginBottom: '10px' }}>
    {columns
      .filter(column => !(column.toggleHidden === true))
      .map(column => ({
        ...column,
        toggle: toggles[column.dataField]
      }))
      .map(column => (
        <button
          type="button"
          key={column.dataField}
          className={\`btn \${column.toggle ? 'btn-primary' : 'btn-default'}\`}
          data-toggle="button"
          aria-pressed={column.toggle ? 'true' : 'false'}
          onClick={() => onColumnToggle(column.dataField)}
        >
          {column.text}
        </button>
      ))}
  </div>
);

const customPaginationTotal = (from: number, to: number, totalSize: number) => (
  <span className="react-bootstrap-table-pagination-total">
    {from} to {to} of {totalSize} rows
  </span>
);


const remoteAllExportFilter = filterFactory();
const remoteAllExportOverlay = overlayFactory({ spinner: true });
const remoteAllExportCellEdit = cellEditFactory({ mode: "click" });
const remoteAllExportDefaultSorted = [{ dataField: "name", order: "desc" }];

class RemoteAllExportComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      data: allExportProducts.slice(0, 10),
      totalSize: allExportProducts.length,
      sizePerPage: 10,
      allData: allExportProducts,
      loading: false,
    };
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  handleTableChange = (
    type: any,
    { page, sizePerPage, filters, sortField, sortOrder, cellEdit }: any
  ) => {
    this.setState({ loading: true });
    setTimeout(() => {
      // Handle cell editing
      if (type === "cellEdit") {
        const { rowId, dataField, newValue } = cellEdit;
        allExportProducts = allExportProducts.map((row: any) => {
          if (row.id === rowId) {
            const newRow = { ...row };
            newRow[dataField] = newValue;
            return newRow;
          }
          return row;
        });
      }
      let result = allExportProducts;
      // Handle column filters
      result = result.filter((row: any) => {
        let valid = true;
        for (const dataField in filters) {
          const { filterVal, filterType, comparator } = filters[dataField];

          if (filterType === "TEXT") {
            if (comparator === LIKE) {
              valid = row[dataField].toString().indexOf(filterVal) > -1;
            } else {
              valid = row[dataField] === filterVal;
            }
          }
          if (!valid) break;
        }
        return valid;
      });
      // Handle column sort
      if (sortOrder === "asc") {
        result = result.sort((a: any, b: any) => {
          if (a[sortField] > b[sortField]) {
            return 1;
          } else if (b[sortField] > a[sortField]) {
            return -1;
          }
          return 0;
        });
      } else {
        result = result.sort((a: any, b: any) => {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (b[sortField] > a[sortField]) {
            return 1;
          }
          return 0;
        });
      }
      this.setState(() => ({
        page: page,
        data: result.slice((page - 1) * sizePerPage, page * sizePerPage),
        totalSize: result.length,
        sizePerPage: sizePerPage,
        allData: result,
        loading: false,
      }));
    }, 2000);
  };

  handleExport = (onExport: any) => (e: any) => {
    onExport((this.state as any).allData);
  };

  render() {
    return (
      <ToolkitProvider
        keyField="id"
        data={this.state.data}
        columns={productColumns}
        search
        columnToggle
        columnResize
        bootstrap5
        exportCSV={{
          fileName: 'products-export.csv',
          noAutoBOM: false,
          blobType: 'text/csv;charset=ansi',
          data: this.state.allData
        }}
      >
        {props => (
          <PaginationProvider
            isRemotePagination={() => true}
            data={this.state.data}
            remoteEmitter={((this as any).remoteEmitter || {})}
            pagination={paginationFactory({
              custom: true,
              page: this.state.page,
              sizePerPage: this.state.sizePerPage,
              totalSize: this.state.totalSize,
              sizePerPageList: [10, 25, 50, 100],
              showSizePerPage: true,
              showTotal: true,
              paginationTotalRenderer: customPaginationTotal,
            })}
          >
            {({ paginationProps, paginationTableProps }) => (
              <div>
                <CustomToggleList {...props.columnToggleProps} />
                <div>
                  <SizePerPageDropdownStandalone {...paginationProps} />
                  <PaginationTotalStandalone {...paginationProps} />
                  <ExportCSVButton {...props.csvProps}
                    className="btn-warning"
                    style={{ marginLeft: '20px' }}
                    onClick={this.handleExport(props.csvProps.onExport)}
                  >Export CSV</ExportCSVButton>
                  <PaginationListStandalone {...paginationProps} />
                </div>
                <BootstrapTable
                  {...props.baseProps}
                  remote
                  striped
                  hover
                  condensed
                  keyField="id"
                  data={this.state.data}
                  columns={productColumns}
                  defaultSorted={remoteAllExportDefaultSorted}
                  filter={remoteAllExportFilter}
                  overlay={remoteAllExportOverlay}
                  onTableChange={this.handleTableChange}
                  cellEdit={remoteAllExportCellEdit}
                  loading={this.state.loading}
                  {...paginationTableProps}
                />
                <div style={{ marginBottom: '20px' }}>
                  <SizePerPageDropdownStandalone {...paginationProps} />
                  <PaginationTotalStandalone {...paginationProps} />
                  <ExportCSVButton {...props.csvProps}
                    className="btn-warning"
                    style={{ marginLeft: '20px' }}
                    onClick={this.handleExport(props.csvProps.onExport)}
                  >Export CSV</ExportCSVButton>
                  <PaginationListStandalone {...paginationProps} />
                </div>
                <Code>{remoteAllExportSourceCode}</Code>
              </div>
            )}
          </PaginationProvider>
        )}
      </ToolkitProvider>
    );
  }
}
`;

const productColumns = [
  {
    dataField: "id",
    text: "Product ID",
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: "name",
    text: "Product Name",
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: "price",
    text: "Product Price",
    filter: textFilter(),
    sort: true,
    hidden: true,
  },
];

const { ExportCSVButton } = CSVExport;

//leslint-disable-next-line react/proprtypes
interface CustomToggleListProps {
  columns: any[];
  onColumnToggle: (dataField: string) => void;
  toggles: any;
}

const CustomToggleList = ({
  columns,
  onColumnToggle,
  toggles,
}: CustomToggleListProps) => (

  <div className="btn-group btn-group-toggle" data-toggle="buttons" style={{ marginBottom: '10px' }}>
    {columns
      .filter(column => !(column.toggleHidden === true))
      .map(column => ({
        ...column,
        toggle: toggles[column.dataField]
      }))
      .map(column => (
        <button
          type="button"
          key={column.dataField}
          className={`btn ${column.toggle ? 'btn-primary' : 'btn-default'}`}
          data-toggle="button"
          aria-pressed={column.toggle ? 'true' : 'false'}
          onClick={() => onColumnToggle(column.dataField)}
        >
          {column.text}
        </button>
      ))}
  </div>
);

const customPaginationTotal = (from: number, to: number, totalSize: number) => (
  <span className="react-bootstrap-table-pagination-total" style={{ marginLeft: '10px' }}>
    {from} to {to} of {totalSize} rows
  </span>
);


let allExportProducts = productsGenerator(487);

const remoteAllCustomFilter = filterFactory();

const remoteAllCustomOverlay = overlayFactory({ spinner: true });
const remoteAllCustomCellEdit = cellEditFactory({ mode: "click" });
const remoteAllCustomDefaultSorted = [{ dataField: "name", order: "desc" }];
const remoteAllCustomPaginationOptions = {
  custom: true,
  sizePerPageList: [10, 25, 50, 100],
  showSizePerPage: true,
  showTotal: true,
  paginationTotalRenderer: customPaginationTotal,
};

const remoteAllCustomExportCSVOptions = {
  fileName: "products-export.csv",
  noAutoBOM: false,
  blobType: "text/csv;charset=ansi",
};

interface RemoteAllCustomState {
  page: number;
  data: any[];
  totalSize: number;
  sizePerPage: number;
  allData: any[];
  loading: boolean;
  searchText?: string;
  filters: any;
  sortField: string;
  sortOrder: string;
}

class RemoteAllCustomComponent extends React.Component<{}, RemoteAllCustomState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      data: allExportProducts.slice(0, 10),
      totalSize: allExportProducts.length,
      sizePerPage: 10,
      allData: allExportProducts,
      loading: false,
      searchText: '',
      filters: {},
      sortField: 'name',
      sortOrder: 'desc',
    };
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  handleTableChange = (
    type: any,
    { page, sizePerPage, filters, sortField, sortOrder, cellEdit, searchText }: any
  ) => {
    if (type === "search" && searchText === this.state.searchText) {
      return;
    }

    console.log('RemoteAllCustom.handleTableChange START', { type, page, sizePerPage, filters, searchText, sortField, sortOrder });
    
    this.setState((prevState) => {
      const newState: any = {
        loading: true,
        page: page || prevState.page,
        sizePerPage: sizePerPage || prevState.sizePerPage,
      };

      if (typeof searchText !== 'undefined') newState.searchText = searchText;

      if (type === 'filter') {
        newState.filters = filters || {};
      } else {
        newState.filters = (filters && Object.keys(filters).length > 0) ? filters : prevState.filters;
      }

      if (sortField) newState.sortField = sortField;
      if (sortOrder) newState.sortOrder = sortOrder;

      return newState;
    });

    setTimeout(() => {
      const { 
        filters: stateFilters, 
        sortField: stateSortField, 
        sortOrder: stateSortOrder, 
        searchText: stateSearchText,
        page: statePage,
        sizePerPage: stateSizePerPage
      } = this.state;

      // Handle cell editing
      if (type === "cellEdit") {
        const { rowId, dataField, newValue } = cellEdit;
        allExportProducts = allExportProducts.map((row: any) => {
          if (row.id === rowId) {
            const newRow = { ...row };
            newRow[dataField] = newValue;
            return newRow;
          }
          return row;
        });
      }

      let result = allExportProducts;

      // Handle search
      if (stateSearchText) {
        result = result.filter((row: any) => {
          for (let cidx = 0; cidx < productColumns.length; cidx += 1) {
            const column = productColumns[cidx];
            let targetValue = row[column.dataField];
            if (targetValue !== null && typeof targetValue !== "undefined") {
              targetValue = targetValue.toString().toLowerCase();
              if (targetValue.indexOf(stateSearchText.toLowerCase()) > -1) {
                return true;
              }
            }
          }
          return false;
        });
      }

      // Handle column filters
      result = result.filter((row: any) => {
        let valid = true;
        for (const dataField in stateFilters) {
          const { filterVal, filterType, comparator } = stateFilters[dataField];

          if (filterType === "TEXT" || !filterType) {
            if (comparator === LIKE) {
              valid = row[dataField].toString().indexOf(filterVal) > -1;
            } else {
              valid = row[dataField] === filterVal;
            }
          }
          if (!valid) break;
        }
        return valid;
      });

      // Handle column sort
      const currentSortField = stateSortField;
      const currentSortOrder = stateSortOrder;

      if (currentSortField && currentSortOrder) {
        result = result.sort((a: any, b: any) => {
          if (a[currentSortField] > b[currentSortField]) {
            return currentSortOrder === "asc" ? 1 : -1;
          } else if (b[currentSortField] > a[currentSortField]) {
            return currentSortOrder === "asc" ? -1 : 1;
          }
          return 0;
        });
      }

      console.log('RemoteAllCustom.handleTableChange END', { resultSize: result.length });

      this.setState(() => ({
        page: statePage * stateSizePerPage < result.length ? statePage : Math.ceil(result.length / stateSizePerPage),
        data: result.slice((statePage - 1) * stateSizePerPage, statePage * stateSizePerPage),
        totalSize: result.length,
        sizePerPage: stateSizePerPage,
        allData: result,
        loading: false,
      }));
    }, 2000);
  };

  handleExport = onExport => e => {
    onExport(this.state.allData);
  };

  render() {
    const { data, allData, page, sizePerPage, totalSize, loading } = this.state;
    return (
      <ToolkitProvider
        keyField="id"
        data={data}
        columns={productColumns}
        search
        columnToggle
        columnResize
        bootstrap5
        exportCSV={{
          ...remoteAllCustomExportCSVOptions,
          data: allData,
        }}
      >
        {(props: any) => (
          <PaginationProvider
            isRemotePagination={() => true}
            data={this.state.data}
            remoteEmitter={((this as any).remoteEmitter || {})}
            pagination={paginationFactory({
              ...remoteAllCustomPaginationOptions,
              page,
              sizePerPage,
              totalSize,
            })}
          >
            {({
              paginationProps,
              paginationTableProps,
            }: {
              paginationProps: any;
              paginationTableProps: any;
            }) => (
              <div>
                <CustomToggleList {...props.columnToggleProps} />
                <div>
                  <SizePerPageDropdownStandalone {...paginationProps} />
                  <PaginationTotalStandalone {...paginationProps} />
                  <ExportCSVButton
                    {...props.csvProps}
                    className="btn-warning"
                    style={{ marginLeft: "20px" }}
                    onClick={this.handleExport(props.csvProps.onExport)}
                  >
                    Export CSV
                  </ExportCSVButton>
                  <PaginationListStandalone {...paginationProps} />
                </div>
                <BootstrapTable
                  {...props.baseProps}
                  remote
                  striped
                  hover
                  condensed
                  keyField="id"
                  data={data}
                  columns={productColumns}
                  defaultSorted={remoteAllCustomDefaultSorted}
                  filter={remoteAllCustomFilter}
                  {...paginationTableProps}
                  onTableChange={this.handleTableChange}
                  loading={loading}
                  overlay={remoteAllCustomOverlay}
                  cellEdit={remoteAllCustomCellEdit}
                />
                <div style={{ marginBottom: "20px" }}>
                  <SizePerPageDropdownStandalone {...paginationProps} />
                  <PaginationTotalStandalone {...paginationProps} />
                  <ExportCSVButton
                    {...props.csvProps}
                    className="btn-warning"
                    style={{ marginLeft: "20px" }}
                    onClick={this.handleExport(props.csvProps.onExport)}
                  >
                    Export CSV
                  </ExportCSVButton>
                  <PaginationListStandalone {...paginationProps} />
                </div>
                <Code>{remoteAllExportSourceCode}</Code>
              </div>
            )}
          </PaginationProvider>
        )}
      </ToolkitProvider>
    );
  }
}

interface RemoteMainProps {
  mode?: any;
}

export default ({ mode }: RemoteMainProps) => {
  switch (mode) {
    case "sort":
      return <RemoteSortComponent />;
    case "filter":
      return <RemoteFilterComponent />;
    case "pagination":
      return <RemotePaginationComponent />;
    case "search":
      return <RemoteSearchComponent />;
    case "edit":
      return <RemoteCellEditComponent />;
    case "all":
      return <RemoteAllComponent />;
    case "all-custom":
      return <RemoteAllCustomComponent />;
  }
};
