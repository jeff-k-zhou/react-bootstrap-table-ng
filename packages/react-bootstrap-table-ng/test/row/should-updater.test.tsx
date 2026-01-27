import React from "react";
import shouldUpdater from "../../src/row/should-updater";

describe("Row shouldUpdater", () => {
  let props: any;
  let nextProps: any;

  class DummyComponent extends shouldUpdater(React.Component) {
    render() {
      return null;
    }
  }

  function getInstance(initialProps: any) {
    // Directly instantiate the class for logic testing (no DOM needed)
    return new DummyComponent(initialProps);
  }

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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdateByCellEditing(nextProps)
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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdateByCellEditing(nextProps)
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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdateByCellEditing(nextProps)
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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdatedBySelfProps(nextProps)
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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdatedBySelfProps(nextProps)
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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdatedBySelfProps(nextProps)
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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdateByColumnsForSimpleCheck(nextProps)
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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdateByColumnsForSimpleCheck(nextProps)
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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdateByColumnsForSimpleCheck(nextProps)
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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdatedByNormalProps(nextProps)
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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdatedByNormalProps(nextProps)
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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdatedByNormalProps(nextProps)
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
        const instance = getInstance(props);
        expect(
          instance.shouldUpdatedByNormalProps(nextProps)
        ).toBeTruthy();
      });
    });
  });
});
