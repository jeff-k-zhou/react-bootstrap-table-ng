/* eslint-disable import/no-anonymous-default-export */

import React, { useState } from "react";

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

const EmptyTableOverlay = () => {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState(products.slice(0, 10));
  const [sizePerPage, setSizePerPage] = React.useState(10);

  const handleTableChange = (type, { page: newPage, sizePerPage: newSizePerPage }) => {
    const currentIndex = (newPage - 1) * newSizePerPage;
    setData([]);
    setTimeout(() => {
      setPage(newPage);
      setData(products.slice(currentIndex, currentIndex + newSizePerPage));
      setSizePerPage(newSizePerPage);
    }, 3000);
  };

  return (
    <Table
      data={ data }
      page={ page }
      sizePerPage={ sizePerPage }
      totalSize={ products.length }
      onTableChange={ handleTableChange }
    />
  );
};
`;

interface TableProps {
  data: any[];
  page: number;
  loading: boolean;
  totalSize: number;
  sizePerPage: number;
  onTableChange: (type: any, context: any) => void;
}

const Table = ({
  data,
  page,
  loading,
  sizePerPage,
  onTableChange,
  totalSize,
}: TableProps) => (
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
      overlay={overlayFactory({ spinner: true })}
      noDataIndication={() => <NoDataIndication />}
    />
    <Code>{emptyTableOverlaySourceCode}</Code>
  </div>
);


const EmptyTableOverlay: React.FC = () => {
  const [products] = useState(() => productsGenerator(87));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>(products.slice(0, 10));
  const [sizePerPage, setSizePerPage] = useState(10);

  const handleTableChange = (type: any, { page: newPage, sizePerPage: newSizePerPage }: any) => {
    const currentIndex = (newPage - 1) * newSizePerPage;
    setData([]);
    setLoading(true);
    setTimeout(() => {
      setPage(newPage);
      setLoading(false);
      setData(products.slice(currentIndex, currentIndex + newSizePerPage));
      setSizePerPage(newSizePerPage);
    }, 3000);
  };

  return (
    <Table
      data={data}
      page={page}
      loading={loading}
      sizePerPage={sizePerPage}
      totalSize={products.length}
      onTableChange={handleTableChange}
    />
  );
};

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

const Container = () => {
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(products.slice(0, 10));
  const [sizePerPage, setSizePerPage] = React.useState(10);

  const handleTableChange = (type, { page: newPage, sizePerPage: newSizePerPage }) => {
    const currentIndex = (newPage - 1) * newSizePerPage;
    setLoading(true);
    setTimeout(() => {
      setPage(newPage);
      setLoading(false);
      setData(products.slice(currentIndex, currentIndex + newSizePerPage));
      setSizePerPage(newSizePerPage);
    }, 3000);
  };

  return (
    <RemotePagination
      data={ data }
      page={ page }
      loading={ loading }
      sizePerPage={ sizePerPage }
      totalSize={ products.length }
      onTableChange={ handleTableChange }
    />
  );
};
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


const TableOverlay: React.FC = () => {
  const [products] = useState(() => productsGenerator(87));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>(products.slice(0, 10));
  const [sizePerPage, setSizePerPage] = useState(10);

  const handleTableChange = (type: any, { page: newPage, sizePerPage: newSizePerPage }: any) => {
    const currentIndex = (newPage - 1) * newSizePerPage;
    setLoading(true);
    setTimeout(() => {
      setPage(newPage);
      setLoading(false);
      setData(products.slice(currentIndex, currentIndex + newSizePerPage));
      setSizePerPage(newSizePerPage);
    }, 3000);
  };

  return (
    <RemotePagination
      data={data}
      page={page}
      loading={loading}
      sizePerPage={sizePerPage}
      totalSize={products.length}
      onTableChange={handleTableChange}
    />
  );
};

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
