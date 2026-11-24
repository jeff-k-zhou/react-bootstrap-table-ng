import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Filters from "../src/filters";

const MockFilterComponent = ({ onFilter, column, filterState }: any) => (
  <input
    data-testid={`filter-${column.dataField}`}
    defaultValue={filterState?.filterVal || ""}
    onChange={(e) => onFilter({ filterVal: e.target.value })}
  />
);

describe("Filters", () => {
  const currFilters = {};
  const columns = [
    {
      dataField: "id",
      text: "ID",
      filter: { Filter: MockFilterComponent, props: { type: "TEXT" } },
    },
    {
      dataField: "name",
      text: "Name",
    },
    {
      dataField: "status",
      text: "Status",
      filterRenderer: (onFilter: any, column: any) => (
        <button data-testid="custom-filter" onClick={() => onFilter("active")}>
          Filter
        </button>
      ),
    },
  ];

  const onFilter = jest.fn();
  const onExternalFilter = jest.fn().mockReturnValue(jest.fn());

  it("renders filters as tbody", () => {
    const { container } = render(
      <table>
        <Filters columns={columns} onFilter={onFilter} currFilters={currFilters} />
      </table>
    );
    const tbody = container.querySelector("tbody");
    expect(tbody).toBeInTheDocument();
  });

  it("renders filter for column with filter prop", () => {
    render(
      <table>
        <Filters columns={columns} onFilter={onFilter} currFilters={currFilters} />
      </table>
    );
    expect(screen.getByTestId("filter-id")).toBeInTheDocument();
  });

  it("renders custom filterRenderer", () => {
    render(
      <table>
        <Filters
          columns={columns}
          onFilter={onFilter}
          onExternalFilter={onExternalFilter}
          currFilters={currFilters}
        />
      </table>
    );
    expect(screen.getByTestId("custom-filter")).toBeInTheDocument();
  });

  it("renders in table-footer-group when filterPosition is not TOP", () => {
    const { container } = render(
      <table>
        <Filters columns={columns} filterPosition="bottom" currFilters={currFilters} />
      </table>
    );
    const tbody = container.querySelector("tbody");
    expect((tbody as HTMLElement)?.style.display).toBe("table-footer-group");
  });

  it("renders in table-header-group when filterPosition is TOP (default)", () => {
    const { container } = render(
      <table>
        <Filters columns={columns} currFilters={currFilters} />
      </table>
    );
    const tbody = container.querySelector("tbody");
    expect((tbody as HTMLElement)?.style.display).toBe("table-header-group");
  });

  it("passes currFilters to filter components", () => {
    const populatedFilters = { id: { filterVal: "42" } };
    render(
      <table>
        <Filters
          columns={columns}
          onFilter={onFilter}
          currFilters={populatedFilters}
        />
      </table>
    );
    const filterInput = screen.getByTestId("filter-id") as HTMLInputElement;
    expect(filterInput.defaultValue).toBe("42");
  });

  it("applies className to tbody", () => {
    const { container } = render(
      <table>
        <Filters columns={columns} className="my-filters" currFilters={currFilters} />
      </table>
    );
    expect(container.querySelector(".my-filters")).toBeInTheDocument();
  });
});
