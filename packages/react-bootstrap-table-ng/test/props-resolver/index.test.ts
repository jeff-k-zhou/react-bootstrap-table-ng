import { renderHook } from "@testing-library/react";
import { useTableLogic } from "../../src/hooks/useTableLogic";

describe("useTableLogic", () => {
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

  describe("visibleRows", () => {
    it("should return correct data if hiddenRows prop is not existing", () => {
      const { result } = renderHook(() => useTableLogic({ data, columns, keyField }));
      expect(result.current.visibleRows).toEqual(data);
    });

    it("should return correct data if hiddenRows prop is an empty array", () => {
      const { result } = renderHook(() => useTableLogic({ data, columns, keyField, hiddenRows: [] }));
      expect(result.current.visibleRows).toEqual(data);
    });

    it("should return correct data if hiddenRows prop is not an empty array", () => {
      const hiddenRows = [1];
      const { result } = renderHook(() => useTableLogic({ data, columns, keyField, hiddenRows }));
      expect(result.current.visibleRows).toHaveLength(data.length - hiddenRows.length);
      expect(result.current.visibleRows).toEqual(data.filter((d) => !hiddenRows.includes(d.id)));
    });
  });

  describe("validateProps", () => {
    it("should not throw any errors if keyField is defined and columns is all visible", () => {
      const { result } = renderHook(() => useTableLogic({ data, columns, keyField }));
      expect(() => result.current.validateProps()).not.toThrow();
    });

    it("should throw error if keyField is not defined on props", () => {
      const { result } = renderHook(() => useTableLogic({ data, columns, keyField: "" } as any));
      expect(() => result.current.validateProps()).toThrow(
        new Error("Please specify a field as key via keyField")
      );
    });
  });
});
