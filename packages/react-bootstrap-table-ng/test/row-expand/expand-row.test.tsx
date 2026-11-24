import React from "react";
import { render, screen } from "@testing-library/react";
import ExpandRow from "../../src/row-expand/expand-row";

describe("ExpandRow", () => {
  it("renders with default props (expanded=false, className='')", () => {
    render(
      <table>
        <tbody>
          <ExpandRow colSpan={4}>Expanded Content</ExpandRow>
        </tbody>
      </table>
    );
    const cell = screen.getByRole("cell");
    expect(cell).toHaveAttribute("colspan", "4");
    expect(cell).toHaveClass("reset-expansion-style");
    expect(screen.getByText("Expanded Content")).toBeInTheDocument();
  });

  it("renders with custom className and id", () => {
    render(
      <table>
        <tbody>
          <ExpandRow
            colSpan={2}
            id="exp-row-1"
            className="custom-exp"
            expanded={true}
          >
            Details
          </ExpandRow>
        </tbody>
      </table>
    );
    const cell = screen.getByRole("cell");
    expect(cell).toHaveClass("reset-expansion-style", "custom-exp");
    expect(screen.getByText("Details")).toBeInTheDocument();
  });
});
