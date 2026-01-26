/* eslint-disable import/no-anonymous-default-export */
import React from "react";

import BootstrapTable from "../../../react-bootstrap-table-ng";
import filterFactory from "../../../react-bootstrap-table-ng-filter";
import ToolkitProvider, {
  ColumnToggle,
} from "../../../react-bootstrap-table-ng-toolkit";
import Code from "../components/common/code-block";

import "../../../react-bootstrap-table-ng-filter/style/react-bootstrap-table-ng-filter.scss";
import "../../../react-bootstrap-table-ng-paginator/style/react-bootstrap-table-ng-paginator.scss";
import "../../../react-bootstrap-table-ng-toolkit/style/react-bootstrap-table-ng-toolkit.scss";
import "../../../react-bootstrap-table-ng/style/react-bootstrap-table-ng.scss";
import "./stylesheet/storybook.scss";
import "./stylesheet/tomorrow.min.css";

const { ToggleList } = ColumnToggle;

interface ColumnToggleProps {
  mode?: any;
  data?: any;
  columns?: any;
  sourceCode?: any;
}

export default ({
  mode,
  data,
  columns,
  sourceCode,
}: ColumnToggleProps) => {
  switch (mode) {
    case "filter":
      return (
        <div>
          <h3>Table will keep the filter/sort state when column toggle</h3>
          <ToolkitProvider
            keyField="id"
            data={data}
            columns={columns}
            columnToggle
          >
            {(props) => (
              <div>
                <ToggleList {...props.columnToggleProps} />
                <hr />
                <BootstrapTable {...props.baseProps} filter={filterFactory()} />
              </div>
            )}
          </ToolkitProvider>
          <Code>{sourceCode}</Code>
        </div>
      );
    case "custom":
      const CustomToggleList = ({ columns, onColumnToggle, toggles }: any) => (
        <div
          className="btn-group btn-group-toggle btn-group-vertical"
          data-toggle="buttons"
        >
          {columns
            .map((column: any) => ({
              ...column,
              toggle: toggles[column.dataField],
            }))
            .map((column: any) => (
              <button
                type="button"
                key={column.dataField}
                className={`btn btn-warning ${column.toggle ? "active" : ""}`}
                data-toggle="button"
                aria-pressed={column.toggle ? "true" : "false"}
                onClick={() => onColumnToggle(column.dataField)}
              >
                {column.text}
              </button>
            ))}
        </div>
      );
      return (
        <div>
          <ToolkitProvider
            keyField="id"
            data={data}
            columns={columns}
            columnToggle
          >
            {(props) => (
              <div>
                <CustomToggleList {...props.columnToggleProps} />
                <hr />
                <BootstrapTable {...props.baseProps} />
              </div>
            )}
          </ToolkitProvider>
          <Code>{sourceCode}</Code>
        </div>
      );
    case "styling":
      return (
        <div>
          <ToolkitProvider
            keyField="id"
            data={data}
            columns={columns}
            columnToggle
          >
            {(props) => (
              <div>
                <ToggleList
                  contextual="success"
                  className="list-custom-class"
                  btnClassName="list-btn-custom-class"
                  {...props.columnToggleProps}
                />
                <hr />
                <BootstrapTable {...props.baseProps} />
              </div>
            )}
          </ToolkitProvider>
          <Code>{sourceCode}</Code>
        </div>
      );
    default:
      return (
        <div>
          <ToolkitProvider
            keyField="id"
            data={data}
            columns={columns}
            columnToggle
          >
            {(props) => (
              <div>
                <ToggleList {...props.columnToggleProps} />
                <hr />
                <BootstrapTable {...props.baseProps} />
              </div>
            )}
          </ToolkitProvider>
          <Code>{sourceCode}</Code>
        </div>
      );
  }
};
