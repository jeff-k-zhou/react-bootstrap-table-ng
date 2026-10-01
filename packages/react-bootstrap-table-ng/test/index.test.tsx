import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BootstrapTable, {
  ROW_SELECT_SINGLE,
  ROW_SELECT_MULTIPLE,
  ROW_SELECT_DISABLED,
  CHECKBOX_STATUS_CHECKED,
  FILTERS_POSITION_TOP,
} from "../index";

describe("react-bootstrap-table-ng index exports and default component", () => {
  it("exports constants", () => {
    expect(ROW_SELECT_SINGLE).toBe("radio");
    expect(ROW_SELECT_MULTIPLE).toBe("checkbox");
    expect(ROW_SELECT_DISABLED).toBe("ROW_SELECT_DISABLED");
    expect(CHECKBOX_STATUS_CHECKED).toBe("checked");
    expect(FILTERS_POSITION_TOP).toBe("top");
  });

  it("renders BootstrapTable from index default export", () => {
    const columns = [
      { dataField: "id", text: "ID" },
      { dataField: "name", text: "Name" },
    ];
    const data = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
    ];

    render(<BootstrapTable keyField="id" data={data} columns={columns} />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});
