/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";

import BootstrapTable from "../../../react-bootstrap-table-ng";
import filterFactory, {
  textFilter,
} from "../../../react-bootstrap-table-ng-filter";
import paginationFactory from "../../../react-bootstrap-table-ng-paginator";
import ToolkitProvider, {
  Search,
} from "../../../react-bootstrap-table-ng-toolkit";

import Code from "../components/common/code-block";
import { productsGenerator } from "../utils/common";

import "../../../react-bootstrap-table-ng-filter/style/react-bootstrap-table-ng-filter.scss";
import "../../../react-bootstrap-table-ng-paginator/style/react-bootstrap-table-ng-paginator.scss";
import "../../../react-bootstrap-table-ng-toolkit/style/react-bootstrap-table-ng-toolkit.scss";
import "../../../react-bootstrap-table-ng/style/react-bootstrap-table-ng.scss";
import "./stylesheet/storybook.scss";
import "./stylesheet/tomorrow.min.css";

interface WithoutPaginationCaseState {
  rowCount: number;
}

const WithoutPaginationCase: React.FC = () => {
  const products1 = productsGenerator(8);
  const [rowCount, setRowCount] = useState(products1.length);

  const handleDataChange = ({ dataSize }: any) => {
    setRowCount(dataSize);
  };

  const sourceCode2 = `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';
    import paginationFactory from 'react-bootstrap-table-ng-paginator';

    const Case2 = () => {
      const [rowCount, setRowCount] = React.useState(products.length);

      const handleDataChange = ({ dataSize }) => {
        setRowCount(dataSize);
      };

      return (
        <div>
          <h5>Row Count:<span className="badge">{ rowCount }</span></h5>
          <BootstrapTable
            onDataSizeChange={ handleDataChange }
            keyField="id"
            data={ products }
            columns={ columns }
            filter={ filterFactory() }
            pagination={ paginationFactory() }
          />
          <Code>{ sourceCode }</Code>
        </div>
      );
    };
    `;

  return (
    <div>
      <h3>Without Pagination Case</h3>
      <h5>
        Row Count:<span className="badge">{rowCount}</span>
      </h5>
      <BootstrapTable
        onDataSizeChange={handleDataChange}
        keyField="id"
        data={products1}
        columns={[
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
        ]}
        filter={filterFactory()}
      />
      <Code>{sourceCode2}</Code>
    </div>
  );
};

interface WithPaginationCaseState {
  rowCount: number;
}

const WithPaginationCase: React.FC = () => {
  const products2 = productsGenerator(88);
  const [rowCount, setRowCount] = useState(products2.length);

  const handleDataChange = ({ dataSize }: any) => {
    setRowCount(dataSize);
  };

  const sourceCode1 = `\
    import BootstrapTable from 'react-bootstrap-table-ng';
    import filterFactory, { textFilter } from 'react-bootstrap-table-ng-filter';

    const Case1 = () => {
      const [rowCount, setRowCount] = React.useState(products.length);

      const handleDataChange = ({ dataSize }) => {
        setRowCount(dataSize);
      };

      return (
        <div>
          <h5>Row Count:<span className="badge">{ rowCount }</span></h5>
          <BootstrapTable
            onDataSizeChange={ handleDataChange }
            keyField="id"
            data={ products }
            columns={ columns }
            filter={ filterFactory() }
          />
          <Code>{ sourceCode }</Code>
        </div>
      );
    };
    `;

  return (
    <div>
      <h3>Without Pagination Case</h3>
      <h5>
        Row Count:<span className="badge">{rowCount}</span>
      </h5>
      <BootstrapTable
        onDataSizeChange={handleDataChange}
        keyField="id"
        data={products2}
        columns={[
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
        ]}
        filter={filterFactory()}
        pagination={paginationFactory()}
      />
      <Code>{sourceCode1}</Code>
    </div>
  );
};

const LoadDataWithFilterProductList = (props: any) => {
  const columns = [
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

  return (
    <div style={{ paddingTop: "20px" }}>
      <h1 className="h2">Products</h1>
      <BootstrapTable
        keyField="id"
        data={props.products}
        columns={columns}
        filter={filterFactory()}
      />
    </div>
  );
};

const LoadDataWithFilterComponent: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  const loadData = () => {
    setProducts(productsGenerator());
  };

  return (
    <div>
      <button
        onClick={loadData}
        style={{
          fontSize: "20px",
          position: "absolute",
          left: "200px",
          top: "40px",
        }}
      >
        Load Data
      </button>
      <LoadDataWithFilterProductList products={products} />
    </div>
  );
};

