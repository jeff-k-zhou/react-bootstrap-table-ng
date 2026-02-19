/* eslint-disable import/no-anonymous-default-export */
import React from "react";

import BootstrapTable from "../../../react-bootstrap-table-ng";
import Code from "../components/common/code-block";

import "../../../react-bootstrap-table-ng/style/react-bootstrap-table-ng.scss";
import "./stylesheet/storybook.scss";
import "./stylesheet/tomorrow.min.css";

interface ColumnResizeProps {
  data?: any;
  columns?: any;
  sourceCode?: any;
  columnResize?: boolean;
}

export default ({
  data,
  columns,
  sourceCode,
  columnResize,
}: ColumnResizeProps) => {
  return (
    <div>
      <BootstrapTable
        keyField="id"
        data={data}
        columns={columns}
        columnResize={columnResize}
      />
      <Code>{sourceCode}</Code>
    </div>
  );
};
