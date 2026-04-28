import { render, screen } from "@testing-library/react";
import React from "react";
import BootstrapTable from "../index";

describe("Row ID", () => {
  const columns = [
    {
      dataField: "id",
      text: "ID",
    },
    {
      dataField: "name",
      text: "Name",
    },
  ];

  const data = [
    {
      id: 1,
      name: "A",
    },
    {
      id: 2,
      name: "B",
    },
  ];

  it("should have default row IDs", () => {
    const { container } = render(
      <BootstrapTable keyField="id" columns={columns} data={data} id="my-table" />
    );
    const rows = container.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(2);
    expect(rows[0].getAttribute("id")).toBe("my-table-row-1");
    expect(rows[1].getAttribute("id")).toBe("my-table-row-2");
  });

  it("should support custom row ID prefix", () => {
    const { container } = render(
      <BootstrapTable
        keyField="id"
        columns={columns}
        data={data}
        id="my-table"
        rowIdPrefix="custom-prefix"
      />
    );
    const rows = container.querySelectorAll("tbody tr");
    expect(rows[0].getAttribute("id")).toBe("custom-prefix-1");
    expect(rows[1].getAttribute("id")).toBe("custom-prefix-2");
  });

  it("should support custom row ID generator function", () => {
    const { container } = render(
      <BootstrapTable
        keyField="id"
        columns={columns}
        data={data}
        id="my-table"
        rowIdPrefix={(row: any, index: number) => `row-${index}-${row.name}`}
      />
    );
    const rows = container.querySelectorAll("tbody tr");
    expect(rows[0].getAttribute("id")).toBe("row-0-A");
    expect(rows[1].getAttribute("id")).toBe("row-1-B");
  });

  it("should have expansion row ID when expanded", () => {
    const expandRow = {
      renderer: (row: any) => <div>Details for {row.name}</div>,
      expanded: [1],
    };
    const { container } = render(
      <BootstrapTable
        keyField="id"
        columns={columns}
        data={data}
        id="my-table"
        expandRow={expandRow}
      />
    );
    const rows = container.querySelectorAll("tbody tr");
    // Row 1, Expansion Row, Row 2
    expect(rows).toHaveLength(3);
    expect(rows[0].getAttribute("id")).toBe("my-table-row-1");
    expect(rows[1].getAttribute("id")).toBe("my-table-row-1-expansion");
    expect(rows[2].getAttribute("id")).toBe("my-table-row-2");
  });
});
