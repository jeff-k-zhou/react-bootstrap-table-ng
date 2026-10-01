import _ from "../../react-bootstrap-table-ng/src/utils";
import { EQ, FILTER_TYPES, GE, GT, LE, LIKE, LT, NE } from "..";
import { filters } from "../src/filter";

const data: any[] = [];
for (let i = 0; i < 20; i += 1) {
  data.push({
    id: i,
    name: `itme name ${i}`,
    price: 200 + i,
    date: new Date(2017, i, 1),
  });
}

describe("filter", () => {
  let currFilters: any;
  let columns: any[];

  beforeEach(() => {
    currFilters = {};
    columns = [
      {
        dataField: "id",
        text: "ID",
      },
      {
        dataField: "name",
        text: "Name",
      },
      {
        dataField: "price",
        text: "Price",
      },
      {
        dataField: "date",
        text: "Date",
      },
    ];
  });

  describe("filterByText", () => {
    describe("when filter value is not a String", () => {
      it("should transform to string and do the filter", () => {
        currFilters.name = {
          filterVal: 3,
          filterType: FILTER_TYPES.TEXT,
        };

        const result = filters(data, columns, _)(currFilters);
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
      });
    });

    describe(`when default comparator is ${LIKE}`, () => {
      it("should returning correct result", () => {
        currFilters.name = {
          filterVal: "3",
          filterType: FILTER_TYPES.TEXT,
        };

        const result = filters(data, columns, _)(currFilters);
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
      });
    });

    describe("when caseSensitive is true", () => {
      it("should returning correct result", () => {
        currFilters.name = {
          filterVal: "NAME",
          caseSensitive: true,
          filterType: FILTER_TYPES.TEXT,
        };

        const result = filters(data, columns, _)(currFilters);
        expect(result).toBeDefined();
        expect(result).toHaveLength(0);
      });
    });

    describe(`when default comparator is ${EQ}`, () => {
      it("should returning correct result", () => {
        currFilters.name = {
          filterVal: "itme name 3",
          filterType: FILTER_TYPES.TEXT,
          comparator: EQ,
        };

        const result = filters(data, columns, _)(currFilters);
        expect(result).toBeDefined();
        expect(result).toHaveLength(1);
      });
    });

    describe("column.filterValue is defined", () => {
      beforeEach(() => {
        columns[1].filterValue = jest.fn();
      });

      it("should calling custom filterValue callback correctly", () => {
        currFilters.name = {
          filterVal: "3",
          filterType: FILTER_TYPES.TEXT,
        };

        const result = filters(data, columns, _)(currFilters);
        expect(result).toBeDefined();
        expect(columns[1].filterValue).toHaveBeenCalledTimes(data.length);
      });
    });
  });

  describe("filterByArray", () => {
    describe("when filter value is empty array", () => {
      it("should return original data", () => {
        currFilters.name = {
          filterVal: [],
          filterType: FILTER_TYPES.MULTISELECT,
        };

        const result = filters(data, columns, _)(currFilters);
        expect(result).toBeDefined();
        expect(result).toHaveLength(data.length);
      });
    });

    describe("when filter value is not an empty array", () => {
      describe(`and comparator is ${EQ}`, () => {
        it("should return data correctly", () => {
          currFilters.price = {
            filterVal: [201, 203],
            filterType: FILTER_TYPES.MULTISELECT,
            comparator: EQ,
          };

          const result = filters(data, columns, _)(currFilters);
          expect(result).toBeDefined();
          expect(result).toHaveLength(2);
        });
      });

      describe(`and comparator is ${LIKE}`, () => {
        it("should return data correctly", () => {
          currFilters.name = {
            filterVal: ["name 3", "5"],
            filterType: FILTER_TYPES.MULTISELECT,
            comparator: LIKE,
          };

          const result = filters(data, columns, _)(currFilters);
          expect(result).toBeDefined();
          expect(result).toHaveLength(3);
        });
      });
    });
  });

  describe("filterByNumber", () => {
    describe("when currFilters.filterVal.comparator is empty", () => {
      it("should returning correct result", () => {
        currFilters.price = {
          filterVal: { comparator: "", number: "203" },
          filterType: FILTER_TYPES.NUMBER,
        };

        let result = filters(data, columns, _)(currFilters);
        expect(result).toHaveLength(data.length);

        currFilters.price.filterVal.comparator = undefined;
        result = filters(result, columns, _)(currFilters);
        expect(result).toHaveLength(data.length);
      });
    });

    describe("when currFilters.filterVal.number is empty", () => {
      it("should returning correct result", () => {
        currFilters.price = {
          filterVal: { comparator: EQ, number: "" },
          filterType: FILTER_TYPES.NUMBER,
        };

        const result = filters(data, columns, _)(currFilters);
        expect(result).toHaveLength(data.length);
      });
    });

    describe(`when currFilters.filterVal.comparator is ${EQ}`, () => {
      it("should returning correct result", () => {
        currFilters.price = {
          filterVal: { comparator: EQ, number: "203" },
          filterType: FILTER_TYPES.NUMBER,
        };

        let result = filters(data, columns, _)(currFilters);
        expect(result).toHaveLength(1);

        currFilters.price.filterVal.number = "0";
        result = filters(result, columns, _)(currFilters);
        expect(result).toHaveLength(0);
      });
    });

    describe(`when currFilters.filterVal.comparator is ${GT}`, () => {
      it("should returning correct result", () => {
        currFilters.price = {
          filterVal: { comparator: GT, number: "203" },
          filterType: FILTER_TYPES.NUMBER,
        };

        const result = filters(data, columns, _)(currFilters);
        expect(result).toHaveLength(16);
      });
    });

    describe(`when currFilters.filterVal.comparator is ${GE}`, () => {
      it("should returning correct result", () => {
        currFilters.price = {
          filterVal: { comparator: GE, number: "203" },
          filterType: FILTER_TYPES.NUMBER,
        };

        const result = filters(data, columns, _)(currFilters);
        expect(result).toHaveLength(17);
      });
    });

    describe(`when currFilters.filterVal.comparator is ${LT}`, () => {
      it("should returning correct result", () => {
        currFilters.price = {
          filterVal: { comparator: LT, number: "203" },
          filterType: FILTER_TYPES.NUMBER,
        };

        const result = filters(data, columns, _)(currFilters);
        expect(result).toHaveLength(3);
      });
    });

    describe(`when currFilters.filterVal.comparator is ${LE}`, () => {
      it("should returning correct result", () => {
        currFilters.price = {
          filterVal: { comparator: LE, number: "203" },
          filterType: FILTER_TYPES.NUMBER,
        };

        const result = filters(data, columns, _)(currFilters);
        expect(result).toHaveLength(4);
      });
    });

    describe(`when currFilters.filterVal.comparator is ${NE}`, () => {
      it("should returning correct result", () => {
        currFilters.price = {
          filterVal: { comparator: NE, number: "203" },
          filterType: FILTER_TYPES.NUMBER,
        };

        const result = filters(data, columns, _)(currFilters);
        expect(result).toHaveLength(19);
      });
    });
  });

  describe("filterByDate", () => {
    let filterFn: any;
    beforeEach(() => {
      filterFn = filters(data, columns, _);
    });

    describe("when currFilters.filterVal.comparator is empty", () => {
      it("should returning correct result", () => {
        currFilters.price = {
          filterVal: { comparator: "", date: new Date() },
          filterType: FILTER_TYPES.DATE,
        };

        let result = filterFn(currFilters);
        expect(result).toHaveLength(data.length);

        currFilters.price.filterVal.comparator = undefined;
        result = filterFn(currFilters);
        expect(result).toHaveLength(data.length);
      });
    });

    describe("when currFilters.filterVal.date is empty", () => {
      it("should returning correct result", () => {
        currFilters.price = {
          filterVal: { comparator: EQ, date: "" },
          filterType: FILTER_TYPES.DATE,
        };

        const result = filterFn(currFilters);
        expect(result).toHaveLength(data.length);
      });
    });

    describe("comparators", () => {
      it("should filter with EQ", () => {
        currFilters.date = {
          filterVal: { comparator: EQ, date: new Date(2017, 3, 1) },
          filterType: FILTER_TYPES.DATE,
        };
        const result = filterFn(currFilters);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(3);
      });

      it("should filter with GT", () => {
        currFilters.date = {
          filterVal: { comparator: GT, date: new Date(2017, 15, 1) },
          filterType: FILTER_TYPES.DATE,
        };
        const result = filterFn(currFilters);
        expect(result.length).toBeGreaterThan(0);
      });

      it("should filter with GE", () => {
        currFilters.date = {
          filterVal: { comparator: GE, date: new Date(2017, 10, 1) },
          filterType: FILTER_TYPES.DATE,
        };
        const result = filterFn(currFilters);
        expect(result).toHaveLength(10); // 10 to 19
      });

      it("should filter with LT", () => {
        currFilters.date = {
          filterVal: { comparator: LT, date: new Date(2017, 5, 1) },
          filterType: FILTER_TYPES.DATE,
        };
        const result = filterFn(currFilters);
        expect(result).toHaveLength(5); // 0 to 4
      });

      it("should filter with LE", () => {
        currFilters.date = {
          filterVal: { comparator: LE, date: new Date(2017, 5, 1) },
          filterType: FILTER_TYPES.DATE,
        };
        const result = filterFn(currFilters);
        expect(result).toHaveLength(6); // 0 to 5
      });

      it("should filter with NE", () => {
        currFilters.date = {
          filterVal: { comparator: NE, date: new Date(2017, 3, 1) },
          filterType: FILTER_TYPES.DATE,
        };
        const result = filterFn(currFilters);
        expect(result).toHaveLength(19);
      });

      it("should handle unsupported date comparator", () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => {});
        currFilters.date = {
          filterVal: { comparator: "UNKNOWN", date: new Date(2017, 3, 1) },
          filterType: FILTER_TYPES.DATE,
        };
        const result = filterFn(currFilters);
        expect(result).toHaveLength(data.length);
        spy.mockRestore();
      });

      it("should support customFilterValue for date", () => {
        columns[3].filterValue = jest.fn((cell) => cell);
        currFilters.date = {
          filterVal: { comparator: EQ, date: new Date(2017, 3, 1) },
          filterType: FILTER_TYPES.DATE,
        };
        const result = filterFn(currFilters);
        expect(columns[3].filterValue).toHaveBeenCalled();
        expect(result).toHaveLength(1);
      });
    });
  });

  describe("filterByNumber customFilterValue & unsupported", () => {
    it("supports customFilterValue on number column", () => {
      columns[2].filterValue = jest.fn((cell) => cell);
      currFilters.price = {
        filterVal: { comparator: EQ, number: 205 },
        filterType: FILTER_TYPES.NUMBER,
      };
      const result = filters(data, columns, _)(currFilters);
      expect(columns[2].filterValue).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it("handles unsupported number comparator", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      currFilters.price = {
        filterVal: { comparator: "INVALID", number: 205 },
        filterType: FILTER_TYPES.NUMBER,
      };
      const result = filters(data, columns, _)(currFilters);
      expect(result).toHaveLength(data.length);
      spy.mockRestore();
    });
  });

  describe("customFilter (column.filter.props.onFilter)", () => {
    it("applies onFilter from column.filter when present", () => {
      const onFilter = jest.fn().mockReturnValue([data[0]]);
      columns[1].filter = { props: { onFilter } };
      currFilters.name = { filterVal: "custom", filterType: FILTER_TYPES.TEXT };

      const result = filters(data, columns, _)(currFilters);
      expect(onFilter).toHaveBeenCalledWith("custom", data);
      expect(result).toEqual([data[0]]);
    });

    it("handles clearFilters with customFilter", () => {
      const onFilter = jest.fn().mockReturnValue([data[1]]);
      columns[1].filter = { props: { onFilter } };
      const clearFilters = { name: { filterVal: "" } };

      const result = filters(data, columns, _)(currFilters, clearFilters);
      expect(onFilter).toHaveBeenCalledWith("", data);
      expect(result).toEqual([data[1]]);
    });

    it("handles clearFilters with customFilter returning undefined", () => {
      const onFilter = jest.fn().mockReturnValue(undefined);
      columns[1].filter = { props: { onFilter } };
      const clearFilters = { name: { filterVal: "" } };

      const result = filters(data, columns, _)(currFilters, clearFilters);
      expect(onFilter).toHaveBeenCalledWith("", data);
      expect(result).toEqual(data);
    });

    it("handles filters when columns is undefined or null", () => {
      currFilters.name = { filterVal: "item", filterType: FILTER_TYPES.TEXT };
      const result = filters(data, null as any, _)(currFilters);
      expect(result).toBeDefined();
    });

    it("handles filterByDate with string dates, and GE/LE day/year boundaries", () => {
      const dateData = [
        { id: 1, date: "2016-05-15T00:00:00.000Z" }, // year < 2017
        { id: 2, date: "2017-05-10T00:00:00.000Z" }, // same year/month, day < 15
        { id: 3, date: "2017-05-15T00:00:00.000Z" }, // exact
        { id: 4, date: "2017-05-20T00:00:00.000Z" }, // same year/month, day > 15
        { id: 5, date: "2018-05-15T00:00:00.000Z" }, // year > 2017
      ];
      const cols = [{ dataField: "date", text: "Date" }];

      // Test GE
      const geResult = filters(dateData, cols, _)({
        date: {
          filterVal: { comparator: GE, date: new Date("2017-05-15T00:00:00.000Z") },
          filterType: FILTER_TYPES.DATE,
        },
      });
      expect(geResult.map((r: any) => r.id)).toEqual([3, 4, 5]);

      // Test LE
      const leResult = filters(dateData, cols, _)({
        date: {
          filterVal: { comparator: LE, date: new Date("2017-05-15T00:00:00.000Z") },
          filterType: FILTER_TYPES.DATE,
        },
      });
      expect(leResult.map((r: any) => r.id)).toEqual([1, 2, 3]);
    });

    it("handles filterByArray when row cell value is undefined", () => {
      const arrayData = [
        { id: 1, tags: "apple" },
        { id: 2 }, // tags is undefined
      ];
      const cols = [{ dataField: "tags", text: "Tags" }];
      const res = filters(arrayData, cols, _)({
        tags: {
          filterVal: ["apple"],
          filterType: FILTER_TYPES.MULTISELECT,
          comparator: EQ,
        },
      });
      expect(res).toHaveLength(1);
      expect(res[0].id).toBe(1);
    });
  });
});

