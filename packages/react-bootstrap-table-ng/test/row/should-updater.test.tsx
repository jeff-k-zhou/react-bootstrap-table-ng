import {
  shouldUpdateByCellEditing,
  shouldUpdatedBySelfProps,
  shouldUpdateByColumnsForSimpleCheck,
  shouldUpdatedByNormalProps
} from "../../src/row/should-updater";

describe("Row shouldUpdater", () => {
  let props: any;
  let nextProps: any;

  describe("shouldUpdateByCellEditing", () => {
    describe("when nextProps.clickToEdit and nexrProps.dbclickToEdit both are negative", () => {
      beforeEach(() => {
        props = {
          editingRowIdx: null,
          rowIndex: 0,
        };
      });

      it("should always return false", () => {
        nextProps = { ...props, editingRowIdx: 0 };
        expect(
          shouldUpdateByCellEditing(props, nextProps)
        ).toBeFalsy();
      });
    });

    describe("when nextProps.editingRowIdx eq props.rowIndex and it's not null", () => {
      beforeEach(() => {
        props = {
          clickToEdit: true,
          editingRowIdx: null,
          rowIndex: 0,
        };
      });

      it("should return true", () => {
        nextProps = { ...props, editingRowIdx: 0 };
        expect(
          shouldUpdateByCellEditing(props, nextProps)
        ).toBeTruthy();
      });
    });

    describe("when props.editingRowIdx eq props.rowIndex but nextProps.editingRowIdx is null", () => {
      beforeEach(() => {
        props = {
          clickToEdit: true,
          editingRowIdx: 0,
          rowIndex: 0,
        };
      });

      it("should return true", () => {
        nextProps = { ...props, editingRowIdx: null };
        expect(
          shouldUpdateByCellEditing(props, nextProps)
        ).toBeTruthy();
      });
    });
  });

  describe("shouldUpdatedBySelfProps", () => {
    describe("when nextProps.className is not eq props.className", () => {
      beforeEach(() => {
        props = {
          className: "",
        };
      });

      it("should return true", () => {
        nextProps = { ...props, className: "test" };
        expect(
          shouldUpdatedBySelfProps(props, nextProps)
        ).toBeTruthy();
      });
    });

    describe("when nextProps.style is not eq props.style", () => {
      beforeEach(() => {
        props = {
          style: null,
        };
      });

      it("should return true", () => {
        nextProps = { ...props, style: { color: "red" } };
        expect(
          shouldUpdatedBySelfProps(props, nextProps)
        ).toBeTruthy();
      });
    });

    describe("when nextProps.attrs is not eq props.attrs", () => {
      beforeEach(() => {
        props = {
          attrs: null,
        };
      });

      it("should return true", () => {
        nextProps = { ...props, attrs: { onClick: jest.fn() } };
        expect(
          shouldUpdatedBySelfProps(props, nextProps)
        ).toBeTruthy();
      });
    });
  });

  describe("shouldUpdateByColumnsForSimpleCheck", () => {
    describe("when nextProps.columns.length is not eq props.columns.length", () => {
      beforeEach(() => {
        props = {
          columns: [{ dataField: "price", text: "Price" }],
        };
      });

      it("should return true", () => {
        nextProps = {
          ...props,
          columns: [...props.columns, { dataField: "name", text: "Name" }],
        };
        expect(
          shouldUpdateByColumnsForSimpleCheck(props, nextProps)
        ).toBeTruthy();
      });
    });

    describe("when any nextProps.columns.hidden is change", () => {
      beforeEach(() => {
        props = {
          columns: [{ dataField: "price", text: "Price" }],
        };
      });

      it("should return true", () => {
        nextProps = {
          ...props,
          columns: [{ dataField: "price", text: "Price", hidden: true }],
        };
        expect(
          shouldUpdateByColumnsForSimpleCheck(props, nextProps)
        ).toBeTruthy();
      });
    });

    describe("if any nextProps.columns.hidden is not change and column length is same", () => {
      beforeEach(() => {
        props = {
          columns: [{ dataField: "price", text: "Price" }],
        };
      });

      it("should return false", () => {
        nextProps = { ...props, columns: [...props.columns] };
        expect(
          shouldUpdateByColumnsForSimpleCheck(props, nextProps)
        ).toBeFalsy();
      });
    });
  });

  describe("shouldUpdatedByNormalProps", () => {
    describe("when nextProps.rowIndex is not eq props.rowIndex", () => {
      beforeEach(() => {
        props = {
          rowIndex: 0,
        };
      });

      it("should return true", () => {
        nextProps = { ...props, rowIndex: 1 };
        expect(
          shouldUpdatedByNormalProps(props, nextProps)
        ).toBeTruthy();
      });
    });

    describe("when nextProps.editable is not eq props.editable", () => {
      beforeEach(() => {
        props = {
          editable: false,
        };
      });

      it("should return true", () => {
        nextProps = { ...props, editable: true };
        expect(
          shouldUpdatedByNormalProps(props, nextProps)
        ).toBeTruthy();
      });
    });

    describe("when nextProps.columns.length is not eq props.columns.length", () => {
      beforeEach(() => {
        props = {
          columns: [{ dataField: "price", text: "Price" }],
        };
      });

      it("should return true", () => {
        nextProps = {
          ...props,
          columns: [...props.columns, { dataField: "name", text: "Name" }],
        };
        expect(
          shouldUpdatedByNormalProps(props, nextProps)
        ).toBeTruthy();
      });
    });

    describe("when nextProps.row is not eq props.row", () => {
      beforeEach(() => {
        props = {
          row: { id: 1, name: "test" },
        };
      });

      it("should return true", () => {
        nextProps = { ...props, row: { id: 1, name: "test", price: 123 } };
        expect(
          shouldUpdatedByNormalProps(props, nextProps)
        ).toBeTruthy();
      });
    });
  });
});