const LoadDataWithDefaultFilterProductList = (props: any) => {
  const columns = [
    {
      dataField: "id",
      text: "Product ID",
    },
    {
      dataField: "name",
      text: "Product Name",
      filter: textFilter({
        defaultValue: "1",
      }),
    },
    {
      dataField: "price",
      text: "Product Price",
      filter: textFilter(),
    },
  ];

  return (
    <div style={{ paddingTop: "20px" }}>
      <h1 className="h2">Products</h1>
      <BootstrapTable
        keyField="id"
        data={props.products}
        columns={columns}
        filter={filterFactory()}
      />
    </div>
  );
};

const LoadDataWithDefaultFilterComponent: React.FC = () => {
  const [products, setProducts] = useState<any[]>(productsGenerator(3));

  const loadData = () => {
    setProducts(productsGenerator(14));
  };

  return (
    <div>
      <button
        onClick={loadData}
        style={{
          fontSize: "20px",
          position: "absolute",
          left: "200px",
          top: "40px",
        }}
      >
        Load Data
      </button>
      <LoadDataWithDefaultFilterProductList products={products} />
    </div>
  );
};

const { SearchBar } = Search;

const LoadDataWithSearchProductList = (props: any) => {
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

  return (
    <div style={{ paddingTop: "20px" }}>
      <h1 className="h2">Products</h1>
      <ToolkitProvider
        keyField="id"
        data={props.products}
        columns={columns}
        search
      >
        {(toolkitprops: any) => (
          <div>
            <SearchBar {...toolkitprops.searchProps} />
            <BootstrapTable striped hover {...toolkitprops.baseProps} />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
};

const LodadDataWithSearchComponent: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  const loadData = () => {
    setProducts(productsGenerator());
  };

  return (
    <div>
      <button
        onClick={loadData}
        style={{
          fontSize: "20px",
          position: "absolute",
          left: "200px",
          top: "40px",
        }}
      >
        Load Data
      </button>
      <LoadDataWithSearchProductList products={products} />
    </div>
  );
};

const LoadDataWithDefaultSearchProductList = (props: any) => {
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

  return (
    <div style={{ paddingTop: "20px" }}>
      <h1 className="h2">Products</h1>
      <ToolkitProvider
        keyField="id"
        data={props.products}
        columns={columns}
        search={{ defaultSearch: "3" }}
      >
        {(toolkitprops: any) => (
          <div>
            <SearchBar {...toolkitprops.searchProps} />
            <BootstrapTable striped hover {...toolkitprops.baseProps} />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
};

const LodadDataWithDefaultSearchComponent: React.FC = () => {
  const [products, setProducts] = useState<any[]>(productsGenerator(4));

  const loadData = () => {
    setProducts(productsGenerator(34));
  };

  return (
    <div>
      <button
        onClick={loadData}
        style={{
          fontSize: "20px",
          position: "absolute",
          left: "200px",
          top: "40px",
        }}
      >
        Load Data
      </button>
      <LoadDataWithDefaultSearchProductList products={products} />
    </div>
  );
};

const LodadDataWithFilterAndPaginationProductList = (props: any) => {
  const columns = [
    {
      dataField: "id",
      text: "Product ID",
    },
    {
      dataField: "name",
      text: "Product Name",
      filter: textFilter({
        defaultValue: "6",
      }),
    },
    {
      dataField: "price",
      text: "Product Price",
      filter: textFilter(),
    },
  ];

  return (
    <div style={{ paddingTop: "20px" }}>
      <h1 className="h2">Products</h1>
      <BootstrapTable
        keyField="id"
        data={props.products}
        columns={columns}
        filter={filterFactory()}
        pagination={paginationFactory()}
      />
    </div>
  );
};

const LodadDataWithFilterAndPaginationComponent: React.FC = () => {
  const [products, setProducts] = useState<any[]>(productsGenerator(60));

  const loadData = () => {
    setProducts(productsGenerator(14));
  };

  return (
    <div>
      <button
        onClick={loadData}
        style={{
          fontSize: "20px",
          position: "absolute",
          left: "200px",
          top: "40px",
        }}
      >
        Load Data
      </button>
      <LodadDataWithFilterAndPaginationProductList
        products={products}
      />
    </div>
  );
};

interface DataProps {
  mode?: any;
}

export default ({ mode }: DataProps) => {
  switch (mode) {
    case "data":
      return (
        <div>
          <WithoutPaginationCase />
          <WithPaginationCase />
        </div>
      );
    case "filter":
      return (
        <div>
          <LoadDataWithFilterComponent />
        </div>
      );
    case "default-filter":
      return (
        <div>
          <LoadDataWithDefaultFilterComponent />
        </div>
      );
    case "search":
      return (
        <div>
          <LodadDataWithSearchComponent />
        </div>
      );
    case "default-search":
      return (
        <div>
          <LodadDataWithDefaultSearchComponent />
        </div>
      );
    case "pagination":
      return (
        <div>
          <LodadDataWithFilterAndPaginationComponent />
        </div>
      );
  }
};
