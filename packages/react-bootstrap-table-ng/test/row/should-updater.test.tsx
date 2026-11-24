import React from "react";
import { render } from "@testing-library/react";
import RowShouldUpdater, {
  shouldUpdateByCellEditing,
  shouldUpdatedBySelfProps,
  shouldUpdateByColumnsForSimpleCheck,
  shouldUpdatedByNormalProps,
  shouldUpdateChild,
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

  describe("RowShouldUpdater HOC", () => {
    it("wraps a component and passes all props through forwardRef", () => {
      const BaseComponent = React.forwardRef((props: any, ref: any) => (
        <tr ref={ref} data-testid="base-row" data-foo={props.foo} />
      ));
      (BaseComponent as any).displayName = "Base";

      const Wrapped = RowShouldUpdater(BaseComponent as any);

      const { container } = render(
        <table>
          <tbody>
            <Wrapped foo="bar" />
          </tbody>
        </table>
      );
      const row = container.querySelector("[data-testid='base-row']");
      expect(row).toBeTruthy();
      expect(row?.getAttribute("data-foo")).toBe("bar");
    });

    it("uses component name in displayName when displayName is missing", () => {
      function NamedComponent() { return null; }
      const Wrapped = RowShouldUpdater(NamedComponent as any);
      expect(Wrapped.displayName).toBe("RowShouldUpdater(NamedComponent)");
    });

    it("uses 'Component' fallback displayName when using a named component without displayName", () => {
      const WrappedAnon = RowShouldUpdater(function () { return null; } as any);
      // Should have some displayName starting with RowShouldUpdater
      expect(WrappedAnon.displayName).toContain("RowShouldUpdater(");
    });
  });

  describe("shouldUpdateChild", () => {
    it("returns true when selectRow changes", () => {
      const base = {
        rowIndex: 0,
        columns: [{ dataField: "id", text: "ID" }],
        row: { id: 1 },
        selectRow: { mode: "checkbox" },
        expandRow: { renderer: jest.fn() },
      };
      const next = { ...base, selectRow: { mode: "radio" } };
      expect(shouldUpdateChild(base, next)).toBe(true);
    });

    it("returns true when expandRow changes", () => {
      const base = {
        rowIndex: 0,
        columns: [{ dataField: "id", text: "ID" }],
        row: { id: 1 },
        selectRow: { mode: "checkbox" },
        expandRow: { renderer: jest.fn() },
      };
      const next = { ...base, expandRow: { renderer: jest.fn() } };
      expect(shouldUpdateChild(base, next)).toBe(true);
    });

    it("returns false when all props are unchanged", () => {
      const expandFn = jest.fn();
      const base = {
        rowIndex: 0,
        columns: [{ dataField: "id", text: "ID" }],
        row: { id: 1 },
        selectRow: { mode: "checkbox" },
        expandRow: { renderer: expandFn },
      };
      expect(shouldUpdateChild(base, { ...base })).toBe(false);
    });
  });
});
