/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import op from "../../react-bootstrap-table-ng/src/store/operators";
import _ from "../../react-bootstrap-table-ng/src/utils";

import cellEditFactory, {
  CLICK_TO_CELL_EDIT,
  DBCLICK_TO_CELL_EDIT,
  DELAY_FOR_DBCLICK,
} from "..";
import createCellEditContext from "../src/context";
import withRowLevelCellEdit from "../src/row-consumer";

describe("Row Consumer", () => {
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
  const row = { id: 1, name: "A" };
  const keyField = "id";
  const value = _.get(row, keyField);

  const { Provider } = createCellEditContext(_, op, false, jest.fn());
  const BaseComponent = (props: any) => {
    const attrs: any = {};
    Object.keys(props).forEach((key) => {
      attrs[key.toLowerCase()] = `${props[key]}`;
    });
    return <div data-testid="base-component" {...attrs} />;
  };

  describe("if cellEdit.nonEditableRows is undefined", () => {
    beforeEach(() => {
      const WithCellEditComponent = withRowLevelCellEdit(
        (props: any) => <BaseComponent {...props} />,
        false
      );
      cellEdit = cellEditFactory({ mode: CLICK_TO_CELL_EDIT });
      render(
        <Provider data={data} keyField={keyField} cellEdit={cellEdit}>
          <WithCellEditComponent value={value} />
        </Provider>
      );
    });

    it("should inject correct props to target component", () => {
      const baseComponent = screen.getByTestId("base-component");
      expect(baseComponent).toBeInTheDocument();
      expect(baseComponent).toHaveAttribute("editingrowidx", "null");
      expect(baseComponent).toHaveAttribute("editingcolidx", "null");
      expect(baseComponent).toHaveAttribute("iseditable", "true");
    });
  });

  describe("if cellEdit.nonEditableRows is defined", () => {
    const nonEditableRows = jest.fn().mockReturnValue([value]);
    describe("if value prop is match in one of cellEdit.nonEditableRows", () => {
      beforeEach(() => {
        const WithCellEditComponent = withRowLevelCellEdit(
          (props: any) => <BaseComponent {...props} />,
          false
        );
        cellEdit = cellEditFactory({
          mode: CLICK_TO_CELL_EDIT,
          nonEditableRows,
        });
        render(
          <Provider data={data} keyField={keyField} cellEdit={cellEdit}>
            <WithCellEditComponent value={value} />
          </Provider>
        );
      });

      it("should inject correct editable prop as false to target component", () => {
        const baseComponent = screen.getByTestId("base-component");
        expect(baseComponent).toBeInTheDocument();
        expect(baseComponent).toHaveAttribute("iseditable", "false");
      });
    });

    describe("if value prop is not match in one of cellEdit.nonEditableRows", () => {
      beforeEach(() => {
        const WithCellEditComponent = withRowLevelCellEdit(
          (props: any) => <BaseComponent {...props} />,
          false
        );
        cellEdit = cellEditFactory({
          mode: CLICK_TO_CELL_EDIT,
          nonEditableRows,
        });
        render(
          <Provider data={data} keyField={keyField} cellEdit={cellEdit}>
            <WithCellEditComponent value={2} />
          </Provider>
        );
      });

      it("should inject correct editable prop as true to target component", () => {
        const baseComponent = screen.getByTestId("base-component");
        expect(baseComponent).toBeInTheDocument();
        expect(baseComponent).toHaveAttribute("iseditable", "true");
      });
    });
  });

  describe(`if selectRowEnabled argument is true and cellEdit.mode is ${DBCLICK_TO_CELL_EDIT}`, () => {
    beforeEach(() => {
      const WithCellEditComponent = withRowLevelCellEdit(
        (props: any) => <BaseComponent {...props} />,
        true
      );
      cellEdit = cellEditFactory({ mode: DBCLICK_TO_CELL_EDIT });
      render(
        <Provider data={data} keyField={keyField} cellEdit={cellEdit}>
          <WithCellEditComponent value={value} />
        </Provider>
      );
    });

    it("should inject correct DELAY_FOR_DBCLICK prop to target component", () => {
      const baseComponent = screen.getByTestId("base-component");
      expect(baseComponent).toBeInTheDocument();
      expect(baseComponent).toHaveAttribute("delay_for_dbclick", `${DELAY_FOR_DBCLICK}`);
    });
  });

  describe("if cellEdit.ridx and cellEdit.cidx are defined", () => {
    const ridx = 0;
    const cidx = 1;
    beforeEach(() => {
      const WithCellEditComponent = withRowLevelCellEdit(
        (props: any) => <BaseComponent {...props} />,
        false
      );
      cellEdit = cellEditFactory({ mode: CLICK_TO_CELL_EDIT });
      cellEdit.ridx = ridx;
      cellEdit.cidx = cidx;
      render(
        <Provider data={data} keyField={keyField} cellEdit={cellEdit}>
          <WithCellEditComponent value={value} />
        </Provider>
      );
      // Simulate startEditing
      // ...existing code...
    });

    it("should inject correct editable prop as false to target component", () => {
      const baseComponent = screen.getByTestId("base-component");
      expect(baseComponent).toBeInTheDocument();
      expect(baseComponent).toHaveAttribute("editingrowidx", `${ridx}`);
      expect(baseComponent).toHaveAttribute("editingcolidx", `${cidx}`);
    });
  });
});
