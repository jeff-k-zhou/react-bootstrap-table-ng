import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { stub } from "sinon";

import Cell from "../src/cell";

describe("Cell", () => {
  type RowType = {
    [key: string]: number | string | boolean;
  };

  const row: RowType = {
    id: 1,
    name: "A",
  };

  describe("simplest cell", () => {
    const column = {
      dataField: "id",
      text: "ID",
    };

    it("should render successfully", () => {
      render(
        <table>
          <tbody>
            <tr>
              <Cell row={row} columnindex={1} rowindex={1} column={column} />
            </tr>
          </tbody>
        </table>
      );
      expect(screen.getByText(row[column.dataField].toString())).toBeInTheDocument();
    });
  });

  describe("when content is bool value", () => {
    const column = {
      dataField: "col1",
      text: "column 1",
    };
    const aRowWithBoolValue: RowType = { col1: true };

    it("should render successfully", () => {
      render(
        <table>
          <tbody>
            <tr>
              <Cell row={aRowWithBoolValue} columnindex={1} rowindex={1} column={column} />
            </tr>
          </tbody>
        </table>
      );
      expect(screen.getByText(aRowWithBoolValue[column.dataField].toString())).toBeInTheDocument();
    });
  });

  describe("when column.formatter prop is defined", () => {
    const rowindex = 1;
    const column = {
      dataField: "id",
      text: "ID",
      formatExtraData: [],
      formatter: () => {},
    };
    const formatterResult = <h3>{row[column.dataField]}</h3>;
    const formatter = stub()
      .withArgs(row[column.dataField], row, rowindex, column.formatExtraData)
      .returns(formatterResult);
    column.formatter = formatter;

    afterEach(() => {
      formatter.reset();
    });

    it("should render successfully", () => {
      render(
        <table>
          <tbody>
            <tr>
              <Cell row={row} columnindex={1} rowindex={rowindex} column={column} />
            </tr>
          </tbody>
        </table>
      );
      expect(screen.getByText(row[column.dataField].toString())).toBeInTheDocument();
      expect(screen.getByRole("cell").querySelector("h3")).toBeTruthy();
    });

    it("should call custom formatter correctly", () => {
      render(
        <table>
          <tbody>
            <tr>
              <Cell row={row} columnindex={1} rowindex={rowindex} column={column} />
            </tr>
          </tbody>
        </table>
      );
      expect(formatter.callCount).toBe(1);
      expect(
        formatter.calledWith(
          row[column.dataField],
          row,
          rowindex,
          column.formatExtraData
        )
      ).toBe(true);
    });
  });

  describe("when editable prop is true", () => {
    let onStartCallBack: any;
    const rowindex = 1;
    const columnindex = 1;
    const column = {
      dataField: "id",
      text: "ID",
      events: {},
    };

    beforeEach(() => {
      onStartCallBack = stub().withArgs(rowindex, columnindex);
    });

    describe("and clicktoedit is true", () => {
      it("should call onStart correctly when clicking cell", async () => {
        render(
          <table>
            <tbody>
              <tr>
                <Cell
                  row={row}
                  rowindex={rowindex}
                  column={column}
                  columnindex={columnindex}
                  editable={"true"}
                  clicktoedit={"true"}
                  atstart={onStartCallBack}
                />
              </tr>
            </tbody>
          </table>
        );
        const cell = screen.getByRole("cell");
        await userEvent.click(cell);
        expect(onStartCallBack.callCount).toBe(1);
        expect(onStartCallBack.calledWith(rowindex, columnindex)).toBe(true);
      });

      it("should call onStart correctly if column.events.onClick is defined", async () => {
        column.events = { onClick: stub() };
        render(
          <table>
            <tbody>
              <tr>
                <Cell
                  row={row}
                  rowindex={rowindex}
                  column={column}
                  columnindex={columnindex}
                  editable={"true"}
                  clicktoedit={"true"}
                  atstart={onStartCallBack}
                />
              </tr>
            </tbody>
          </table>
        );
        const cell = screen.getByRole("cell");
        await userEvent.click(cell);
        expect(onStartCallBack.callCount).toBe(1);
      });
    });

    describe("and dbclicktoedit is true", () => {
      it("should call onStart correctly when double clicking cell", async () => {
        render(
          <table>
            <tbody>
              <tr>
                <Cell
                  row={row}
                  rowindex={rowindex}
                  column={column}
                  columnindex={columnindex}
                  editable={"true"}
                  dbclicktoedit={"true"}
                  atstart={onStartCallBack}
                />
              </tr>
            </tbody>
          </table>
        );
        const cell = screen.getByRole("cell");
        await userEvent.dblClick(cell);
        expect(onStartCallBack.callCount).toBe(1);
        expect(onStartCallBack.calledWith(rowindex, columnindex)).toBe(true);
      });

      it("should call onStart correctly if column.events.onDoubleClick is defined", async () => {
        column.events = { onDoubleClick: stub() };
        render(
          <table>
            <tbody>
              <tr>
                <Cell
                  row={row}
                  rowindex={rowindex}
                  column={column}
                  columnindex={columnindex}
                  editable={"true"}
                  dbclicktoedit={"true"}
                  atstart={onStartCallBack}
                />
              </tr>
            </tbody>
          </table>
        );
        const cell = screen.getByRole("cell");
        await userEvent.dblClick(cell);
        expect(onStartCallBack.callCount).toBe(1);
      });

      it("should call onStart on Enter and F2 keydown", () => {
        render(
          <table>
            <tbody>
              <tr>
                <Cell
                  row={row}
                  rowindex={rowindex}
                  column={column}
                  columnindex={columnindex}
                  editable={"true"}
                  dbclicktoedit={"true"}
                  atstart={onStartCallBack}
                />
              </tr>
            </tbody>
          </table>
        );
        const cell = screen.getByRole("cell");
        fireEvent.keyDown(cell, { key: "Enter" });
        expect(onStartCallBack.callCount).toBe(1);

        fireEvent.keyDown(cell, { key: "F2" });
        expect(onStartCallBack.callCount).toBe(2);

        fireEvent.keyDown(cell, { key: "Escape" });
        expect(onStartCallBack.callCount).toBe(2);
      });
    });
  });

  describe("when isDummyField is true", () => {
    const dummyCol = {
      dataField: "dummy",
      isDummyField: true,
      text: "Dummy",
      formatter: (_: any, r: any) => <span>dummy-{r.name}</span>,
    };

    it("renders dummy column correctly and updates on row change", () => {
      const { rerender } = render(
        <table>
          <tbody>
            <tr>
              <Cell
                row={row}
                columnindex={1}
                rowindex={1}
                column={dummyCol}
              />
            </tr>
          </tbody>
        </table>
      );
      expect(screen.getByText("dummy-A")).toBeInTheDocument();

      rerender(
        <table>
          <tbody>
            <tr>
              <Cell
                row={{ id: 1, name: "B" }}
                columnindex={1}
                rowindex={1}
                column={dummyCol}
              />
            </tr>
          </tbody>
        </table>
      );
      expect(screen.getByText("dummy-B")).toBeInTheDocument();
    });
  });
});
