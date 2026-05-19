/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";

import BootstrapTable from "../../../react-bootstrap-table-ng";
import Code from "../components/common/code-block";
import { productsGenerator } from "../utils/common";

import "../../../react-bootstrap-table-ng-filter/style/react-bootstrap-table-ng-filter.scss";
import "../../../react-bootstrap-table-ng-paginator/style/react-bootstrap-table-ng-paginator.scss";
import "../../../react-bootstrap-table-ng-toolkit/style/react-bootstrap-table-ng-toolkit.scss";
import "../../../react-bootstrap-table-ng/style/react-bootstrap-table-ng.scss";
import "./stylesheet/storybook.scss";
import "./stylesheet/tomorrow.min.css";

interface ProductListProps { }

const ProductList: React.FC = () => {
  const [products, setProducts] = useState([
    { id: 12, name: "Item 12", price: 12.5, inStock: false },
    { id: 13, name: "Item 13", price: 13.5, inStock: true },
    { id: 14, name: "Item 14", price: 14.5, inStock: true },
  ]);
  const [count, setCount] = useState(0);

  const toggleInStock = () => {
    let newProducts = [...products];
    newProducts = newProducts.map((d) => {
      if (d.id === 13) {
        return {
          ...d,
          inStock: !d.inStock,
        };
      }
      return d;
    });
    setProducts(newProducts);
  };

  const counter = () => {
    setCount((prev) => prev + 1);
  };

  const columns = [
    {
      dataField: "id",
      text: "Product ID",
      formatter: (cell: any, row: any, rowIndex: number, extraData: any) => (
        <div>
          <span>ID: {row.id}</span>
          <br />
          <span>Counter: {extraData}</span>
        </div>
      ),
      formatExtraData: count,
    },
    {
      dataField: "name",
      text: "Product Name",
    },
    {
      dataField: "price",
      text: "Product Price",
    },
    {
      dataField: "inStock",
      text: "In Stock",
      formatter: (cellContent: any, row: any) => (
        <div className="checkbox disabled">
          <label>
            <input type="checkbox" checked={row.inStock} disabled aria-label="In stock status" onChange={() => { }} />
          </label>
        </div>
      ),
    },
    {
      dataField: "df1",
      isDummyField: true,
      text: "Action 1",
      formatter: (cellContent: any, row: any) => {
        if (row.inStock) {
          return (
            <h5>
              <span className="label label-success"> Available</span>
            </h5>
          );
        }
        return (
          <h5>
            <span className="label label-danger"> Backordered</span>
          </h5>
        );
      },
    },
    {
      dataField: "df2",
      isDummyField: true,
      text: "Action 2",
      formatter: (cellContent: any, row: any) => {
        if (row.inStock) {
          return (
            <h5>
              <span className="label label-success"> Available</span>
            </h5>
          );
        }
        return (
          <h5>
            <span className="label label-danger"> Backordered</span>
          </h5>
        );
      },
    },
  ];

  const sourceCode = `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const ProductList = () => {
      const [products, setProducts] = React.useState(products);
      const [count, setCount] = React.useState(0);

      const toggleInStock = () => {
        let newProducts = [...products];
        newProducts = newProducts.map((d) => {
          if (d.id === 13) {
            return {
              ...d,
              inStock: !d.inStock
            };
          }
          return d;
        });
        setProducts(newProducts);
      };

      const columns = [
        {
          dataField: 'id',
          text: 'Product ID',
          formatter: (cell, row, rowIndex, extraData) => (
            <div>
              <span>ID: {row.id}</span>
              <br />
              <span>state: {extraData}</span>
            </div>
          ),
          formatExtraData: count
        },
        {
          dataField: 'name',
          text: 'Product Name'
        },
        {
          dataField: 'price',
          text: 'Product Price'
        },
        {
          dataField: 'inStock',
          text: 'In Stock',
          formatter: (cellContent, row) => (
            <div className="checkbox disabled">
              <label>
                <input type="checkbox" checked={ row.inStock } disabled onChange={() => { }} />
              </label>
            </div>
          )
        },
        {
          dataField: 'df1',
          isDummyField: true,
          text: 'Action 1',
          formatter: (cellContent, row) => {
            if (row.inStock) {
              return (
                <h5>
                  <span className="label label-success"> Available</span>
                </h5>
              );
            }
            return (
              <h5>
                <span className="label label-danger"> Backordered</span>
              </h5>
            );
          }
        },
        {
          dataField: 'df2',
          isDummyField: true,
          text: 'Action 2',
          formatter: (cellContent, row) => {
            if (row.inStock) {
              return (
                <h5>
                  <span className="label label-success"> Available</span>
                </h5>
              );
            }
            return (
              <h5>
                <span className="label label-danger"> Backordered</span>
              </h5>
            );
          }
        }
      ];

      return (
        <div>
          <h3>Action 1 and Action 2 are dummy column</h3>
          <button onClick={ toggleInStock } className="btn btn-primary">
            Toggle item 13 stock status
          </button>
          <button
            className="btn btn-success"
            onClick={ () => setCount(count + 1) }
          >
            Click me to Increase counter
          </button>
          <BootstrapTable
            keyField="id"
            data={ products }
            columns={ columns }
          />
          <Code>{ sourceCode }</Code>
        </div>
      );
    };
    `;

  return (
    <div>
      <h3>Action 1 and Action 2 are dummy column</h3>
      <button onClick={toggleInStock} className="btn btn-primary">
        Toggle item 13 stock status
      </button>
      <button className="btn btn-success" onClick={counter}>
        Click me to Increase counter
      </button>
      <BootstrapTable
        keyField="id"
        data={products}
        columns={columns}
      />
      <Code>{sourceCode}</Code>
    </div>
  );
};

