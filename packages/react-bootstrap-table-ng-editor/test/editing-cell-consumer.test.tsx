/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import _ from "../../react-bootstrap-table-ng/src/utils";

import cellEditFactory, { CLICK_TO_CELL_EDIT } from "..";
import createCellEditContext from "../src/context";
import bindEditingCell from "../src/editing-cell-consumer";
import { any } from "underscore";

describe("Editing Cell Consumer", () => {
  let cellEdit: any;
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
  let columns: any;
  const rowIndex = 1;
  const row = { id: 1, name: "A" };
  const keyField = "id";
  const columnIndex = 1;

  const { Provider } = createCellEditContext(_);
  const WithCellEditComponent = bindEditingCell(_);

  beforeEach(() => {
    columns = [
      {
        dataField: "id",
        text: "ID",
      },
      {
        dataField: "name",
        text: "Name",
      },
    ];
  });

  describe("if column.editCellClasses is defined as string", () => {
    beforeEach(() => {
      cellEdit = cellEditFactory({ mode: CLICK_TO_CELL_EDIT });
      columns[1].editCellClasses = "test-class-1";
      render(
        <Provider data={data} keyField={keyField} cellEdit={cellEdit}>
          <WithCellEditComponent
            row={row}
            column={columns[1]}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
          />
        </Provider>
      );
    });

    it("should inject className target component correctly", () => {
      expect(screen.getByRole('cell')).toHaveClass(columns[1].editCellClasses);
    });
  });

  describe("if column.editCellStyle is defined as object", () => {
    beforeEach(() => {
      cellEdit = cellEditFactory({ mode: CLICK_TO_CELL_EDIT });
      columns[1].editCellStyle = { color: "pink" };
      render(
        <Provider data={data} keyField={keyField} cellEdit={cellEdit}>
          <WithCellEditComponent
            row={row}
            column={columns[1]}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
          />
        </Provider>
      );
    });

    it("should inject style target component correctly", () => {
      expect(screen.getByRole("cell")).toHaveStyle("color: rgb(255, 192, 203)");
    });
  });

  describe("if column.editCellClasses is defined as function", () => {
    const className = "test-class-1";

    beforeEach(() => {
      cellEdit = cellEditFactory({ mode: CLICK_TO_CELL_EDIT });
      columns[1].editCellClasses = jest.fn().mockReturnValue(className);
      render(
        <Provider data={data} keyField={keyField} cellEdit={cellEdit}>
          <WithCellEditComponent
            row={row}
            column={columns[1]}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
          />
        </Provider>
      );
    });

    it("should inject empty className and style to target component", () => {
      expect(screen.getByRole('cell')).toHaveClass(className);
    });

    it("should call column.editCellClasses function correctly", () => {
      expect(columns[1].editCellClasses).toHaveBeenCalledTimes(1);
      expect(columns[1].editCellClasses).toHaveBeenCalledWith(
        _.get(row, columns[1].dataField),
        row,
        rowIndex,
        columnIndex
      );
    });
  });

  describe("if column.editCellStyle is defined as function", () => {
    const style = { color: "blue" };
    beforeEach(() => {
      cellEdit = cellEditFactory({ mode: CLICK_TO_CELL_EDIT });
      columns[1].editCellStyle = jest.fn().mockReturnValue(style);
      render(
        <Provider data={data} keyField={keyField} cellEdit={cellEdit}>
          <WithCellEditComponent
            row={row}
            column={columns[1]}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
          />
        </Provider>
      );
    });

    it("should inject style target component correctly", () => {
      expect(screen.getByRole("cell")).toHaveStyle("color: rgb(0, 0, 255)");
    });

    it("should call column.editCellStyle function correctly", () => {
      expect(columns[1].editCellStyle).toHaveBeenCalledTimes(1);
      expect(columns[1].editCellStyle).toHaveBeenCalledWith(
        _.get(row, columns[1].dataField),
        row,
        rowIndex,
        columnIndex
      );
    });
  });
});
