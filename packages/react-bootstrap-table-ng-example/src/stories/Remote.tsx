
import React, { useState, useRef } from "react";

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

const Container = () => {
  const [data, setData] = React.useState(products);

  const handleTableChange = (type, { sortField, sortOrder, data: tableData }) => {
    setTimeout(() => {
      let result;
      if (sortOrder === 'asc') {
        result = tableData.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return 1;
          } else if (b[sortField] > a[sortField]) {
            return -1;
          }
          return 0;
        });
      } else {
        result = tableData.sort((a, b) => {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (b[sortField] > a[sortField]) {
            return 1;
          }
          return 0;
        });
      }
      setData([...result]);
    }, 2000);
  };

  return (
    <RemoteSort
      data={ data }
      onTableChange={ handleTableChange }
    />
  );
};
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

const RemoteSortComponent: React.FC = () => {
  const products = productsGenerator(5);
  const [data, setData] = useState<any[]>(products);
  const [loading, setLoading] = useState(false);

  const handleTableChange = (type: any, { sortField, sortOrder, data: currentData }: any) => {
    setLoading(true);
    setTimeout(() => {
      let result: any;
      if (sortOrder === "asc") {
        result = currentData.sort((a: any, b: any) => {
          if (a[sortField] > b[sortField]) {
            return 1;
          } else if (b[sortField] > a[sortField]) {
            return -1;
          }
          return 0;
        });
      } else {
        result = currentData.sort((a: any, b: any) => {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (b[sortField] > a[sortField]) {
            return 1;
          }
          return 0;
        });
      }
      setData(result);
      setLoading(false);
    }, 2000);
  };

  return (
    <RemoteSort
      data={data}
      onTableChange={handleTableChange}
      loading={loading}
    />
  );
};

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

const Container = () => {
  const [data, setData] = React.useState(products);

  const handleTableChange = (type, { filters }) => {
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
      setData(result);
    }, 2000);
  };

  return (
    <RemoteFilter
      data={ data }
      onTableChange={ handleTableChange }
    />
  );
};
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

