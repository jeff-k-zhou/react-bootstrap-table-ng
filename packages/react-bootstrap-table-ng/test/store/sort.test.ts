
import { SORT_ASC, SORT_DESC } from "../..";
import { nextOrder, sort } from "../../src/store/sort";

describe("Sort Function", () => {
  const data = [
    { id: 3, name: "name2" },
    { id: 2, name: "ABC" },
    { id: 4, name: "123tester" },
    { id: 1, name: "!@#" },
  ];

  describe("sort", () => {
    const sortColumn = {
      dataField: "id",
      text: "ID",
    };
    let sortOrder;
    let result: any;

    it("should sort array with ASC order correctly", () => {
      sortOrder = SORT_ASC;
      result = sort(data, sortOrder, sortColumn);
      expect(result.length).toEqual(data.length);

      const sortedArray = data.map((e) => e.id).sort((a, b) => a - b);
      sortedArray.forEach((e, i) => {
        expect(e).toEqual(result[i].id);
      });
    });

    it("should sort array with DESC order correctly", () => {
      sortOrder = SORT_DESC;
      result = sort(data, sortOrder, sortColumn);
      expect(result.length).toEqual(data.length);

      const sortedArray = data.map((e) => e.id).sort((a, b) => b - a);
      sortedArray.forEach((e, i) => {
        expect(e).toEqual(result[i].id);
      });
    });

    it("should call custom sort function when sortFunc given", () => {
      const sortFunc = jest.fn().mockReturnValue(1);
      sortOrder = SORT_DESC;
      sort(data, sortOrder, { ...sortColumn, sortFunc });
      expect(sortFunc).toHaveBeenCalledTimes(3);
    });
  });

  describe("nextOrder", () => {
    const currentSortColumn = {
      dataField: "name",
      text: "Product Name",
    };
    it("should return correcly order when current sortField is not eq next sort field", () => {
      const nextSort = {
        sortColumn: {
          dataField: "id",
          text: "ID",
        },
        sortOrder: SORT_DESC,
      };
      expect(nextOrder(currentSortColumn, nextSort)).toBe(SORT_DESC);
    });

    it("should return correcly order if even next sort column is undefined", () => {
      expect(nextOrder(currentSortColumn, {})).toBe(SORT_DESC);
    });

    it("should return correcly order when current sortField is not eq next sort field and default sort direction is given", () => {
      const nextSort = {
        sortColumn: {
          dataField: "id",
          text: "ID",
        },
        sortOrder: SORT_DESC,
      };
      expect(nextOrder(currentSortColumn, nextSort, SORT_ASC)).toBe(SORT_ASC);
    });

    it("should return correcly order when current sortField is eq next sort field", () => {
      const nextSort = {
        sortColumn: currentSortColumn,
        sortOrder: SORT_ASC,
      };
      expect(nextOrder(currentSortColumn, nextSort)).toBe(SORT_DESC);
    });

    it("should return ASC when same column is currently sorted DESC", () => {
      const nextSort = {
        sortColumn: currentSortColumn,
        sortOrder: SORT_DESC,
      };
      expect(nextOrder(currentSortColumn, nextSort)).toBe(SORT_ASC);
    });
  });

  describe("sort - additional branch coverage", () => {
    it("should sort strings in DESC using string comparator (localeCompare)", () => {
      const stringData = [
        { id: 1, name: "banana" },
        { id: 2, name: "apple" },
        { id: 3, name: "cherry" },
      ];
      const strColumn = { dataField: "name", text: "Name" };
      const sorted = sort(stringData, SORT_DESC, strColumn);
      expect(sorted[0].name).toBe("cherry");
      expect(sorted[1].name).toBe("banana");
      expect(sorted[2].name).toBe("apple");
    });

    it("should sort strings in ASC using string comparator", () => {
      const stringData = [
        { id: 1, name: "banana" },
        { id: 2, name: "apple" },
        { id: 3, name: "cherry" },
      ];
      const strColumn = { dataField: "name", text: "Name" };
      const sorted = sort(stringData, SORT_ASC, strColumn);
      expect(sorted[0].name).toBe("apple");
      expect(sorted[1].name).toBe("banana");
      expect(sorted[2].name).toBe("cherry");
    });

    it("should use sortValue function to transform values before sorting", () => {
      const sortValueFn = jest.fn((val: any, row: any) => row.name.length);
      const sortValueColumn = { dataField: "id", text: "ID", sortValue: sortValueFn };
      const testData = [
        { id: 1, name: "a" },
        { id: 2, name: "bbb" },
        { id: 3, name: "cc" },
      ];
      const sorted = sort(testData, SORT_ASC, sortValueColumn);
      expect(sorted[0].name).toBe("a");
      expect(sorted[1].name).toBe("cc");
      expect(sorted[2].name).toBe("bbb");
      expect(sortValueFn).toHaveBeenCalled();
    });

    it("should handle equal numeric values (comparator returns 0)", () => {
      const eqData = [{ id: 5 }, { id: 5 }];
      const sorted = sort(eqData, SORT_DESC, { dataField: "id", text: "ID" });
      expect(sorted.length).toBe(2);
    });

    it("should treat undefined field values as empty string", () => {
      const dataWithUndefined = [
        { id: 1, name: undefined },
        { id: 2, name: "hello" },
      ];
      const sorted = sort(dataWithUndefined, SORT_ASC, { dataField: "name", text: "Name" });
      expect(sorted.length).toBe(2);
    });
  });
});
