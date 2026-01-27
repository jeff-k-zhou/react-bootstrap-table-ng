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

interface FooterProps {
  data?: any;
  columns?: any;
  sourceCode?: any;
  footerClasses?: any;
}

export default ({
  data,
  columns,
  sourceCode,
  footerClasses,
}: FooterProps) => (
  <div>
    <BootstrapTable
      keyField="id"
      data={data}
      columns={columns}
      footerClasses={footerClasses}
    />
    <Code>{sourceCode}</Code>
  </div>
);
