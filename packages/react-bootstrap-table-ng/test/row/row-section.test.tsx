import React from "react";
import { render, screen } from "@testing-library/react";

import RowSection from "../../src/row/row-section";

describe("Row", () => {
  const colSpan = 3;
  let content: any;

  describe("simplest row-section", () => {
    beforeEach(() => {
      content = null;
    });

    it("should render successfully", () => {
      render(
        <table>
          <tbody>
            <RowSection content={content} colSpan={colSpan} />
          </tbody>
        </table>
      );
      // Should render a <tr> with a <td>
      const row = screen.getByRole("row");
      expect(row).toBeInTheDocument();
      const cell = screen.getByRole("cell");
      expect(cell).toBeInTheDocument();
      expect(cell).toHaveAttribute("colspan", colSpan.toString());
      expect(cell).toHaveClass("react-bs-table-no-data");
    });
  });
});
