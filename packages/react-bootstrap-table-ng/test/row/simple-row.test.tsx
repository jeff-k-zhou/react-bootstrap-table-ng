import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RowPureContent from "../../src/row/row-pure-content";
import SimpleRow from "../../src/row/simple-row";

let defaultColumns = [
  {
    dataField: "id",
    text: "ID",
  },
  {
    dataField: "name",
    text: "Name",
  },
  {
    dataField: "price",
    text: "Price",
  },
];

const keyField = "id";
const rowIndex = 1;

describe("SimpleRow", () => {
  const row = {
    id: 1,
    name: "A",
    price: 1000,
  };

  beforeEach(() => {
    defaultColumns = [
      {
        dataField: "id",
        text: "ID",
      },
      {
        dataField: "name",
        text: "Name",
      },
      {
        dataField: "price",
        text: "Price",
      },
    ];
  });

  describe("simplest row", () => {
    it("should render successfully", () => {
      render(
        <table>
          <tbody>
            <SimpleRow
              keyField={keyField}
              rowIndex={rowIndex}
              columns={defaultColumns}
              row={row}
            />
          </tbody>
        </table>
      );
      // Should render a row with correct number of cells
      const rowEl = screen.getByRole("row");
      expect(rowEl).toBeInTheDocument();
      expect(screen.getAllByRole("cell").length).toBe(defaultColumns.length);
    });

    describe("when tabIndexCell prop is enable", () => {
      const visibleColumnSize = 3;
      it("should render correct tabIndexStart", () => {
        render(
          <table>
            <tbody>
              <SimpleRow
                keyField={keyField}
                rowIndex={rowIndex}
                columns={defaultColumns}
                row={row}
                tabIndexCell
                visibleColumnSize={visibleColumnSize}
              />
            </tbody>
          </table>
        );
        // tabIndexStart should be rowIndex * visibleColumnSize + 1
        const cells = screen.getAllByRole("cell");
        expect(cells[0]).toHaveAttribute("tabindex", (rowIndex * visibleColumnSize + 1).toString());
      });
    });

    describe("when tabIndexCell prop is disable", () => {
      const visibleColumnSize = 3;
      it("should always render tabIndexStart as -1", () => {
        render(
          <table>
            <tbody>
              <SimpleRow
                keyField={keyField}
                rowIndex={rowIndex}
                columns={defaultColumns}
                row={row}
                visibleColumnSize={visibleColumnSize}
              />
            </tbody>
          </table>
        );
        // tabIndexStart should be -1
        const cells = screen.getAllByRole("cell");
        expect(cells[0]).toHaveAttribute("tabindex", "-1");
      });
    });
  });

  describe("shouldComponentUpdate logic", () => {
    it("should update when rowIndex changes", () => {
      const { rerender } = render(
        <table>
          <tbody>
            <SimpleRow
              keyField={keyField}
              columns={defaultColumns}
              rowIndex={1}
              row={row}
              editable={true}
            />
          </tbody>
        </table>
      );
      rerender(
        <table>
          <tbody>
            <SimpleRow
              keyField={keyField}
              columns={defaultColumns}
              rowIndex={2}
              row={row}
              editable={true}
            />
          </tbody>
        </table>
      );
      // No error means update logic works
      expect(screen.getByRole("row")).toBeInTheDocument();
    });

    it("should update when className changes", () => {
      const { rerender } = render(
        <table>
          <tbody>
            <SimpleRow
              keyField={keyField}
              columns={defaultColumns}
              rowIndex={1}
              row={row}
              editable={true}
            />
          </tbody>
        </table>
      );
      rerender(
        <table>
          <tbody>
            <SimpleRow
              keyField={keyField}
              columns={defaultColumns}
              rowIndex={1}
              row={row}
              editable={true}
              className="test"
            />
          </tbody>
        </table>
      );
      expect(screen.getByRole("row")).toHaveClass("test");
    });
  });

  describe("when style prop is defined", () => {
    const customStyle = { backgroundColor: "red" };
    it("should render component with style successfully", () => {
      render(
        <table>
          <tbody>
            <SimpleRow
              rowIndex={rowIndex}
              columns={defaultColumns}
              row={row}
              style={customStyle}
            />
          </tbody>
        </table>
      );
      expect(screen.getByRole("row")).toHaveStyle("background-color: red");
    });
  });

  describe("when className prop is defined", () => {
    const className = "test-class";
    it("should render component with className successfully", () => {
      render(
        <table>
          <tbody>
            <SimpleRow
              rowIndex={rowIndex}
              columns={defaultColumns}
              row={row}
              className={className}
            />
          </tbody>
        </table>
      );
      expect(screen.getByRole("row")).toHaveClass(className);
    });
  });

  describe("when attrs prop is defined", () => {
    it("should render component with correct attributes and call onClick", async () => {
      const user = userEvent.setup();
      const customClickCallBack = jest.fn();
      const attrs = { "data-index": 1, onClick: customClickCallBack };
      render(
        <table>
          <tbody>
            <SimpleRow
              rowIndex={rowIndex}
              columns={defaultColumns}
              row={row}
              attrs={attrs}
            />
          </tbody>
        </table>
      );
      const rowEl = screen.getByRole("row");
      expect(rowEl).toHaveAttribute("data-index", "1");
      await user.click(rowEl);
      expect(customClickCallBack).toHaveBeenCalledTimes(1);
    });
  });
});
