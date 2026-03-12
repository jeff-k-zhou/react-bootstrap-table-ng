/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";

import BootstrapTable from "../../../react-bootstrap-table-ng";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone,
} from "../../../react-bootstrap-table-ng-paginator";
import filterFactory, { selectFilter, textFilter } from "../../../react-bootstrap-table-ng-filter";
import ToolkitProvider, { Search } from "../../../react-bootstrap-table-ng-toolkit";
import Code from "../components/common/code-block";

import "../../../react-bootstrap-table-ng-filter/style/react-bootstrap-table-ng-filter.scss";
import "../../../react-bootstrap-table-ng-paginator/style/react-bootstrap-table-ng-paginator.scss";
import "../../../react-bootstrap-table-ng-toolkit/style/react-bootstrap-table-ng-toolkit.scss";
import "../../../react-bootstrap-table-ng/style/react-bootstrap-table-ng.scss";
import { productsGenerator, productsQualityGenerator } from "../utils/common";
import "./stylesheet/storybook.scss";
import "./stylesheet/tomorrow.min.css";

interface Book {
  id: string;
  name: string;
}

interface BookListState {
  books: Book[];
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([
    { id: "1", name: "Book 1" },
    { id: "2", name: "Book 2" },
    { id: "3", name: "Book 3" },
    { id: "4", name: "Book 4" },
    { id: "5", name: "Book 5" },
    { id: "6", name: "Book 6" },
    { id: "7", name: "Book 7" },
    { id: "8", name: "Book 8" },
    { id: "9", name: "Book 9" },
    { id: "10", name: "Book 10" },
    { id: "11", name: "Book 11" },
  ]);

  const deleteBookWithId = () => {
    const lastOneId = books.length;
    const updatedBooks = books.filter(
      (m) => m.id !== lastOneId.toString()
    );
    setBooks(updatedBooks);
  };

  const addBook = () => {
    const lastOneId = books.length + 1;
    setBooks([
      ...books,
      {
        id: `${lastOneId}`,
        name: `Book ${lastOneId}`,
      },
    ]);
  };

  const options = {
    sizePerPage: 5,
    hideSizePerPage: true,
    hidePageListOnlyOnePage: true,
  };
  const columns = [
    {
      dataField: "id",
      text: "Product ID",
      formatter: (cell: string) => (
        <div>
          <span title={cell}>{cell}</span>
        </div>
      ),
    },
    {
      dataField: "name",
      text: "Product Name",
    },
  ];
  const sourceCode = `\
  import BootstrapTable from 'react-bootstrap-table-ng';
  import paginationFactory from 'react-bootstrap-table-ng-paginator';

  const BookList = () => {
    const [books, setBooks] = useState([
      { id: '1', name: 'Book 1' },
      { id: '2', name: 'Book 2' },
      { id: '3', name: 'Book 3' },
      { id: '4', name: 'Book 4' },
      { id: '5', name: 'Book 5' },
      { id: '6', name: 'Book 6' }
    ]);

    const deleteBookWithId = () => {
      const lastOneId = books.length;
      const updatedBooks = books.filter(m => m.id !== lastOneId.toString());
      setBooks(updatedBooks);
    };

    const addBook = () => {
      const lastOneId = books.length + 1;
      setBooks([...books, {
        id: \`$\{lastOneId}\`, name: \`Book $\{lastOneId}\`
      }]);
    }

    const options = {
      // pageStartIndex: 0,
      sizePerPage: 5,
      hideSizePerPage: true,
      hidePageListOnlyOnePage: true
    };
    const columns = [
      {
        dataField: 'id',
        text: 'Product ID',
        Cell: row => (
          <div>
            <span title={ row.value }>{ row.value }</span>
          </div>
        )
      },
      {
        dataField: 'name',
        text: 'Product Name'
      }
    ];

    return (
      <React.Fragment>
        <BootstrapTable
          keyField="id"
          data={ books }
          columns={ columns }
          pagination={ paginationFactory(options) }
        />
        <button className="btn btn-default" onClick={ deleteBookWithId }>
          delete last one book
        </button>
        <button className="btn btn-default" onClick={ addBook }>
          Add a book to the end
        </button>
        <Code>{ sourceCode }</Code>
      </React.Fragment>
    );
  }
  `;

