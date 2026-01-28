import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ComparatorNumber, EQ, FILTER_TYPES } from "../..";
import DateFilter from "../../src/components/date";

describe("Date Filter", () => {
  const onFilterFirstReturn = jest.fn();
  const onFilter = jest.fn().mockReturnValue(onFilterFirstReturn);

  const column = {
    dataField: "price",
    text: "Product Price",
  };

  afterEach(() => {
    onFilter.mockClear();
    onFilterFirstReturn.mockClear();
  });

  describe("initialization", () => {
    it("should render component successfully", () => {
      render(<DateFilter onFilter={onFilter} column={column} />);
      expect(screen.getByTestId("date-filter-input")).toBeInTheDocument();
      expect(screen.getByTestId("date-filter-comparator")).toBeInTheDocument();
      expect(screen.getByTestId("date-filter")).toBeInTheDocument();
    });

    it("should render comparator options correctly", () => {
      render(<DateFilter onFilter={onFilter} column={column} />);
      const select = screen.getByTestId("date-filter-comparator");
      expect(select.querySelectorAll("option").length).toBe(ComparatorNumber);
    });
  });

  describe("when withoutEmptyComparatorOption prop is true", () => {
    it("should render comparator options correctly", () => {
      render(
        <DateFilter
          onFilter={onFilter}
          column={column}
          withoutEmptyComparatorOption
        />
      );
      const select = screen.getByTestId("date-filter-comparator");
      expect(select.querySelectorAll("option").length).toBe(ComparatorNumber - 1);
    });
  });

  describe("when defaultValue.date props is defined", () => {
    const date = new Date(2018, 0, 1);

    it("should render input successfully", () => {
      render(
        <DateFilter
          onFilter={onFilter}
          column={column}
          defaultValue={{ date }}
        />
      );
      const input = screen.getByTestId("date-filter-input");
      expect(input).toBeInTheDocument();
      // The defaultValue is formatted as yyyy-mm-dd
      const expectedValue = new DateFilter({ onFilter, column, defaultValue: { date } }).getDefaultDate();
      expect(input).toHaveValue(expectedValue);
    });
  });

  describe("when defaultValue.comparator props is defined", () => {
    const comparator = EQ;

    it("should render comparator select successfully", () => {
      render(
        <DateFilter
          onFilter={onFilter}
          column={column}
          defaultValue={{ comparator }}
        />
      );
      const select = screen.getByTestId("date-filter-comparator");
      expect(select).toBeInTheDocument();
      expect(select).toHaveValue(comparator);
    });
  });

  describe("when props.getFilter is defined", () => {
    let programmaticallyFilter: any;
    const comparator = EQ;
    const date = new Date(2018, 0, 1);

    const getFilter = (filter: any) => {
      programmaticallyFilter = filter;
    };

    it("should do onFilter correctly when exported function was executed", () => {
      render(
        <DateFilter onFilter={onFilter} column={column} getFilter={getFilter} />
      );
      programmaticallyFilter({ comparator, date });
      expect(onFilter).toHaveBeenCalledTimes(1);
      expect(onFilter).toHaveBeenCalledWith(
        column,
        FILTER_TYPES.DATE,
        undefined
      );
      expect(onFilterFirstReturn).toHaveBeenCalledTimes(1);
      expect(onFilterFirstReturn).toHaveBeenCalledWith({ comparator, date });
    });
  });

  describe("when defaultValue.date and defaultValue.comparator props are defined", () => {
    let date: Date;
    let comparator: string;

    it("should call onFilter on mount", () => {
      date = new Date();
      comparator = EQ;
      render(
        <DateFilter
          onFilter={onFilter}
          column={column}
          defaultValue={{ date, comparator }}
        />
      );
      expect(onFilter).toHaveBeenCalledTimes(1);
      expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.DATE, true);
      expect(onFilterFirstReturn).toHaveBeenCalledTimes(1);
    });
  });

  describe("when style props is defined", () => {
    const style = { backgroundColor: "red" };
    it("should render component with style", () => {
      render(
        <DateFilter onFilter={onFilter} column={column} style={style} />
      );
      expect(screen.getByTestId("date-filter")).toHaveStyle("background-color: rgb(255, 0, 0)");
    });
  });

  describe("when dateStyle props is defined", () => {
    const dateStyle = { backgroundColor: "red" };
    it("should render input with dateStyle", () => {
      render(
        <DateFilter onFilter={onFilter} column={column} dateStyle={dateStyle} />
      );
      expect(screen.getByTestId("date-filter-input")).toHaveStyle("background-color: rgb(255, 0, 0)");
    });
  });

  describe("when comparatorStyle props is defined", () => {
    const comparatorStyle = { backgroundColor: "red" };
    it("should render comparator with comparatorStyle", () => {
      render(
        <DateFilter
          onFilter={onFilter}
          column={column}
          comparatorStyle={comparatorStyle}
        />
      );
      expect(screen.getByTestId("date-filter-comparator")).toHaveStyle("background-color: rgb(255, 0, 0)");
    });
  });

  describe("when className props is defined", () => {
    const className = "test";
    it("should render component with className", () => {
      render(
        <DateFilter onFilter={onFilter} column={column} className={className} />
      );
      expect(screen.getByTestId("date-filter")).toHaveClass(className);
    });
  });

  describe("when dateClassName props is defined", () => {
    const className = "test";
    it("should render input with dateClassName", () => {
      render(
        <DateFilter
          onFilter={onFilter}
          column={column}
          dateClassName={className}
        />
      );
      expect(screen.getByTestId("date-filter-input")).toHaveClass(className);
    });
  });

  describe("when comparatorClassName props is defined", () => {
    const className = "test";
    it("should render comparator with comparatorClassName", () => {
      render(
        <DateFilter
          onFilter={onFilter}
          column={column}
          comparatorClassName={className}
        />
      );
      expect(screen.getByTestId("date-filter-comparator")).toHaveClass(className);
    });
  });
});
