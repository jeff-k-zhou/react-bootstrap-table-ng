import { typeConvert } from "../../src/store/type";
import {
  TYPE_BOOLEAN,
  TYPE_DATE,
  TYPE_NUMBER,
  TYPE_STRING,
} from "../../src/const";

describe("store/type - typeConvert", () => {
  describe("TYPE_STRING", () => {
    it("converts number to string", () => {
      expect(typeConvert(TYPE_STRING, 42)).toBe("42");
    });

    it("converts boolean to string", () => {
      expect(typeConvert(TYPE_STRING, true)).toBe("true");
    });
  });

  describe("TYPE_NUMBER", () => {
    it("converts string to number", () => {
      expect(typeConvert(TYPE_NUMBER, "42")).toBe(42);
    });

    it("converts string float to number", () => {
      expect(typeConvert(TYPE_NUMBER, "3.14")).toBeCloseTo(3.14);
    });
  });

  describe("TYPE_BOOLEAN", () => {
    it("returns boolean value as-is", () => {
      expect(typeConvert(TYPE_BOOLEAN, true)).toBe(true);
      expect(typeConvert(TYPE_BOOLEAN, false)).toBe(false);
    });

    it("converts 'true' string to boolean true", () => {
      expect(typeConvert(TYPE_BOOLEAN, "true")).toBe(true);
    });

    it("converts 'false' string to boolean false", () => {
      expect(typeConvert(TYPE_BOOLEAN, "false")).toBe(false);
    });
  });

  describe("TYPE_DATE", () => {
    it("converts ISO string to Date", () => {
      const result = typeConvert(TYPE_DATE, "2024-01-15");
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe("unknown type", () => {
    it("returns value unchanged for unknown type", () => {
      expect(typeConvert("UNKNOWN", "hello")).toBe("hello");
      expect(typeConvert(null, 99)).toBe(99);
    });
  });
});
