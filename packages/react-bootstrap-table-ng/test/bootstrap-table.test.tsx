import { render, screen } from "@testing-library/react";
import React from "react";

import Body from "../src/body";
import BootstrapTable from "../src/bootstrap-table";
import Caption from "../src/caption";
import Header from "../src/header";

describe("BootstrapTable", () => {
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

  describe("simplest table", () => {
    it("should render successfully", () => {
      render(<BootstrapTable keyField="id" columns={columns} data={data} />);
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
      expect(table).toHaveClass("table", "table-bordered");
      // Header and Body are rendered as children, check for their content
      expect(screen.getByText("ID")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
    });

    it("should only have classes 'table' and 'table-bordered' as default", () => {
      render(<BootstrapTable keyField="id" columns={columns} data={data} />);
      const table = screen.getByRole("table");
      expect(table.className).toBe("table table-bordered");
    });

    it("should have customized id as default", () => {
      render(<BootstrapTable keyField="id" columns={columns} data={data} />);
      const table = screen.getByRole("table");
      expect(table.getAttribute("id")).not.toBeNull();
    });
  });

  describe("rendered data", () => {
    it("should render the correct number of rows", () => {
      render(<BootstrapTable keyField="id" columns={columns} data={data} />);
      const rows = screen.getAllByRole("row");
      // 1 header row + 2 data rows
      expect(rows).toHaveLength(3);
    });

    it("should render data content correctly", () => {
      render(<BootstrapTable keyField="id" columns={columns} data={data} />);
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
    });
  });

  describe("when props.classes was defined", () => {
    const classes = "foo";

    it("should display customized classes correctly", () => {
      render(
        <BootstrapTable
          keyField="id"
          columns={columns}
          data={data}
          classes={classes}
        />
      );
      const table = screen.getByRole("table");
      expect(table.className).toContain(classes);
    });
  });

  describe("when props.wrapperClasses was defined", () => {
    const classes = "foo";

    it("should display customized classes correctly", () => {
      render(
        <BootstrapTable
          keyField="id"
          columns={columns}
          data={data}
          wrapperClasses={classes}
        />
      );
      // The wrapper div should have the custom class
      const wrapper = screen.getByRole("table").parentElement;
      expect(wrapper).toHaveClass(classes);
    });
  });

  describe("when props.id was defined", () => {
    const id = "foo";

    it("should display customized id correctly", () => {
      render(
        <BootstrapTable keyField="id" columns={columns} data={data} id={id} />
      );
      const table = screen.getByRole("table");
      expect(table.getAttribute("id")).toBe(id);
    });
  });

  describe("when hover props is true", () => {
    it("should have table-hover class on table", () => {
      render(
        <BootstrapTable keyField="id" columns={columns} data={data} hover />
      );
      const table = screen.getByRole("table");
      expect(table.className).toContain("table-hover");
    });
  });

  describe("when striped props is true", () => {
    it("should have table-striped class on table", () => {
      render(
        <BootstrapTable keyField="id" columns={columns} data={data} striped />
      );
      const table = screen.getByRole("table");
      expect(table.className).toContain("table-striped");
    });
  });

  describe("when condensed props is true", () => {
    it("should have table-condensed class on table", () => {
      render(
        <BootstrapTable keyField="id" columns={columns} data={data} condensed />
      );
      const table = screen.getByRole("table");
      expect(table.className).toContain("table-condensed");
    });
  });

  describe("when bordered props is false", () => {
    it("should not have table-bordered class on table", () => {
      render(
        <BootstrapTable
          keyField="id"
          columns={columns}
          data={data}
          bordered={false}
        />
      );
      const table = screen.getByRole("table");
      expect(table.className).not.toContain("table-bordered");
    });
  });

  describe("when table should have a caption", () => {
    it("should render caption correctly", () => {
      render(
        <BootstrapTable
          caption={<span className="table-caption">test</span>}
          keyField="id"
          columns={columns}
          data={data}
          bordered={false}
        />
      );
      // Caption is rendered as a child, so check for its content
      expect(screen.getByText("test")).toBeInTheDocument();
      expect(screen.getByText("test")).toHaveClass("table-caption");
    });
  });

  describe("cellExpandable", () => {
    it("should have expandable-cell class on data cell by default", () => {
      render(<BootstrapTable keyField="id" columns={columns} data={data} />);
      const cells = screen.getAllByRole("cell");
      cells.forEach((cell) => {
        expect(cell).toHaveClass("expandable-cell");
      });
    });

    it("should have expandable-cell class on data cell when cellExpandable prop is true", () => {
      render(
        <BootstrapTable
          keyField="id"
          columns={columns}
          data={data}
          cellExpandable
        />
      );
      const cells = screen.getAllByRole("cell");
      cells.forEach((cell) => {
        expect(cell).toHaveClass("expandable-cell");
      });
    });

    it("should not have expandable-cell class on data cell when cellExpandable prop is false", () => {
      render(
        <BootstrapTable
          keyField="id"
          columns={columns}
          data={data}
          cellExpandable={false}
        />
      );
      const cells = screen.getAllByRole("cell");
      cells.forEach((cell) => {
        expect(cell).not.toHaveClass("expandable-cell");
      });
    });

    it("should not have expandable-cell class on data cell when column.cellExpandable is false", () => {
      const columnWithExpandableFalse = [
        {
          dataField: "id",
          text: "ID",
          cellExpandable: false,
        },
        {
          dataField: "name",
          text: "Name",
        },
      ];
      render(
        <BootstrapTable
          keyField="id"
          columns={columnWithExpandableFalse}
          data={data}
        />
      );
      const idCells = screen.getAllByRole("cell").filter((cell) => {
        const text = cell.textContent;
        return text === "1" || text === "2";
      });
      const nameCells = screen.getAllByRole("cell").filter((cell) => {
        const text = cell.textContent;
        return text === "A" || text === "B";
      });

      idCells.forEach((cell) => {
        expect(cell).not.toHaveClass("expandable-cell");
      });
      nameCells.forEach((cell) => {
        expect(cell).toHaveClass("expandable-cell");
      });
    });

    it("should have expandable-cell class on data cell when column.cellExpandable is true while cellExpandable prop is false", () => {
      const columnWithExpandableTrue = [
        {
          dataField: "id",
          text: "ID",
          cellExpandable: true,
        },
        {
          dataField: "name",
          text: "Name",
        },
      ];
      render(
        <BootstrapTable
          keyField="id"
          columns={columnWithExpandableTrue}
          data={data}
          cellExpandable={false}
        />
      );
      const idCells = screen.getAllByRole("cell").filter((cell) => {
        const text = cell.textContent;
        return text === "1" || text === "2";
      });
      const nameCells = screen.getAllByRole("cell").filter((cell) => {
        const text = cell.textContent;
        return text === "A" || text === "B";
      });

      idCells.forEach((cell) => {
        expect(cell).toHaveClass("expandable-cell");
      });
      nameCells.forEach((cell) => {
        expect(cell).not.toHaveClass("expandable-cell");
      });
    });
  });

  describe("imperative ref, onDataSizeChange, overlay, and condensed bootstrap5", () => {
    it("exposes getData and props.data on ref", () => {
      const ref = React.createRef<any>();
      render(<BootstrapTable ref={ref} keyField="id" columns={columns} data={data} />);
      expect(ref.current?.getData()).toEqual(data);
      expect(ref.current?.props.data).toEqual(data);
    });

    it("triggers onDataSizeChange when pagination is not present", () => {
      const onDataSizeChange = jest.fn();
      render(
        <BootstrapTable
          keyField="id"
          columns={columns}
          data={data}
          onDataSizeChange={onDataSizeChange}
        />
      );
      expect(onDataSizeChange).toHaveBeenCalledWith({ dataSize: data.length });
    });

    it("renders with overlay when overlay factory is provided", () => {
      const dummyOverlay = (loading: boolean) => ({ children, active }: any) => (
        <div data-testid="test-overlay" data-active={active}>
          {children}
        </div>
      );
      render(
        <BootstrapTable
          keyField="id"
          columns={columns}
          data={data}
          overlay={dummyOverlay}
          loading={true}
        />
      );
      const overlayEl = screen.getByTestId("test-overlay");
      expect(overlayEl).toBeInTheDocument();
      expect(overlayEl).toHaveAttribute("data-active", "true");
    });

    it("applies table-sm when condensed and bootstrap5 are true", () => {
      render(
        <BootstrapTable
          keyField="id"
          columns={columns}
          data={data}
          condensed
          bootstrap5
        />
      );
      const table = screen.getByRole("table");
      expect(table).toHaveClass("table-sm");
    });

    it("renders table with caption string, defaultSorted desc for unknown sortField, hasFooter, and filterPosition top", () => {
      const footerColumns = [
        {
          dataField: "id",
          text: "ID",
          footer: "Total ID",
          filter: {
            Filter: () => <div>FilterComponent</div>,
            props: {},
          },
        },
      ];

      render(
        <BootstrapTable
          keyField="id"
          columns={footerColumns}
          data={data}
          caption="Products Table"
          sortField="non_existent_field"
          sortOrder="desc"
          sort={{ sortCaret: jest.fn() }}
          filterPosition="top"
          currFilters={{}}
        />
      );

      const table = screen.getByRole("table");
      expect(table).toHaveAttribute("aria-label", "Products Table");
      expect(screen.getByText("Total ID")).toBeInTheDocument();
      expect(screen.getByText("FilterComponent")).toBeInTheDocument();
      // Status div containing text
      expect(screen.getByText(/Sorted by non_existent_field descending/)).toBeInTheDocument();
    });
  });
});

