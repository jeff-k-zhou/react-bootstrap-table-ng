/* eslint-disable import/no-anonymous-default-export */

import React from "react";

import BootstrapTable from "../../../react-bootstrap-table-ng";
import overlayFactory from "../../../react-bootstrap-table-ng-overlay";
import paginationFactory from "../../../react-bootstrap-table-ng-paginator";

import Code from "../components/common/code-block";

import "../../../react-bootstrap-table-ng-filter/style/react-bootstrap-table-ng-filter.scss";
import "../../../react-bootstrap-table-ng-paginator/style/react-bootstrap-table-ng-paginator.scss";
import "../../../react-bootstrap-table-ng-toolkit/style/react-bootstrap-table-ng-toolkit.scss";
import "../../../react-bootstrap-table-ng/style/react-bootstrap-table-ng.scss";
import { productsGenerator } from "../utils/common";
import "./stylesheet/storybook.scss";
import "./stylesheet/tomorrow.min.css";

const NoDataIndication = () => (
  <div className="spinner">
    <div className="rect1" />
    <div className="rect2" />
    <div className="rect3" />
    <div className="rect4" />
    <div className="rect5" />
  </div>
);

const emptyTableOverlaySourceCode = `\
import BootstrapTable from 'react-bootstrap-table-ng';
import paginationFactory from 'react-bootstrap-table-ng-paginator';

// ...
const NoDataIndication = () => (
  <div className="spinner">
    <div className="rect1" />
    <div className="rect2" />
    <div className="rect3" />
    <div className="rect4" />
    <div className="rect5" />
  </div>
);

const Table = ({ data, page, sizePerPage, onTableChange, totalSize }) => (
  <div>
    <BootstrapTable
      remote
      keyField="id"
      data={ data }
      columns={ columns }
      pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
      onTableChange={ onTableChange }
      noDataIndication={ () => <NoDataIndication /> }
    />
    <Code>{ sourceCode }</Code>
  </div>
);

class EmptyTableOverlay extends React.Component {
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
    }, 3000);
    this.setState(() => ({ data: [] }));
  }

  render() {
    const { data, sizePerPage, page } = this.state;
    return (
      <Table
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

interface TableProps {
  data: any[];
  page: number;
  totalSize: number;
  sizePerPage: number;
  onTableChange: (type: any, context: any) => void;
}

const Table = ({
  data,
  page,
  sizePerPage,
  onTableChange,
  totalSize,
}: TableProps) => (
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
      noDataIndication={() => <NoDataIndication />}
    />
    <Code>{emptyTableOverlaySourceCode}</Code>
  </div>
);


interface EmptyTableOverlayState {
  data: any;
  sizePerPage: number;
  page: any;
}

class EmptyTableOverlay extends React.Component<{}, EmptyTableOverlayState> {
  products = productsGenerator(87);

  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      data: this.products.slice(0, 10),
      sizePerPage: 10,
    };
  }

  handleTableChange = (type: any, { page, sizePerPage }: any) => {
    const currentIndex = (page - 1) * sizePerPage;
    setTimeout(() => {
      this.setState(() => ({
        page,
        data: this.products.slice(currentIndex, currentIndex + sizePerPage),
        sizePerPage,
      }));
    }, 3000);
    this.setState(() => ({ data: [] }));
  };

  render() {
    const { data, sizePerPage, page } = this.state;
    return (
      <Table
        data={data}
        page={page}
        sizePerPage={sizePerPage}
        totalSize={this.products.length}
        onTableChange={this.handleTableChange}
      />
    );
  }
}

const tableOverlaySourceCode = `\
import BootstrapTable from 'react-bootstrap-table-ng';
import paginationFactory from 'react-bootstrap-table-ng-paginator';
import overlayFactory from 'react-bootstrap-table-ng-overlay';

// ...
const RemotePagination = ({ loading, data, page, sizePerPage, onTableChange, totalSize }) => (
  <div>
    <BootstrapTable
      remote
      loading={ loading }
      keyField="id"
      data={ data }
      columns={ columns }
      pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
      onTableChange={ onTableChange }
      overlay={ overlayFactory({ spinner: true, styles: { overlay: (base) => ({...base, background: 'rgba(255, 0, 0, 0.5)'}) } }) }
    />
    <Code>{ sourceCode }</Code>
  </div>
);

interface RemotePaginationProps {
  data: any[];
  page: number;
  loading: boolean;
  totalSize: number;
  sizePerPage: number;
  onTableChange: (type: any, context: any) => void;
}

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      loading: false,
      data: products.slice(0, 10),
      sizePerPage: 10
    };
  }

  handleTableChange = ({ page, sizePerPage }) => {
    const currentIndex = (page - 1) * sizePerPage;
    setTimeout(() => {
      this.setState(() => ({
        page,
        loading: false,
        data: products.slice(currentIndex, currentIndex + sizePerPage),
        sizePerPage
      }));
    }, 3000);
    this.setState(() => ({ loading: true }));
  }

  render() {
    const { data, sizePerPage, page, loading } = this.state;
    return (
      <RemotePagination
        data={ data }
        page={ page }
        loading={ loading }
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
  loading: boolean;
  totalSize: number;
  sizePerPage: number;
  onTableChange: (type: any, context: any) => void;
}

const RemotePagination = ({
  loading,
  data,
  page,
  sizePerPage,
  onTableChange,
  totalSize,
}: RemotePaginationProps) => (
  <div>
    <BootstrapTable
      remote
      loading={loading}
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
      overlay={overlayFactory({
        spinner: true,
        styles: {
          overlay: (base: any) => ({
            ...base,
            background: "rgba(255, 0, 0, 0.5)",
          }),
        },
      })}
    />
    <Code>{tableOverlaySourceCode}</Code>
  </div>
);


interface TableOverlayState {
  data: any;
  sizePerPage: number;
  page: any;
  loading: boolean;
}

class TableOverlay extends React.Component<{}, TableOverlayState> {
  products = productsGenerator(87);

  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      loading: false,
      data: this.products.slice(0, 10),
      sizePerPage: 10,
    };
  }

  handleTableChange = (type: any, { page, sizePerPage }: any) => {
    const currentIndex = (page - 1) * sizePerPage;
    setTimeout(() => {
      this.setState(() => ({
        page,
        loading: false,
        data: this.products.slice(currentIndex, currentIndex + sizePerPage),
        sizePerPage,
      }));
    }, 3000);
    this.setState(() => ({ loading: true }));
  };

  render() {
    const { data, sizePerPage, page, loading } = this.state;
    return (
      <RemotePagination
        data={data}
        page={page}
        loading={loading}
        sizePerPage={sizePerPage}
        totalSize={this.products.length}
        onTableChange={this.handleTableChange}
      />
    );
  }
}

interface TableOverlayMainProps {
  mode?: any;
}

export default ({ mode }: TableOverlayMainProps) => {
  switch (mode) {
    case "empty":
      return <EmptyTableOverlay />;
    default:
      return <TableOverlay />;
  }
};
