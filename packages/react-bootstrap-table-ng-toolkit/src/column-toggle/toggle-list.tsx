import React, { useState } from "react";
import { ColumnDescription } from "react-bootstrap-table-ng";
import { ToggleListProps } from "../..";

const ToggleList = ({
  columns,
  onColumnToggle,
  toggles,
  btnClassName = "",
  className = "",
  contextual = "primary"
}: ToggleListProps): React.ReactElement | null => {
  const [lastToggled, setLastToggled] = useState<string | null>(null);

  return (
    <div
      className={`btn-group btn-group-toggle ${className}`}
      role="group"
      aria-label="Show or hide columns"
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
            aria-pressed={column.toggle ? "true" : "false"}
            onClick={() => {
              setLastToggled(column.text || column.dataField);
              onColumnToggle(column.dataField);
            }}
          >
            {column.text}
          </button>
        ))}
      <span aria-live="polite" className="sr-only visually-hidden">
        {lastToggled ? `Column ${lastToggled} visibility toggled` : ""}
      </span>
    </div>
  );
};

export default ToggleList;
