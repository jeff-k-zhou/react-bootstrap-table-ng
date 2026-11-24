import React from "react";
import { render, screen } from "@testing-library/react";
import RowTemplate from "../../src/row/row-template";
import { INDICATOR_POSITION_LEFT, INDICATOR_POSITION_RIGHT } from "../../src/const";

describe("RowTemplate", () => {
  it("renders content with cellEl=th and defaults", () => {
    render(
      <table>
        <tbody>
          <RowTemplate
            cellEl="th"
            renderContent={() => [<th key="col1">Col1</th>]}
          />
        </tbody>
      </table>
    );
    expect(screen.getByText("Col1")).toBeInTheDocument();
  });

  it("handles selectRow and expandRow positioned on the right", () => {
    const { container } = render(
      <table>
        <tbody>
          <RowTemplate
            cellEl="td"
            renderContent={() => [<td key="col1">Data</td>]}
            selectRow={{
              mode: "checkbox",
              selectColumnPosition: INDICATOR_POSITION_RIGHT,
            }}
            expandRow={{
              showExpandColumn: true,
              expandColumnPosition: INDICATOR_POSITION_RIGHT,
            }}
          />
        </tbody>
      </table>
    );
    const cells = container.querySelectorAll("td");
    expect(cells.length).toBe(3);
    // Data is first, then selection, then expansion
    expect(cells[0].textContent).toBe("Data");
    expect(cells[1].textContent).toBe("Selection column");
    expect(cells[2].textContent).toBe("Expand row column");
  });

  it("handles selectRow and expandRow positioned on the left", () => {
    const { container } = render(
      <table>
        <tbody>
          <RowTemplate
            cellEl="td"
            renderContent={() => [<td key="col1">Data</td>]}
            selectRow={{
              mode: "checkbox",
              selectColumnPosition: INDICATOR_POSITION_LEFT,
            }}
            expandRow={{
              showExpandColumn: true,
              expandColumnPosition: INDICATOR_POSITION_LEFT,
            }}
          />
        </tbody>
      </table>
    );
    const cells = container.querySelectorAll("td");
    expect(cells.length).toBe(3);
  });

  it("handles renderContent returning undefined or null", () => {
    const { container } = render(
      <table>
        <tbody>
          <RowTemplate cellEl="td" renderContent={() => null} />
        </tbody>
      </table>
    );
    expect(container.querySelector("tr")).toBeInTheDocument();
  });
});
