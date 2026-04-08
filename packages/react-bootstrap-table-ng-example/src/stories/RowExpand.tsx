/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";

import BootstrapTable from "../../../react-bootstrap-table-ng";
import Code from "../components/common/code-block";

import "../../../react-bootstrap-table-ng-filter/style/react-bootstrap-table-ng-filter.scss";
import "../../../react-bootstrap-table-ng-paginator/style/react-bootstrap-table-ng-paginator.scss";
import "../../../react-bootstrap-table-ng-toolkit/style/react-bootstrap-table-ng-toolkit.scss";
import "../../../react-bootstrap-table-ng/style/react-bootstrap-table-ng.scss";
import "./stylesheet/storybook.scss";
import "./stylesheet/tomorrow.min.css";

interface RowExpandManagementProps {
  products: any[];
  columns: any[];
}

interface RowExpandManagementState {
  expanded: number[];
}

const RowExpandManagement: React.FC<RowExpandManagementProps> = ({ products, columns }) => {
  const [expanded, setExpanded] = useState<number[]>([0, 1]);

  const handleBtnClick = () => {
    if (!expanded.includes(2)) {
      setExpanded([...expanded, 2]);
    } else {
      setExpanded(expanded.filter((x) => x !== 2));
    }
  };

  const handleOnExpand = (row: any, isExpand: boolean, rowIndex: number, e: React.MouseEvent) => {
    if (isExpand) {
      setExpanded([...expanded, row.id]);
    } else {
      setExpanded(expanded.filter((x) => x !== row.id));
    }
  };

  const expandRow = {
    renderer: (row: any) => (
      <div>
        <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
        <p>You can render anything here, also you can add additional data on every row object</p>
        <p>expandRow.renderer callback will pass the origin row object to you</p>
      </div>
    ),
    expanded: expanded,
    onExpand: handleOnExpand,
  };

  const sourceCode = `\
    import BootstrapTable from 'react-bootstrap-table-ng';

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

    const RowExpandManagment = () => {
      const [expanded, setExpanded] = React.useState([0, 1]);

      const handleBtnClick = () => {
        if (!expanded.includes(2)) {
          setExpanded([...expanded, 2]);
        } else {
          setExpanded(expanded.filter(x => x !== 2));
        }
      };

      const handleOnExpand = (row, isExpand, rowIndex, e) => {
        if (isExpand) {
          setExpanded([...expanded, row.id]);
        } else {
          setExpanded(expanded.filter(x => x !== row.id));
        }
      };

      const expandRow = {
        renderer: row => (
          <div>
            <p>{ \`This Expand row is belong to rowKey \${row.id}\` }</p>
            <p>You can render anything here, also you can add additional data on every row object</p>
            <p>expandRow.renderer callback will pass the origin row object to you</p>
          </div>
        ),
        expanded: expanded,
        onExpand: handleOnExpand
      };
      
      return (
        <div>
          <button className="btn btn-success" onClick={ handleBtnClick }>Expand/Collapse 3rd row</button>
          <BootstrapTable keyField="id" data={ products } columns={ columns } expandRow={ expandRow } />
          <Code>{ sourceCode }</Code>
        </div>
      );
    };
    `;

  return (
    <div>
      <button className="btn btn-success" onClick={handleBtnClick}>Expand/Collapse 3rd row</button>
      <BootstrapTable keyField="id" data={products} columns={columns} expandRow={expandRow} />
      <Code>{sourceCode}</Code>
    </div>
  );
};

interface RowExpandProps {
  mode?: any;
  header?: any;
  data?: any;
  columns?: any;
  sourceCode?: any;
  sourceCode1?: any;
  sourceCode2?: any;
  expandRow?: any;
  expandRow1?: any;
  expandRow2?: any;
}

export default ({
  mode,
  header,
  data,
  columns,
  sourceCode,
  sourceCode1,
  sourceCode2,
  expandRow,
  expandRow1,
  expandRow2,
}: RowExpandProps) => {
  switch (mode) {
    case "management":
      return (
        <RowExpandManagement
          products={data}
          columns={columns}
        />
      );
    case "style":
      return (
        <div>
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            expandRow={expandRow1}
          />
          <Code>{sourceCode1}</Code>
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            expandRow={expandRow2}
          />
          <Code>{sourceCode2}</Code>
        </div>
      );
    default:
      return (
        <div>
          {header}
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            expandRow={expandRow}
          />
          <Code>{sourceCode}</Code>
        </div>
      );
  }
};
