import React, { Component } from "react";
import baseResolver from "../../src/props-resolver/index";
import { extendTo } from "../test-helpers/mock-component";

describe("TableResolver", () => {
  const keyField = "id";
  const columns = [
    {
      dataField: keyField,
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

  const ExtendBase = baseResolver(Component);
  const BootstrapTableMock: any = extendTo(ExtendBase);

  function createInstance(props: any = {}) {
    // Create a React element and get the instance via ref
    let instance: any = null;
    // We use a test container to mount the component and get the instance
    // This is not a DOM test, so we use React's ref directly
    React.createElement(BootstrapTableMock, {
      ...props,
      ref: (ref: any) => {
        instance = ref;
      },
    });
    // Simulate mounting by manually constructing the instance
    if (!instance) {
      instance = new BootstrapTableMock(props);
    }
    return instance;
  }

  describe("visibleRows", () => {
    describe("if hiddenRows prop is not existing", () => {
      let instance: any;
      beforeEach(() => {
        instance = createInstance({
          data,
          columns,
          keyField,
        });
      });

      it("should return correct data", () => {
        expect(instance.visibleRows()).toEqual(data);
      });
    });

    describe("if hiddenRows prop is an empty array", () => {
      let instance: any;
      beforeEach(() => {
        instance = createInstance({
          data,
          columns,
          keyField,
          hiddenRows: [],
        });
      });

      it("should return correct data", () => {
        expect(instance.visibleRows()).toEqual(data);
      });
    });

    describe("if hiddenRows prop is not an empty array", () => {
      const hiddenRows = [1];
      let instance: any;
      beforeEach(() => {
        instance = createInstance({
          data,
          columns,
          keyField,
          hiddenRows,
        });
      });

      it("should return correct data", () => {
        const result = instance.visibleRows();
        expect(result).toHaveLength(data.length - hiddenRows.length);
        expect(result).toEqual(data.filter((d) => !hiddenRows.includes(d.id)));
      });
    });
  });

  describe("validateProps", () => {
    describe("if keyField is defined and columns is all visible", () => {
      let instance: any;
      beforeEach(() => {
        instance = createInstance({
          data,
          columns,
          keyField,
        });
      });

      it("should not throw any errors", () => {
        expect(() => instance.validateProps()).not.toThrow();
      });
    });

    describe("if keyField is not defined on props", () => {
      let instance: any;
      beforeEach(() => {
        instance = createInstance({
          data,
          columns,
        });
      });

      it("should throw error", () => {
        expect(() => instance.validateProps()).toThrow(
          new Error("Please specify a field as key via keyField")
        );
      });
    });

    describe("if no columns are visible", () => {
      let instance: any;
      beforeEach(() => {
        instance = createInstance({
          data,
          keyField,
          columns: [],
        });
      });

      it("should throw error", () => {
        expect(() => instance.validateProps()).toThrow(
          new Error("No visible columns detected")
        );
      });
    });
  });
});
