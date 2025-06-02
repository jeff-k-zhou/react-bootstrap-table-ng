import { render, screen } from "@testing-library/react";
import React from "react";

import { INDICATOR_POSITION_RIGHT, SORT_ASC } from "..";
import createExpansionContext from "../src/contexts/row-expand-context";
import createSelectionContext from "../src/contexts/selection-context";
import Header from "../src/header";
import HeaderCell from "../src/header-cell";
import ExpandHeaderCell from "../src/row-expand/expand-header-cell";
import SelectionHeaderCell from "../src/row-selection/selection-header-cell";
import mockHeaderResolvedProps from "./test-helpers/mock/header-resolved-props";

describe("Header", () => {
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

  const keyField = "id";

  const ExpansionContext = createExpansionContext();
  const SelectionContext = createSelectionContext();

  describe("simplest header", () => {
    it("should render successfully", () => {
      render(
        <table>
          <thead>
            <Header {...mockHeaderResolvedProps} columns={columns} />
          </thead>
        </table>
      );
      const row = screen.getByRole("row");
      expect(row).toBeInTheDocument();
      const headers = screen.getAllByRole("columnheader");
      expect(headers.length).toBe(columns.length);
      expect(screen.getByText("ID")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
    });
  });

  describe("className prop is exists", () => {
    const className = "test-class";

    it("should render successfully", () => {
      render(
        <table>
          <thead>
            <Header
              {...mockHeaderResolvedProps}
              columns={columns}
              className={className}
            />
          </thead>
        </table>
      );
      // Thead or tr should have the class
      expect(screen.getByRole("row").parentElement).toHaveClass(className);
    });
  });

  describe("header with columns enable sort", () => {
    const sortField = columns[1].dataField;

    it("The HeaderCell should receive correct sorting props", () => {
      render(
        <table>
          <thead>
            <Header
              {...mockHeaderResolvedProps}
              columns={columns}
              sortField={sortField}
              sortOrder={SORT_ASC}
            />
          </thead>
        </table>
      );
      // The second header cell should have aria-label for sorting
      const headers = screen.getAllByRole("columnheader");
      expect(headers.length).toBe(columns.length);
      expect(headers[0].getAttribute("aria-label")).not.toContain("sort");
      expect(headers[1].getAttribute("aria-label")).toContain("sort");
    });
  });

  describe("selectRow", () => {
    describe("when selectRow.mode is ROW_SELECT_DISABLED (row is not able to select)", () => {
      it("should not render <SelectionHeaderCell />", () => {
        render(
          <table>
            <thead>
              <Header {...mockHeaderResolvedProps} columns={columns} />
            </thead>
          </table>
        );
        // Should not find any checkbox/radio header cell
        expect(screen.getAllByRole("columnheader").length).toBe(columns.length);
      });
    });

    describe("when selectRow.mode is radio (single selection)", () => {
      it("should render <SelectionHeaderCell />", () => {
        const selectRow = { mode: "radio" };
        render(
          <SelectionContext.Provider
            data={data}
            keyField={keyField}
            selectRow={selectRow}
          >
            <table>
              <thead>
                <Header
                  {...mockHeaderResolvedProps}
                  columns={columns}
                  selectRow={selectRow}
                />
              </thead>
            </table>
          </SelectionContext.Provider>
        );
        // Should have one more columnheader for selection
        expect(screen.getAllByRole("columnheader").length).toBe(columns.length + 1);
      });

      describe("when selectRow.hideSelectColumn is true", () => {
        it("should not render <SelectionHeaderCell />", () => {
          const selectRow = { mode: "radio", hideSelectColumn: true };
          render(
            <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
              <table>
                <thead>
                  <Header
                    {...mockHeaderResolvedProps}
                    columns={columns}
                    selectRow={selectRow}
                  />
                </thead>
              </table>
            </SelectionContext.Provider>
          );
          expect(screen.getAllByRole("columnheader").length).toBe(columns.length);
        });
      });
    });

    describe("when selectRow.mode is checkbox (multiple selection)", () => {
      it("should render <SelectionHeaderCell />", () => {
        const selectRow = { mode: "checkbox" };
        render(
          <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRow}>
            <table>
              <thead>
                <Header
                  {...mockHeaderResolvedProps}
                  columns={columns}
                  selectRow={selectRow}
                />
              </thead>
            </table>
          </SelectionContext.Provider>
        );
        expect(screen.getAllByRole("columnheader").length).toBe(columns.length + 1);
      });

      describe("when selectRow.hideSelectColumn is true", () => {
        it("should not render <SelectionHeaderCell />", () => {
          const selectRow = { mode: "checkbox", hideSelectColumn: true };
          render(
            <SelectionContext.Provider
              data={data}
              keyField={keyField}
              selectRow={selectRow}
            >
              <table>
                <thead>
                  <Header
                    {...mockHeaderResolvedProps}
                    columns={columns}
                    selectRow={selectRow}
                  />
                </thead>
              </table>
            </SelectionContext.Provider>
          );
          expect(screen.getAllByRole("columnheader").length).toBe(columns.length);
        });
      });
    });
  });

  describe("expandRow", () => {
    describe("when expandRow.showExpandColumn is false", () => {
      it("should not render <ExpandHeaderCell />", () => {
        render(
          <table>
            <thead>
              <Header {...mockHeaderResolvedProps} columns={columns} />
            </thead>
          </table>
        );
        // Should not find any extra columnheader
        expect(screen.getAllByRole("columnheader").length).toBe(columns.length);
      });
    });

    describe("when expandRow.showExpandColumn is true", () => {
      it("should render <ExpandHeaderCell /> correctly", () => {
        const expandRow = {
          renderer: jest.fn(),
          expanded: [],
          showExpandColumn: true,
        };
        render(
          <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
            <table>
              <thead>
                <Header
                  {...mockHeaderResolvedProps}
                  columns={columns}
                  expandRow={expandRow}
                />
              </thead>
            </table>
          </ExpansionContext.Provider>
        );
        // Should have one more columnheader for expand
        expect(screen.getAllByRole("columnheader").length).toBe(columns.length + 1);
      });
    });

    describe('if props.expandRow.showExpandColumn is true but props.expandRow.expandColumnPosition is "right"', () => {
      it("should render expansion column correctly at the end", () => {
        const expandRow = {
          renderer: jest.fn(),
          showExpandColumn: true,
          expandColumnPosition: INDICATOR_POSITION_RIGHT,
        };
        render(
          <ExpansionContext.Provider data={data} keyField={keyField} expandRow={expandRow}>
            <table>
              <thead>
                <Header
                  {...mockHeaderResolvedProps}
                  columns={columns}
                  expandRow={expandRow}
                />
              </thead>
            </table>
          </ExpansionContext.Provider>
        );
        // The last columnheader should be the expand column
        const headers = screen.getAllByRole("columnheader");
        expect(headers.length).toBe(columns.length + 1);
      });
    });
  });
});