  return (
    <React.Fragment>
      <BootstrapTable
        keyField="id"
        data={books}
        columns={columns}
        pagination={paginationFactory(options)}
      />
      <button className="btn btn-default" onClick={deleteBookWithId}>
        delete last one book
      </button>
      <button className="btn btn-default" onClick={addBook}>
        Add a book to the end
      </button>
      <Code>{sourceCode}</Code>
    </React.Fragment>
  );
};

interface StandalonePaginationListProps { }

const StandalonePaginationList: React.FC = () => {
  const products = productsGenerator(87);
  const columns = [
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
  const options = {
    custom: true,
    totalSize: products.length,
  };
  const sourceCode = `\
  import BootstrapTable from 'react-bootstrap-table-ng';
  import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table-ng-paginator';

  const columns = [{
    dataField: 'id',
    text: 'Product ID'
  }, {
    dataField: 'name',
    text: 'Product Name'
  }, {
    dataField: 'price',
    text: 'Product Price'
  }];

  const options = {
    custom: true,
    totalSize: products.length
  };

  <PaginationProvider
    pagination={ paginationFactory(options) }
  >
    {
      ({
        paginationProps,
        paginationTableProps
      }) => (
        <div>
          <PaginationListStandalone
            { ...paginationProps }
          />
          <BootstrapTable
            keyField="id"
            data={ products }
            columns={ columns }
            { ...paginationTableProps }
          />
        </div>
      )
    }
  </PaginationProvider>
  `;

  return (
    <div>
      <PaginationProvider
        pagination={paginationFactory(options)}
        data={products}
        remoteEmitter={{}}
        isRemotePagination={() => false}
      >
        {({ paginationProps, paginationTableProps }: any) => (
          <div>
            <PaginationListStandalone {...paginationProps} />
            <BootstrapTable
              keyField="id"
              columns={columns}
              data={products}
              {...paginationTableProps}
            />
          </div>
        )}
      </PaginationProvider>
      <Code>{sourceCode}</Code>
    </div>
  );
};

interface StandaloneSizePerPageProps { }

const StandaloneSizePerPage: React.FC = () => {
  const products = productsGenerator(87);
  const columns = [
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
  const options = {
    custom: true,
    totalSize: products.length,
  };
  const sourceCode = `\
  import BootstrapTable from 'react-bootstrap-table-ng';
  import paginationFactory, { PaginationProvider, SizePerPageDropdownStandalone } from 'react-bootstrap-table-ng-paginator';

  const columns = [{
    dataField: 'id',
    text: 'Product ID'
  }, {
    dataField: 'name',
    text: 'Product Name'
  }, {
    dataField: 'price',
    text: 'Product Price'
  }];

  const options = {
    custom: true,
    totalSize: products.length
  };

  <PaginationProvider
    pagination={ paginationFactory(options) }
  >
    {
      ({
        paginationProps,
        paginationTableProps
      }) => (
        <div>
          <SizePerPageDropdownStandalone
            { ...paginationProps }
          />
          <BootstrapTable
            keyField="id"
            data={ products }
            columns={ columns }
            { ...paginationTableProps }
          />
        </div>
      )
    }
  </PaginationProvider>
  `;

  return (
    <div>
      <PaginationProvider
        // bootstrap4
        pagination={paginationFactory(options)}
        data={products}
        remoteEmitter={{}}
        isRemotePagination={() => false}
      >
        {({ paginationProps, paginationTableProps }: any) => (
          <div>
            <SizePerPageDropdownStandalone
              {...paginationProps}
              btnContextual="btn btn-warning"
            />
            <BootstrapTable
              keyField="id"
              columns={columns}
              data={products}
              {...paginationTableProps}
            />
          </div>
        )}
      </PaginationProvider>
      <Code>{sourceCode}</Code>
    </div>
  );
};

interface StandalonePaginationTotalProps { }

const StandalonePaginationTotal: React.FC = () => {
  const products = productsGenerator(87);
  const columns = [
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
  const options = {
    custom: true,
    totalSize: products.length,
  };
  const sourceCode = `\
  import BootstrapTable from 'react-bootstrap-table-ng';
  import paginationFactory, { PaginationProvider, PaginationTotalStandalone, PaginationListStandalone } from 'react-bootstrap-table-ng-paginator';

  const columns = [{
    dataField: 'id',
    text: 'Product ID'
  }, {
    dataField: 'name',
    text: 'Product Name'
  }, {
    dataField: 'price',
    text: 'Product Price'
  }];

  const options = {
    custom: true,
    totalSize: products.length
  };

  <PaginationProvider
    pagination={ paginationFactory(options) }
  >
    {
      ({
        paginationProps,
        paginationTableProps
      }) => (
        <div>
          <PaginationTotalStandalone
            { ...paginationProps }
          />
          <PaginationListStandalone
            { ...paginationProps }
          />
          <BootstrapTable
            keyField="id"
            data={ products }
            columns={ columns }
            { ...paginationTableProps }
          />
        </div>
      )
    }
  </PaginationProvider>
  `;

  return (
    <div>
      <PaginationProvider
        pagination={paginationFactory(options)}
        data={products}
        remoteEmitter={{}}
        isRemotePagination={() => false}
      >
        {({ paginationProps, paginationTableProps }: any) => (
          <div>
            <PaginationTotalStandalone {...paginationProps} />
            <PaginationListStandalone {...paginationProps} />
            <BootstrapTable
              keyField="id"
              columns={columns}
              data={products}
              {...paginationTableProps}
            />
          </div>
        )}
      </PaginationProvider>
      <Code>{sourceCode}</Code>
    </div>
  );
};

interface FullyCustomPaginationProps { }

const FullyCustomPagination: React.FC = () => {
  const handleNextPage =
    ({ page, onPageChange }: any) =>
      () => {
        onPageChange(page + 1);
      };

  const handlePrevPage =
    ({ page, onPageChange }: any) =>
      () => {
        onPageChange(page - 1);
      };

  const handleSizePerPage = (
    { page, onSizePerPageChange }: any,
    newSizePerPage: number
  ) => {
    onSizePerPageChange(newSizePerPage, page);
  };

  const products = productsGenerator(87);
  const columns = [
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
  const options = {
    custom: true,
    totalSize: products.length,
  };
  const sourceCode = `\
  import BootstrapTable from 'react-bootstrap-table-ng';
  import paginationFactory from 'react-bootstrap-table-ng-paginator';

  const columns = [{
    dataField: 'id',
    text: 'Product ID'
  }, {
    dataField: 'name',
    text: 'Product Name'
  }, {
    dataField: 'price',
    text: 'Product Price'
  }];

  const options = {
    custom: true,
    totalSize: products.length
  };

  const FullyCustomPagination = () => {
    const handleNextPage = ({ page, onPageChange }) => () => {
      onPageChange(page + 1);
    };

    const handlePrevPage = ({ page, onPageChange }) => () => {
      onPageChange(page - 1);
    };

    const handleSizePerPage = ({ page, onSizePerPageChange }, newSizePerPage) => {
      onSizePerPageChange(newSizePerPage, page);
    };

    return (
      <div>
        <PaginationProvider
          pagination={ paginationFactory(options) }
        >
          {
            ({
              paginationProps,
              paginationTableProps
            }) => (
              <div>
                <div>
                  <p>Current Page: { paginationProps.page }</p>
                  <p>Current SizePerPage: { paginationProps.sizePerPage }</p>
                </div>
                <div className="btn-group" role="group">
                  <button className="btn btn-success" onClick={ handlePrevPage(paginationProps) }>Prev Page</button>
                  <button className="btn btn-primary" onClick={ handleNextPage(paginationProps) }>Next Page</button>
                  <button className="btn btn-danger" onClick={ () => handleSizePerPage(paginationProps, 10) }>Size Per Page: 10</button>
                  <button className="btn btn-warning" onClick={ () => handleSizePerPage(paginationProps, 25) }>Size Per Page: 25</button>
                </div>
                <BootstrapTable
                  keyField="id"
                  data={ products }
                  columns={ columns }
                  { ...paginationTableProps }
                />
              </div>
            )
          }
        </PaginationProvider>
        <Code>{ sourceCode }</Code>
      </div>
    );
  };
  `;

  return (
    <div>
      <PaginationProvider
        pagination={paginationFactory(options)}
        data={products}
        remoteEmitter={{}}
        isRemotePagination={() => false}
      >
        {({ paginationProps, paginationTableProps }: any) => (
          <div>
            <div>
              <p>Current Page: {paginationProps.page}</p>
              <p>Current SizePerPage: {paginationProps.sizePerPage}</p>
            </div>
            <div className="btn-group" role="group">
              <button
                className="btn btn-success"
                onClick={handlePrevPage(paginationProps)}
              >
                Prev Page
              </button>
              <button
                className="btn btn-primary"
                onClick={handleNextPage(paginationProps)}
              >
                Next Page
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleSizePerPage(paginationProps, 10)}
              >
                Size Per Page: 10
              </button>
              <button
                className="btn btn-warning"
                onClick={() => handleSizePerPage(paginationProps, 25)}
              >
                Size Per Page: 25
              </button>
            </div>
            <BootstrapTable
              keyField="id"
              data={products}
              columns={columns}
              {...paginationTableProps}
            />
          </div>
        )}
      </PaginationProvider>
      <Code>{sourceCode}</Code>
    </div>
  );
};

const RemoteFullyCustomPagination: React.FC = () => {
  const products = productsGenerator(87);
  const columns = [
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
  const sourceCode = `\
  import BootstrapTable from 'react-bootstrap-table-ng';
  import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table-ng-paginator';
  // ...
  const RemotePagination = ({ data, page, sizePerPage, onTableChange, totalSize }) => (
    <div>
      <PaginationProvider
        pagination={
          paginationFactory({
            custom: true,
            page,
            sizePerPage,
            totalSize
          })
        }
      >
        {
          ({
            paginationProps,
            paginationTableProps
          }) => (
            <div>
              <div>
                <p>Current Page: { paginationProps.page }</p>
                <p>Current SizePerPage: { paginationProps.sizePerPage }</p>
              </div>
              <div>
                <PaginationListStandalone
                  { ...paginationProps }
                />
              </div>
              <BootstrapTable
                remote
                keyField="id"
                data={ data }
                columns={ columns }
                onTableChange={ onTableChange }
                { ...paginationTableProps }
              />
            </div>
          )
        }
      </PaginationProvider>
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

  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>(products.slice(0, 10));
  const [sizePerPage, setSizePerPage] = useState(10);

  const handleTableChange = (type: string, { page: newPage, sizePerPage: newSizePerPage }: any) => {
    const currentIndex = (newPage - 1) * newSizePerPage;
    setTimeout(() => {
      setPage(newPage);
      setData(products.slice(currentIndex, currentIndex + newSizePerPage));
      setSizePerPage(newSizePerPage);
    }, 2000);
  };

  return (
    <div>
      <PaginationProvider
        pagination={paginationFactory({
          custom: true,
          page,
          sizePerPage,
          totalSize: products.length,
        })}
        data={products}
        remoteEmitter={{}}
        isRemotePagination={() => false}
      >
        {({ paginationProps, paginationTableProps }: any) => (
          <div>
            <div>
              <p>Current Page: {paginationProps.page}</p>
              <p>Current SizePerPage: {paginationProps.sizePerPage}</p>
            </div>
            <div>
              <PaginationListStandalone {...paginationProps} />
            </div>
            <BootstrapTable
              remote
              keyField="id"
              data={data}
              columns={columns}
              onTableChange={handleTableChange}
              {...paginationTableProps}
            />
          </div>
        )}
      </PaginationProvider>
      <Code>{sourceCode}</Code>
    </div>
  );
};

const PaginationFilter: React.FC = () => {
  const [products, setProducts] = useState(() => productsQualityGenerator(21));

  const loadData = React.useCallback(() => {
    setProducts(productsQualityGenerator(40, 7));
  }, []);

  const selectOptions = React.useMemo(() => ({
    0: 'good',
    1: 'Bad',
    2: 'unknown'
  }), []);

  const columns = React.useMemo(() => [{
    dataField: 'id',
    text: 'Product ID'
  }, {
    dataField: 'name',
    text: 'Product Name',
    filter: textFilter()
  }, {
    dataField: 'quality',
    text: 'Product Quailty',
    formatter: (cell: any) => (selectOptions as any)[cell],
    filter: selectFilter({
      options: selectOptions,
      defaultValue: 0
    })
  }], [selectOptions]);

  const filter = React.useMemo(() => filterFactory(), []);

  const options = React.useMemo(() => ({
    custom: true,
    paginationSize: 4,
    pageStartIndex: 1,
    firstPageText: 'First',
    prePageText: 'Back',
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    showTotal: true,
    totalSize: products.length,
  }), [products.length]);

  const pagination = React.useMemo(() => paginationFactory(options), [options]);

  const remoteEmitter = React.useRef({}).current;
  const sourceCode = `\
  import BootstrapTable from 'react-bootstrap-table-ng';
  import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table-ng-paginator';
  import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table-ng-filter';

  const selectOptions = {
    0: 'good',
    1: 'Bad',
    2: 'unknown'
  };

  const columns = [{
    dataField: 'id',
    text: 'Product ID'
  }, {
    dataField: 'name',
    text: 'Product Name',
    filter: textFilter()
  }, {
    dataField: 'quality',
    text: 'Product Quailty',
    formatter: cell => selectOptions[cell],
    filter: selectFilter({
      options: selectOptions,
      defaultValue: 0
    })
  }];

  const Table = () => {
    const [products, setProducts] = React.useState(products);

    const loadData = () => {
      setProducts(productsQualityGenerator(40, 7));
    };

    const options = {
      custom: true,
      paginationSize: 4,
      pageStartIndex: 1,
      firstPageText: 'First',
      prePageText: 'Back',
      nextPageText: 'Next',
      lastPageText: 'Last',
      nextPageTitle: 'First page',
      prePageTitle: 'Pre page',
      firstPageTitle: 'Next page',
      lastPageTitle: 'Last page',
      showTotal: true,
      totalSize: products.length
    };

    const contentTable = ({ paginationProps, paginationTableProps }) => (
      <div>
        <button className="btn btn-default" onClick={ loadData }>Load Another Data</button>
        <PaginationListStandalone { ...paginationProps } />
        <div>
          <div>
            <BootstrapTable
              striped
              hover
              keyField="id"
              data={ products }
              columns={ columns }
              filter={ filterFactory() }
              { ...paginationTableProps }
            />
          </div>
        </div>
        <PaginationListStandalone { ...paginationProps } />
      </div>
    );

    return (
      <div>
        <h2>PaginationProvider will care the data size change. You dont do anything</h2>
        <PaginationProvider
          pagination={
            paginationFactory(options)
          }
        >
          { contentTable }
        </PaginationProvider>
      </div >
    );
  };
  `;

  const contentTable = React.useCallback(({ paginationProps, paginationTableProps }: any) => (
    <div>
      <button className="btn btn-default" onClick={loadData}>Load Another Data</button>
      <PaginationListStandalone {...paginationProps} />
      <div>
        <BootstrapTable
          striped
          hover
          keyField="id"
          data={products}
          columns={columns}
          filter={filter}
          {...paginationTableProps}
        />
      </div>
    </div>
  ), [loadData, products, columns, filter]);

  return (
    <div>
      <h2>PaginationProvider will care the data size change. You don't do anything</h2>
      <PaginationProvider
        pagination={pagination}
        data={products}
        remoteEmitter={remoteEmitter}
        isRemotePagination={React.useCallback(() => false, [])}
      >
        {contentTable}
      </PaginationProvider>
      <Code>{sourceCode}</Code>
    </div >
  );
};

const PaginationSearch: React.FC = () => {
  const [products, setProducts] = useState(() => productsGenerator(40));

  const loadData = React.useCallback(() => {
    setProducts(productsGenerator(17));
  }, []);

  const columns = React.useMemo(() => [{
    dataField: 'id',
    text: 'Product ID'
  }, {
    dataField: 'name',
    text: 'Product Name'
  }], []);

  const options = React.useMemo(() => ({
    custom: true,
    paginationSize: 4,
    pageStartIndex: 1,
    firstPageText: 'First',
    prePageText: 'Back',
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    showTotal: true,
    totalSize: products.length,
  }), [products.length]);

  const pagination = React.useMemo(() => paginationFactory(options), [options]);
  const remoteEmitter = React.useRef({}).current;
  const sourceCode = `\
  import BootstrapTable from 'react-bootstrap-table-ng';
  import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table-ng-paginator';
  import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

  const Table = () => {
    const [products, setProducts] = React.useState(products);

    const loadData = () => {
      setProducts(productsGenerator(17));
    };

    const options = {
      custom: true,
      paginationSize: 4,
      pageStartIndex: 1,
      firstPageText: 'First',
      prePageText: 'Back',
      nextPageText: 'Next',
      lastPageText: 'Last',
      nextPageTitle: 'First page',
      prePageTitle: 'Pre page',
      firstPageTitle: 'Next page',
      lastPageTitle: 'Last page',
      showTotal: true,
      totalSize: products.length
    };

    const contentTable = ({ paginationProps, paginationTableProps }) => (
      <div>
        <button className="btn btn-default" onClick={ loadData }>Load Another Data</button>
        <PaginationListStandalone { ...paginationProps } />
        <ToolkitProvider
          keyField="id"
          columns={ columns }
          data={ products }
          search
        >
          {
            (toolkitprops: any) => (
              <div>
                <SearchBar { ...toolkitprops.searchProps } />
                <BootstrapTable
                  striped
                  hover
                  { ...toolkitprops.baseProps }
                  { ...paginationTableProps }
                />
              </div>
            )
          }
        </ToolkitProvider>
        <PaginationListStandalone { ...paginationProps } />
      </div>
    );

    return (
      <div>
        <h2>PaginationProvider will care the data size change. You dont do anything</h2>
        <PaginationProvider
          pagination={
            paginationFactory(options)
          }
        >
          { contentTable }
        </PaginationProvider>
        <Code>{ sourceCode }</Code>
      </div >
    );
  };
  `;

  const { SearchBar } = Search;

  const contentTable = React.useCallback(({ paginationProps, paginationTableProps }: any) => (
    <div>
      <button className="btn btn-default" onClick={loadData}>Load Another Data</button>
      <PaginationListStandalone {...paginationProps} />
      <ToolkitProvider
        keyField="id"
        columns={columns}
        data={products}
        search
      >
        {
          (toolkitprops: any) => (
            <div>
              <SearchBar {...toolkitprops.searchProps} />
              <BootstrapTable
                striped
                hover
                {...toolkitprops.baseProps}
                {...paginationTableProps}
              />
            </div>
          )
        }
      </ToolkitProvider>
    </div>
  ), [loadData, columns, products]);

  return (
    <div>
      <h2>PaginationProvider will care the data size change. You don't do anything</h2>
      <PaginationProvider
        pagination={pagination}
        data={products}
        remoteEmitter={remoteEmitter}
        isRemotePagination={React.useCallback(() => false, [])}
      >
        {contentTable}
      </PaginationProvider>
      <Code>{sourceCode}</Code>
    </div>
  );
};

interface PaginationMainProps {
  mode?: any;
  data?: any;
  columns?: any;
  sourceCode?: any;
  pagination?: any;
}

export default ({
  mode,
  data,
  columns,
  sourceCode,
  pagination,
}: PaginationMainProps) => {
  switch (mode) {
    case "dynamic":
      return (
        <div>
          <BookList />
        </div>
      );
    case "standalone-list":
      return (
        <div>
          <StandalonePaginationList />
        </div>
      );
    case "standalone-dropdown":
      return (
        <div>
          <StandaloneSizePerPage />
        </div>
      );
    case "standalone-total":
      return (
        <div>
          <StandalonePaginationTotal />
        </div>
      );
    case "full":
      return (
        <div>
          <FullyCustomPagination />
        </div>
      );
    case "remote-full":
      return (
        <div>
          <RemoteFullyCustomPagination />
        </div>
      );
    case "filter":
      return (
        <div>
          <PaginationFilter />
        </div>
      );
    case "search":
      return (
        <div>
          <PaginationSearch />
        </div>
      );
    default:
      return (
        <div>
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            pagination={pagination}
          />
          <Code>{sourceCode}</Code>
        </div>
      );
  }
};
