import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FiltersCell from "../src/filters-cell.tsx";

const MockFilter = ({ onFilter, column }: any) => (
  <input data-testid={`filter-${column.dataField}`} />
);

describe("FiltersCell", () => {
  it("renders a cell with filter component when column.filter is set", () => {
    const column = {
      dataField: "name",
      text: "Name",
      filter: { Filter: MockFilter, props: { type: "TEXT" } },
    };
    render(
      <table>
        <tbody>
          <tr>
            <FiltersCell
              index={0}
              column={column}
              currFilters={{ name: { filterVal: "" } }}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByTestId("filter-name")).toBeInTheDocument();
  });

  it("renders custom filterRenderer when provided", () => {
    const onExternalFilter = jest.fn().mockReturnValue(jest.fn());
    const filterRenderer = jest.fn().mockReturnValue(<span data-testid="custom">Custom</span>);
    const column = {
      dataField: "status",
      text: "Status",
      filterRenderer,
      filter: { props: { type: "TEXT" } },
    };
    render(
      <table>
        <tbody>
          <tr>
            <FiltersCell
              index={0}
              column={column}
              onExternalFilter={onExternalFilter}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
    expect(filterRenderer).toHaveBeenCalled();
    expect(onExternalFilter).toHaveBeenCalled();
  });

  it("renders an empty cell when no filter and no filterRenderer", () => {
    const column = { dataField: "id", text: "ID" };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <FiltersCell index={0} column={column} />
          </tr>
        </tbody>
      </table>
    );
    const cell = container.querySelector("th") || container.querySelector("td");
    expect(cell).toBeInTheDocument();
  });

  it("applies textAlign when headerAlign is a string", () => {
    const column = {
      dataField: "id",
      text: "ID",
      headerAlign: "right",
    };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <FiltersCell index={0} column={column} cellEl="th" />
          </tr>
        </tbody>
      </table>
    );
    const cell = container.querySelector("th");
    expect((cell as HTMLElement)?.style.textAlign).toBe("right");
  });

  it("applies textAlign when headerAlign is a function", () => {
    const headerAlign = jest.fn().mockReturnValue("center");
    const column = {
      dataField: "id",
      text: "ID",
      headerAlign,
    };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <FiltersCell index={2} column={column} cellEl="th" />
          </tr>
        </tbody>
      </table>
    );
    expect(headerAlign).toHaveBeenCalledWith(column, 2);
    const cell = container.querySelector("th");
    expect((cell as HTMLElement)?.style.textAlign).toBe("center");
  });

  it("renders td when cellEl is td", () => {
    const column = { dataField: "id", text: "ID" };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <FiltersCell index={0} column={column} cellEl="td" />
          </tr>
        </tbody>
      </table>
    );
    expect(container.querySelector("td")).toBeInTheDocument();
  });

  it("includes sr-only text for accessibility", () => {
    const column = { dataField: "id", text: "ID" };
    render(
      <table>
        <tbody>
          <tr>
            <FiltersCell index={0} column={column} />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText("Filter for ID")).toBeInTheDocument();
  });

  it("falls back to dataField in sr-only text when text is missing", () => {
    const column = { dataField: "myField" };
    render(
      <table>
        <tbody>
          <tr>
            <FiltersCell index={0} column={column as any} />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText("Filter for myField")).toBeInTheDocument();
  });

  it("executes default onExternalFilter fallback when column.filterRenderer is present without onExternalFilter prop", () => {
    const filterRenderer = jest.fn((onCustomFilter, col) => <span data-testid="custom-renderer">Custom</span>);
    const column = {
      dataField: "name",
      text: "Name",
      filterRenderer,
      filter: { props: { type: "TEXT" } },
    };
    render(
      <table>
        <tbody>
          <tr>
            <FiltersCell index={0} column={column} />
          </tr>
        </tbody>
      </table>
    );
    expect(filterRenderer).toHaveBeenCalled();
  });

  it("executes default onFilter fallback when filter component triggers onFilter", () => {
    const TriggerFilter = ({ onFilter }: any) => {
      onFilter("test");
      return <span data-testid="trigger-filter">Trigger</span>;
    };
    const column = {
      dataField: "name",
      text: "Name",
      filter: { Filter: TriggerFilter, props: {} },
    };
    render(
      <table>
        <tbody>
          <tr>
            <FiltersCell index={0} column={column} currFilters={{}} />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByTestId("trigger-filter")).toBeInTheDocument();
  });
});

