import { isAnyExpands, expandableKeys, getExpandedRows } from "../../src/store/expand";

describe("store/expand", () => {
  const data = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];
  const keyField = "id";

  describe("isAnyExpands", () => {
    it("returns false when expanded is empty", () => {
      expect(isAnyExpands(data, keyField, [])).toBe(false);
    });

    it("returns false when no data rows are expanded", () => {
      expect(isAnyExpands(data, keyField, [99])).toBe(false);
    });

    it("returns true when at least one row is expanded", () => {
      expect(isAnyExpands(data, keyField, [2])).toBe(true);
    });

    it("returns true when the first row is expanded", () => {
      expect(isAnyExpands(data, keyField, [1])).toBe(true);
    });

    it("returns false when expanded is undefined (defaults to empty)", () => {
      expect(isAnyExpands(data, keyField)).toBe(false);
    });
  });

  describe("expandableKeys", () => {
    it("returns all keys when skips is empty", () => {
      const keys = expandableKeys(data, keyField, []);
      expect(keys).toEqual([1, 2, 3]);
    });

    it("returns all keys when no skips provided (defaults)", () => {
      const keys = expandableKeys(data, keyField);
      expect(keys).toEqual([1, 2, 3]);
    });

    it("excludes skipped keys", () => {
      const keys = expandableKeys(data, keyField, [2]);
      expect(keys).toEqual([1, 3]);
    });

    it("excludes multiple skipped keys", () => {
      const keys = expandableKeys(data, keyField, [1, 3]);
      expect(keys).toEqual([2]);
    });

    it("returns empty array when all rows are skipped", () => {
      const keys = expandableKeys(data, keyField, [1, 2, 3]);
      expect(keys).toEqual([]);
    });
  });

  describe("getExpandedRows", () => {
    it("returns rows matching expanded keys", () => {
      const rows = getExpandedRows(data, keyField, [1, 3]);
      expect(rows.length).toBe(2);
      expect(rows[0]).toEqual({ id: 1, name: "Alice" });
      expect(rows[1]).toEqual({ id: 3, name: "Charlie" });
    });

    it("returns empty when expanded is empty", () => {
      expect(getExpandedRows(data, keyField, [])).toEqual([]);
    });

    it("returns undefined entries for non-matching keys", () => {
      const rows = getExpandedRows(data, keyField, [99]);
      expect(rows).toEqual([undefined]);
    });
  });
});
