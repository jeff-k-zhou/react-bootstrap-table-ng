import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import BootstrapTable from "../src/bootstrap-table";
import withContext from "../src/contexts/index";

const BootstrapTableWithContext = withContext(BootstrapTable);

describe("Core Column Resizing", () => {
  const columns = [
    {
      dataField: "id",
      text: "ID",
      width: 100,
      resizable: true,
    },
    {
      dataField: "name",
      text: "Name",
      width: 200,
      resizable: true,
    },
  ];

  const data = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
  ];

  it("should render resizer handles when resizable is true", () => {
    render(
      <BootstrapTableWithContext
        keyField="id"
        data={data}
        columns={columns}
        columnResize
      />
    );

    const resizers = document.querySelectorAll(".react-bootstrap-table-column-resizer");
    expect(resizers.length).toBe(2);

    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveStyle("position: relative");
    expect(headers[1]).toHaveStyle("position: relative");
  });

  it("should update column width on drag", () => {
    render(
      <BootstrapTableWithContext
        keyField="id"
        data={data}
        columns={columns}
        columnResize
      />
    );

    const resizer = document.querySelectorAll(".react-bootstrap-table-column-resizer")[0];
    const header = resizer.parentElement!;
    const initialWidth = header.getBoundingClientRect().width;

    // We can't easily test real dragging with getBoundingClientRect in JSDOM
    // But we can check if the onColumnResize handler is called and state is updated
    // by checking the style of the header after the simulated events.
    
    // Actually, ColumnResizer uses pageX and offsetWidth which might not work well in JSDOM
    // Let's mock offsetWidth for the parent
    Object.defineProperty(header, 'offsetWidth', { configurable: true, value: 100 });

    act(() => {
      fireEvent.mouseDown(resizer, { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 150 });
      fireEvent.mouseUp(document);
    });

    // After resize, the header should have the new width in its style (via props)
    const th = screen.getAllByRole("columnheader")[0];
    // console.log(th.getAttribute('style'));
    expect(th).toHaveStyle("width: 150px");
  });

  it("should not render resizer handles if resizable is false for a column", () => {
    const mixedColumns = [
      { dataField: "id", text: "ID", resizable: false },
      { dataField: "name", text: "Name", resizable: true },
    ];
    render(
      <BootstrapTableWithContext
        keyField="id"
        data={data}
        columns={mixedColumns}
        columnResize
      />
    );

    const resizers = document.querySelectorAll(".react-bootstrap-table-column-resizer");
    expect(resizers.length).toBe(1);
  });
  it("should render percentage width when column.width is a percentage string", () => {
    const columnsWithPercentage = [
      {
        dataField: "id",
        text: "ID",
        width: "50%",
      },
      {
        dataField: "name",
        text: "Name",
        width: "50%",
      },
    ];
    render(
      <BootstrapTable
        keyField="id"
        data={data}
        columns={columnsWithPercentage}
      />
    );
    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveStyle("width: 50%");
    expect(headers[1]).toHaveStyle("width: 50%");
  });
});
