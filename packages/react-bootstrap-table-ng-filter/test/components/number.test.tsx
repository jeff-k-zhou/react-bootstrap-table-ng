import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ComparatorNumber, EQ, FILTER_TYPES } from "../..";
import NumberFilter from "../../src/components/number";

describe("Number Filter", () => {
  let programmaticallyFilter: any;

  const onFilter = jest.fn();
  const onFilterFirstReturn = jest.fn();

  const column = {
    dataField: "price",
    text: "Product Price",
  };

  afterEach(() => {
    onFilter.mockReset();
    onFilterFirstReturn.mockReset();
    onFilter.mockReturnValue(onFilterFirstReturn);
    jest.clearAllTimers();
  });

  describe("initialization", () => {
    beforeEach(() => {
      onFilter.mockReturnValue(onFilterFirstReturn);
    });

    it("should rendering component successfully", () => {
      render(<NumberFilter onFilter={onFilter} column={column} />);
      expect(screen.getByTestId("number-filter")).toBeInTheDocument();
      expect(screen.getByTestId("number-filter-comparator")).toBeInTheDocument();
      expect(screen.getByTestId("number-filter-input")).toBeInTheDocument();
    });

    it("should rendering comparator options correctly", () => {
      render(<NumberFilter onFilter={onFilter} column={column} />);
      const select = screen.getByTestId("number-filter-comparator");
      expect(select.querySelectorAll("option").length).toBe(ComparatorNumber);
    });
  });

  describe("when withoutEmptyComparatorOption prop is true", () => {
    it("should rendering comparator options correctly", () => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          withoutEmptyComparatorOption
        />
      );
      const select = screen.getByTestId("number-filter-comparator");
      expect(select.querySelectorAll("option").length).toBe(ComparatorNumber - 1);
    });
  });

  describe("when defaultValue.number props is defined", () => {
    const number = 203;

    it("should rendering input successfully", () => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          defaultValue={{ number }}
        />
      );
      const input = screen.getByTestId("number-filter-input");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(number);
    });
  });

  describe("when defaultValue.comparator props is defined", () => {
    const comparator = EQ;

    it("should rendering comparator select successfully", () => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          defaultValue={{ comparator }}
        />
      );
      const select = screen.getByTestId("number-filter-comparator");
      expect(select).toBeInTheDocument();
      expect(select).toHaveValue(comparator);
    });
  });

  describe("when props.getFilter is defined", () => {
    const comparator = EQ;
    const number = 123;
    const getFilter = (filter: any) => {
      programmaticallyFilter = filter;
    };

    it("should do onFilter correctly when exported function was executed", () => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          getFilter={getFilter}
        />
      );
      const { act } = require("@testing-library/react");
      act(() => {
        programmaticallyFilter({ comparator, number });
      });
      expect(onFilter).toHaveBeenCalledTimes(1);
      expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.NUMBER);
      expect(onFilterFirstReturn).toHaveBeenCalledTimes(1);
      expect(onFilterFirstReturn).toHaveBeenCalledWith({ comparator, number });
    });
  });

  describe("when defaultValue.number and defaultValue.comparator props is defined", () => {
    const number = 203;
    const comparator = EQ;

    it("should calling onFilter on componentDidMount", () => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          defaultValue={{ number, comparator }}
        />
      );
      expect(onFilter).toHaveBeenCalledTimes(1);
      expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.NUMBER, true);
      expect(onFilterFirstReturn).toHaveBeenCalledTimes(1);
      expect(onFilterFirstReturn).toHaveBeenCalledWith({ number: `${number}`, comparator });
    });
  });

  describe("when options props is defined", () => {
    const options = [2100, 2103, 2105];

    it("should rendering number options instead of number input", () => {
      render(<NumberFilter onFilter={onFilter} column={column} options={options} />);
      const select = screen.getByTestId("number-filter-select");
      expect(select).toBeInTheDocument();
      expect(select.querySelectorAll("option").length).toBe(options.length + 1);
    });

    describe("when withoutEmptyNumberOption props is defined", () => {
      it("should rendering number options instead of number input", () => {
        render(
          <NumberFilter
            onFilter={onFilter}
            column={column}
            options={options}
            withoutEmptyNumberOption
          />
        );
        const select = screen.getByTestId("number-filter-select");
        expect(select).toBeInTheDocument();
        expect(select.querySelectorAll("option").length).toBe(options.length);
      });
    });

    describe("when defaultValue.number props is defined", () => {
      const number = options[1];

      it("should rendering number options successfully", () => {
        render(
          <NumberFilter
            onFilter={onFilter}
            column={column}
            defaultValue={{ number }}
            options={options}
          />
        );
        const select = screen.getByTestId("number-filter-select");
        expect(select).toBeInTheDocument();
        expect(select).toHaveValue(number.toString());
      });
    });

    describe("when defaultValue.number and defaultValue.comparator props is defined", () => {
      const number = options[1];
      const comparator = EQ;

      it("should rendering number options successfully", () => {
        render(
          <NumberFilter
            onFilter={onFilter}
            column={column}
            defaultValue={{ number, comparator }}
            options={options}
          />
        );
        const select = screen.getByTestId("number-filter-select");
        expect(select).toBeInTheDocument();
      });
    });
  });

  describe("when style props is defined", () => {
    const style = { backgroundColor: "red" };

    it("should rendering component successfully", () => {
      render(
        <NumberFilter onFilter={onFilter} column={column} style={style} />
      );
      expect(screen.getByTestId("number-filter")).toHaveStyle("background-color: rgb(255, 0, 0)");
    });
  });

  describe("when numberStyle props is defined", () => {
    const numberStyle = { backgroundColor: "red" };

    it("should rendering component successfully", () => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          numberStyle={numberStyle}
        />
      );
      expect(screen.getByTestId("number-filter-input")).toHaveStyle("background-color: rgb(255, 0, 0)");
    });
  });

  describe("when comparatorStyle props is defined", () => {
    const comparatorStyle = { backgroundColor: "red" };

    it("should rendering component successfully", () => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          comparatorStyle={comparatorStyle}
        />
      );
      expect(screen.getByTestId("number-filter-comparator")).toHaveStyle("background-color: rgb(255, 0, 0)");
    });
  });

  describe("when className props is defined", () => {
    const className = "test";

    it("should rendering component successfully", () => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          className={className}
        />
      );
      expect(screen.getByTestId("number-filter")).toHaveClass(className);
    });
  });

  describe("when numberClassName props is defined", () => {
    const className = "test";

    it("should rendering component successfully", () => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          numberClassName={className}
        />
      );
      expect(screen.getByTestId("number-filter-input")).toHaveClass(className);
    });
  });

  describe("when comparatorClassName props is defined", () => {
    const className = "test";

    it("should rendering component successfully", () => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          comparatorClassName={className}
        />
      );
      expect(screen.getByTestId("number-filter-comparator")).toHaveClass(className);
    });
  });

  describe("filter", () => {
    it("should call onFilter and set state correctly", () => {
      jest.useFakeTimers();
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          defaultValue={{ comparator: EQ }}
        />
      );
      const input = screen.getByTestId("number-filter-input");
      fireEvent.change(input, { target: { value: "123" } });
      jest.runAllTimers();
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalled();
      jest.useRealTimers();
    });
  });
});