const RemoteFilterComponent: React.FC = () => {
  const products = productsGenerator(17);
  const [data, setData] = useState<any[]>(products);
  const [loading, setLoading] = useState(false);

  const handleTableChange = (type: any, { filters }: any) => {
    setLoading(true);
    setTimeout(() => {
      const result = products.filter((row: any) => {
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
      setData(result);
      setLoading(false);
    }, 2000);
  };

  return (
    <RemoteFilter
      data={data}
      onTableChange={handleTableChange}
      loading={loading}
    />
  );
};

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

const Container = () => {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState(products.slice(0, 10));
  const [sizePerPage, setSizePerPage] = React.useState(10);

  const handleTableChange = (type, { page: newPage, sizePerPage: newSizePerPage }) => {
    const currentIndex = (newPage - 1) * newSizePerPage;
    setTimeout(() => {
      setPage(newPage);
      setData(products.slice(currentIndex, currentIndex + newSizePerPage));
      setSizePerPage(newSizePerPage);
    }, 2000);
  };

  return (
    <RemotePagination
      data={ data }
      page={ page }
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

const RemotePaginationComponent: React.FC = () => {
  const products = productsGenerator(87);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>(products.slice(0, 10));
  const [sizePerPage, setSizePerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleTableChange = (type: any, { page: newPage, sizePerPage: newSizePerPage }: any) => {
    const currentIndex = (newPage - 1) * newSizePerPage;
    setLoading(true);
    setTimeout(() => {
      setPage(newPage);
      setData(products.slice(currentIndex, currentIndex + newSizePerPage));
      setSizePerPage(newSizePerPage);
      setLoading(false);
    }, 2000);
  };

  return (
    <RemotePagination
      data={data}
      page={page}
      sizePerPage={sizePerPage}
      totalSize={products.length}
      onTableChange={handleTableChange}
      loading={loading}
    />
  );
};

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

const RemoteSearch = props => (
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

const Container = () => {
  const [data, setData] = React.useState(products);

  const handleTableChange = (type, { filters }) => {
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
      setData(result);
    }, 2000);
  };

  return (
    <RemoteSearch
      data={ data }
      onTableChange={ handleTableChange }
    />
  );
};
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
      {(toolkitprops: any) => (
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

const RemoteSearchComponent: React.FC = () => {
  const products = productsGenerator(17);
  const [data, setData] = useState<any[]>(products);
  const [loading, setLoading] = useState(false);

  const handleTableChange = (type: any, { searchText }: any) => {
    setLoading(true);
    setTimeout(() => {
      const result = products.filter((row: any) => {
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
      setData(result);
      setLoading(false);
    }, 2000);
  };

  return (
    <RemoteSearch
      data={data}
      onTableChange={handleTableChange}
      loading={loading}
    />
  );
};

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

const Container = () => {
  const [data, setData] = React.useState(products);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const handleTableChange = (type, { data: tableData, cellEdit: { rowId, dataField, newValue } }) => {
    setTimeout(() => {
      if (newValue === 'test' && dataField === 'name') {
        setData(tableData);
        setErrorMessage('Oops, product name shouldn\\'t be "test"');
      } else {
        const result = tableData.map((row) => {
          if (row.id === rowId) {
            const newRow = { ...row };
            newRow[dataField] = newValue;
            return newRow;
          }
          return row;
        });
        setData(result);
        setErrorMessage(null);
      }
    }, 2000);
  };

  return (
    <RemoteCellEdit
      data={ data }
      errorMessage={ errorMessage }
      onTableChange={ handleTableChange }
    />
  );
};
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

const RemoteCellEditComponent: React.FC = () => {
  const [data, setData] = useState<any[]>(productsGenerator());
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTableChange = (
    type: any,
    { data: currentData, cellEdit: { rowId, dataField, newValue } }: any
  ) => {
    setLoading(true);
    setTimeout(() => {
      if (newValue === "test" && dataField === "name") {
        setErrorMessage('Oops, product name shouldn\'t be "test"');
        setLoading(false);
      } else {
        const result = currentData.map((row: any) => {
          if (row.id === rowId) {
            const newRow = { ...row };
            newRow[dataField] = newValue;
            return newRow;
          }
          return row;
        });
        setData(result);
        setErrorMessage("");
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <RemoteCellEdit
      data={data}
      errorMessage={errorMessage}
      onTableChange={handleTableChange}
      loading={loading}
    />
  );
};

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

const Container = () => {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState(products.slice(0, 10));
  const [totalSize, setTotalSize] = React.useState(products.length);
  const [sizePerPage, setSizePerPage] = React.useState(10);

  const handleTableChange = (type, { page: newPage, sizePerPage: newSizePerPage, filters, sortField, sortOrder, cellEdit }) => {
    const currentIndex = (newPage - 1) * newSizePerPage;
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
      
      setPage(newPage);
      setData(result.slice(currentIndex, currentIndex + newSizePerPage));
      setTotalSize(result.length);
      setSizePerPage(newSizePerPage);
    }, 2000);
  };

  return (
    <RemoteAll
      data={ data }
      page={ page }
      sizePerPage={ sizePerPage }
      totalSize={ totalSize }
      onTableChange={ handleTableChange }
    />
  );
};
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

const RemoteAllComponent: React.FC = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>(products.slice(0, 10));
  const [totalSize, setTotalSize] = useState(products.length);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleTableChange = (
    type: any,
    { page: newPage, sizePerPage: newSizePerPage, filters, sortField, sortOrder, cellEdit }: any
  ) => {
    const currentIndex = (newPage - 1) * newSizePerPage;
    setLoading(true);
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
      
      setPage(newPage);
      setData(result.slice(currentIndex, currentIndex + newSizePerPage));
      setTotalSize(result.length);
      setSizePerPage(newSizePerPage);
      setLoading(false);
    }, 2000);
  };

  return (
    <RemoteAll
      data={data}
      page={page}
      sizePerPage={sizePerPage}
      totalSize={totalSize}
      onTableChange={handleTableChange}
      loading={loading}
    />
  );
};


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

const RemoteAllExportComponent = () => {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState(allExportProducts.slice(0, 10));
  const [totalSize, setTotalSize] = React.useState(allExportProducts.length);
  const [sizePerPage, setSizePerPage] = React.useState(10);
  const [allData, setAllData] = React.useState(allExportProducts);

  const handleTableChange = (type, { page: newPage, sizePerPage: newSizePerPage, filters, sortField, sortOrder, cellEdit }) => {
    setTimeout(() => {
      // Handle cell editing
      if (type === 'cellEdit') {
        const { rowId, dataField, newValue } = cellEdit;
        allExportProducts = allExportProducts.map((row) => {
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
      result = result.filter((row) => {
        let valid = true;
        for (const dataField in filters) {
          const { filterVal, filterType, comparator } = filters[dataField];

          if (filterType === 'TEXT') {
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

      setPage(newPage);
      setData(result.slice((newPage - 1) * newSizePerPage, newPage * newSizePerPage));
      setTotalSize(result.length);
      setSizePerPage(newSizePerPage);
      setAllData(result);
    }, 2000);
  };

  const handleExport = (onExport) => () => {
    onExport(allData);
  };

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
        fileName: 'products-export.csv',
        noAutoBOM: false,
        blobType: 'text/csv;charset=ansi',
        data: allData
      }}
    >
      {(props: any) => (
        <PaginationProvider
          isRemotePagination={() => true}
          data={data}
          remoteEmitter={{}}
          pagination={paginationFactory({
            custom: true,
            page: page,
            sizePerPage: sizePerPage,
            totalSize: totalSize,
            sizePerPageList: [10, 25, 50, 100],
            hideSizePerPage: false,
            showTotal: true,
            paginationTotalRenderer: customPaginationTotal,
          })}
        >
          {({ paginationProps, paginationTableProps }: any) => (
            <div>
              <CustomToggleList {...props.columnToggleProps} />
              <div>
                <SizePerPageDropdownStandalone {...paginationProps} />
                <PaginationTotalStandalone {...paginationProps} />
                <ExportCSVButton {...props.csvProps}
                  className="btn-warning"
                  style={{ marginLeft: '20px' }}
                  onClick={handleExport(props.csvProps.onExport)}
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
                data={data}
                columns={productColumns}
                defaultSorted={remoteAllExportDefaultSorted}
                filter={remoteAllExportFilter}
                overlay={remoteAllExportOverlay}
                onTableChange={handleTableChange}
                cellEdit={remoteAllExportCellEdit}
                loading={loading}
                {...paginationTableProps}
              />
              <div style={{ marginBottom: '20px' }}>
                <SizePerPageDropdownStandalone {...paginationProps} />
                <PaginationTotalStandalone {...paginationProps} />
                <ExportCSVButton {...props.csvProps}
                  className="btn-warning"
                  style={{ marginLeft: '20px' }}
                  onClick={handleExport(props.csvProps.onExport)}
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
};
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

const RemoteAllCustomComponent: React.FC = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>(allExportProducts.slice(0, 10));
  const [totalSize, setTotalSize] = useState(allExportProducts.length);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [allData, setAllData] = useState<any[]>(allExportProducts);
  const [loading, setLoading] = useState(false);
  
  const stateRef = useRef({
    page: 1,
    sizePerPage: 10,
    searchText: "",
    filters: {} as any,
    sortField: "name",
    sortOrder: "desc"
  });

  const handleTableChange = (
    type: any,
    { page: newPage, sizePerPage: newSizePerPage, filters: newFilters, sortField: newSortField, sortOrder: newSortOrder, cellEdit, searchText: newSearchText }: any
  ) => {
    if (type === "search" && newSearchText === stateRef.current.searchText) {
      return;
    }

    setLoading(true);
    
    // update refs so setTimeout can use latest values
    if (newPage) stateRef.current.page = newPage;
    if (newSizePerPage) stateRef.current.sizePerPage = newSizePerPage;
    if (typeof newSearchText !== 'undefined') stateRef.current.searchText = newSearchText;
    
    if (type === 'search') {
      stateRef.current.page = 1; // reset to page 1 on search change
    } else if (type === 'filter') {
      stateRef.current.filters = newFilters || {};
      stateRef.current.page = 1; // reset to page 1 on filter change
    } else {
      stateRef.current.filters = (newFilters && Object.keys(newFilters).length > 0) ? newFilters : stateRef.current.filters;
    }

    
  
    if (newSortField) stateRef.current.sortField = newSortField;
    if (newSortOrder) stateRef.current.sortOrder = newSortOrder;

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

      // Handle search
      if (stateRef.current.searchText) {
        result = result.filter((row: any) => {
          for (let cidx = 0; cidx < productColumns.length; cidx += 1) {
            const column = productColumns[cidx];
            let targetValue = row[column.dataField];
            if (targetValue !== null && typeof targetValue !== "undefined") {
              targetValue = targetValue.toString().toLowerCase();
              if (targetValue.indexOf(stateRef.current.searchText.toLowerCase()) > -1) {
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
        for (const dataField in stateRef.current.filters) {
          const { filterVal, filterType, comparator } = stateRef.current.filters[dataField];

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
      const currentSortField = stateRef.current.sortField;
      const currentSortOrder = stateRef.current.sortOrder;

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

      const statePage = stateRef.current.page;
      const stateSizePerPage = stateRef.current.sizePerPage;
      
      const setNextPage = statePage * stateSizePerPage <= result.length ? statePage : Math.max(1, Math.ceil(result.length / stateSizePerPage));
      stateRef.current.page = setNextPage;
      
      setPage(setNextPage);
      setData(result.slice((setNextPage - 1) * stateSizePerPage, setNextPage * stateSizePerPage));
      setTotalSize(result.length);
      setSizePerPage(stateSizePerPage);
      setAllData(result);
      setLoading(false);
    }, 2000);
  };

  const handleExport = (onExport: any) => (e: any) => {
    onExport(allData);
  };

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
                  onClick={handleExport(props.csvProps.onExport)}
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
                onTableChange={handleTableChange}
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
                  onClick={handleExport(props.csvProps.onExport)}
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
};

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
