import React from "react";
import { ColumnDescription } from "react-bootstrap-table-ng";
import { ToggleListProps } from "../..";

const ToggleList = ({
  columns,
  onColumnToggle,
  toggles,
  btnClassName = "",
  className = "",
  contextual = "primary"
}: ToggleListProps): React.ReactElement | null => (
  <div
    className={`btn-group btn-group-toggle ${className}`}
    data-toggle="buttons"
  >
    {columns
      .map((column: ColumnDescription) => ({
        ...column,
        toggle: toggles[column.dataField],
      }))
      .map((column: ColumnDescription) => (
        <button
          type="button"
          key={column.dataField}
          className={`${btnClassName} btn btn-${contextual} ${
            column.toggle ? "active" : ""
          }`}
          data-toggle="button"
          aria-pressed={column.toggle ? "true" : "false"}
          onClick={() => onColumnToggle(column.dataField)}
        >
          {column.text}
        </button>
      ))}
  </div>
);



export default ToggleList;
