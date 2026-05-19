import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import React from "react";
import BootstrapTable from "../src/bootstrap-table";

expect.extend(toHaveNoViolations);

describe("BootstrapTable Accessibility", () => {
  const columns = [
    { dataField: "id", text: "ID", sort: true },
    { dataField: "name", text: "Product Name" },
  ];

  const data = [
    { id: 1, name: "Item A" },
    { id: 2, name: "Item B" },
  ];

  it("should have no accessibility violations for a basic table", async () => {
    const { container } = render(
      <BootstrapTable keyField="id" data={data} columns={columns} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with selection and expansion", async () => {
    const selectRow = {
      mode: "checkbox",
      clickToSelect: true,
    };
    const expandRow = {
      renderer: (row: any) => <div>Expanded content for {row.name}</div>,
      showExpandColumn: true,
    };

    const { container } = render(
      <BootstrapTable
        keyField="id"
        data={data}
        columns={columns}
        selectRow={selectRow as any}
        expandRow={expandRow as any}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no accessibility violations with a caption", async () => {
    const { container } = render(
      <BootstrapTable
        keyField="id"
        data={data}
        columns={columns}
        caption="Product Inventory"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