interface DummyColumnWithRowExpandProps { }

const DummyColumnWithRowExpand: React.FC = () => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [products] = useState(() => productsGenerator());

  const expandRow = {
    renderer: () => (
      <div style={{ width: "100%", height: "20px" }}>Content</div>
    ),
    showExpandColumn: true,
    expandByColumnOnly: true,
  };

  const actionFormater = (
    cell: any,
    row: any,
    rowIndex: number,
    { hoverIdx: localHoverIdx }: any
  ) => {
    if (
      (localHoverIdx !== null || localHoverIdx !== undefined) &&
      localHoverIdx === rowIndex
    ) {
      return (
        <div
          style={{ width: "20px", height: "20px", backgroundColor: "orange" }}
        />
      );
    }
    return <div style={{ width: "20px", height: "20px" }} />;
  };

  const rowEvents = {
    onMouseEnter: (e: any, row: any, rowIndex: number) => {
      setHoverIdx(rowIndex);
    },
    onMouseLeave: () => {
      setHoverIdx(null);
    },
  };

  const rowStyle = (row: any, rowIndex: number) => {
    const style: { backgroundColor?: any; borderTop?: any } = {};
    if (rowIndex % 2 === 0) {
      style.backgroundColor = "transparent";
    } else {
      style.backgroundColor = "rgba(54, 163, 173, .10)";
    }
    style.borderTop = "none";

    return style;
  };

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
    {
      dataField: "action",
      isDummyField: true,
      text: "Actions",
      formatter: actionFormater,
      formatExtraData: { hoverIdx },
      headerStyle: { width: "50px" },
      style: { height: "30px" },
    },
  ];

  const sourceCode = `\
    import BootstrapTable from 'react-bootstrap-table-ng';

    const DummyColumnWithRowExpand = () => {
      const [hoverIdx, setHoverIdx] = React.useState(null);

      const expandRow = {
        renderer: () => (
          <div style={ { width: '100%', height: '20px' } }>Content</div>
        ),
        showExpandColumn: true,
        expandByColumnOnly: true
      };

      const actionFormater = (cell, row, rowIndex, { hoverIdx: tempHoverIdx }) => {
        if ((tempHoverIdx !== null || tempHoverIdx !== undefined) && tempHoverIdx === rowIndex) {
          return (
            <div
              style={ { width: '20px', height: '20px', backgroundColor: 'orange' } }
            />
          );
        }
        return (
          <div
            style={ { width: '20px', height: '20px' } }
          />
        );
      };

      const rowEvents = {
        onMouseEnter: (e, row, rowIndex) => {
          setHoverIdx(rowIndex);
        },
        onMouseLeave: () => {
          setHoverIdx(null);
        }
      };

      const rowStyle = (row, rowIndex) => {
        row.index = rowIndex;
        const style = {};
        if (rowIndex % 2 === 0) {
          style.backgroundColor = 'transparent';
        } else {
          style.backgroundColor = 'rgba(54, 163, 173, .10)';
        }
        style.borderTop = 'none';

        return style;
      };

      const columns = [{
        dataField: 'id',
        text: 'Product ID'
      }, {
        dataField: 'name',
        text: 'Product Name'
      }, {
        dataField: 'price',
        text: 'Product Price'
      }, {
        dataField: 'action',
        text: '',
        isDummyField: true,
        formatter: actionFormater,
        formatExtraData: { hoverIdx },
        headerStyle: { width: '50px' },
        style: { height: '30px' }
      }];

      return (
        <div>
          <BootstrapTable
            keyField="id"
            data={ products }
            columns={ columns }
            noDataIndication="There is no data"
            classes="table"
            rowStyle={ rowStyle }
            rowEvents={ rowEvents }
            expandRow={ expandRow }
          />
        </div>
      );
    };
    `;

  return (
    <div>
      <BootstrapTable
        keyField="id"
        data={products}
        columns={columns}
        rowStyle={rowStyle}
        rowEvents={rowEvents}
        expandRow={expandRow}
      />
      <Code>{sourceCode}</Code>
    </div>
  );
};

interface WorkOnColumnsProps {
  mode?: any;
  data?: any;
  columns?: any;
  sourceCode?: any;
  bordered?: any;
  header?: any;
}

export default ({
  mode,
  data,
  columns,
  sourceCode,
  bordered,
  header,
}: WorkOnColumnsProps) => {
  switch (mode) {
    case "dummy":
      return <ProductList />;
    case "rowdummy":
      return <DummyColumnWithRowExpand />;
    default:
      return (
        <div>
          {header}
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            bordered={bordered}
          />
          <Code>{sourceCode}</Code>
        </div>
      );
  }
};
