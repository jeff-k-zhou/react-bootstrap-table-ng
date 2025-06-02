/* eslint no-unused-vars: 0 */
import { render, screen } from "@testing-library/react";
import React from "react";

import { ROW_SELECT_DISABLED, SelectRowProps } from "..";
import Footer from "../src/footer";

describe("Footer", () => {
  const columns = [
    {
      dataField: "id",
      text: "ID",
      footer: "Footer 1",
    },
    {
      dataField: "name",
      text: "Name",
      footer: (columnData: any, column: any) => "Footer 2",
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

  const selectRow: SelectRowProps<any> = {
    mode: ROW_SELECT_DISABLED,
    selected: [],
    hideSelectColumn: true,
  };
  const expandRow = {
    renderer: undefined,
    expanded: [],
    nonExpandable: [],
  };

  const keyField = "id";

  describe("simplest footer", () => {
    it("should render successfully", () => {
      render(
        <table>
          <tfoot>
            <Footer
              data={data}
              columns={columns}
              selectRow={selectRow}
              expandRow={expandRow}
            />
          </tfoot>
        </table>
      );
      const row = screen.getByRole("row");
      expect(row).toBeInTheDocument();
      const headers = screen.getAllByRole("columnheader");
      expect(headers.length).toBe(columns.length);
      expect(screen.getByText("Footer 1")).toBeInTheDocument();
      expect(screen.getByText("Footer 2")).toBeInTheDocument();
    });
  });

  describe("className prop is exists", () => {
    const className = "test-class";

    it("should render successfully", () => {
      render(
        <table>
          <tfoot>
            <Footer
              data={data}
              columns={columns}
              className={className}
              selectRow={selectRow}
              expandRow={expandRow}
            />
          </tfoot>
        </table>
      );
      expect(screen.getByRole("row").parentElement).toHaveClass(className);
    });
  });

  describe("when selectRow prop is enable", () => {
    it("should render successfully", () => {
      render(
        <table>
          <tfoot>
            <Footer
              data={data}
              columns={columns}
              selectRow={{ ...selectRow, mode: "radio", hideSelectColumn: false }}
              expandRow={expandRow}
            />
          </tfoot>
        </table>
      );
      const headers = screen.getAllByRole("columnheader");
      expect(headers.length).toBe(columns.length + 1);
    });
  });

  describe("when expandRow prop is enable", () => {
    it("should render successfully", () => {
      render(
        <table>
          <tfoot>
            <Footer
              data={data}
              columns={columns}
              selectRow={selectRow}
              expandRow={{ ...expandRow, showExpandColumn: true }}
            />
          </tfoot>
        </table>
      );
      const headers = screen.getAllByRole("columnheader");
      expect(headers.length).toBe(columns.length + 1);
    });
  });
});
