/* eslint-disable import/no-anonymous-default-export */
import React from "react";

import BootstrapTable from "../../../react-bootstrap-table-ng";
import Code from "../components/common/code-block";

import "../../../react-bootstrap-table-ng-filter/style/react-bootstrap-table-ng-filter.scss";
import "../../../react-bootstrap-table-ng-paginator/style/react-bootstrap-table-ng-paginator.scss";
import "../../../react-bootstrap-table-ng-toolkit/style/react-bootstrap-table-ng-toolkit.scss";
import "../../../react-bootstrap-table-ng/style/react-bootstrap-table-ng.scss";
import "./stylesheet/storybook.scss";
import "./stylesheet/tomorrow.min.css";

interface WorkOnRowsProps {
  mode?: string;
  data: any[];
  columns: any[];
  sourceCode?: string;
  sourceCode1?: string;
  sourceCode2?: string;
  rowStyle1?: any;
  rowStyle2?: any;
  rowClasses1?: any;
  rowClasses2?: any;
  hiddenRows?: any[];
  rowEvents?: any;
}

export default ({
  mode,
  data,
  columns,
  sourceCode,
  sourceCode1,
  sourceCode2,
  rowStyle1,
  rowStyle2,
  rowClasses1,
  rowClasses2,
  hiddenRows,
  rowEvents,
}: WorkOnRowsProps) => {
  switch (mode) {
    case "customize":
      return (
        <div>
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            rowStyle={rowStyle1}
            rowClasses={rowClasses1}
          />
          <Code>{sourceCode1}</Code>
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            rowStyle={rowStyle2}
            rowClasses={rowClasses2}
          />
          <Code>{sourceCode2}</Code>
        </div>
      );
    default:
      return (
        <div>
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columns}
            hiddenRows={hiddenRows}
            rowEvents={rowEvents}
          />
          <Code>{sourceCode}</Code>
        </div>
      );
  }
};
