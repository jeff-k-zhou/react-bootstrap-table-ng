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
  });

  describe("initialization", () => {
    beforeEach(() => {
      onFilter.mockReturnValue(onFilterFirstReturn);
      render(<NumberFilter onFilter={onFilter} column={column} />);
    });

    it("should have correct state", () => {
      // No direct state access, but input should not be selected
      expect(screen.getByTestId("number-filter")).toBeInTheDocument();
    });

    it("should rendering component successfully", () => {
      expect(screen.getByTestId("number-filter")).toBeInTheDocument();
      expect(screen.getByTestId("number-filter-comparator")).toBeInTheDocument();
      expect(screen.getByTestId("number-filter-input")).toBeInTheDocument();
    });

    it("should rendering comparator options correctly", () => {
      const select = screen.getByTestId("number-filter-comparator");
      expect(select.querySelectorAll("option").length).toBe(ComparatorNumber);
    });
  });

  describe("when withoutEmptyComparatorOption prop is true", () => {
    beforeEach(() => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          withoutEmptyComparatorOption
        />
      );
    });

    it("should rendering comparator options correctly", () => {
      const select = screen.getByTestId("number-filter-comparator");
      expect(select.querySelectorAll("option").length).toBe(ComparatorNumber - 1);
    });
  });

  describe("when defaultValue.number props is defined", () => {
    const number = 203;

    beforeEach(() => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          defaultValue={{ number }}
        />
      );
    });

    it("should rendering input successfully", () => {
      const input = screen.getByTestId("number-filter-input");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(number);
    });
  });

  describe("when defaultValue.comparator props is defined", () => {
    const comparator = EQ;

    beforeEach(() => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          defaultValue={{ comparator }}
        />
      );
    });

    it("should rendering comparator select successfully", () => {
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

    beforeEach(() => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          getFilter={getFilter}
        />
      );
      programmaticallyFilter({ comparator, number });
    });

    it("should do onFilter correctly when exported function was executed", () => {
      expect(onFilter).toHaveBeenCalledTimes(1);
      expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.NUMBER);
      expect(onFilterFirstReturn).toHaveBeenCalledTimes(1);
      expect(onFilterFirstReturn).toHaveBeenCalledWith({ comparator, number });
    });
  });

  describe("when defaultValue.number and defaultValue.comparator props is defined", () => {
    const number = 203;
    const comparator = EQ;

    beforeEach(() => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          defaultValue={{ number, comparator }}
        />
      );
    });

    it("should calling onFilter on componentDidMount", () => {
      expect(onFilter).toHaveBeenCalledTimes(1);
      expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.NUMBER, true);
      expect(onFilterFirstReturn).toHaveBeenCalledTimes(1);
      expect(onFilterFirstReturn).toHaveBeenCalledWith({ number: `${number}`, comparator });
    });
  });

  describe("when options props is defined", () => {
    const options = [2100, 2103, 2105];

    beforeEach(() => {
      render(<NumberFilter onFilter={onFilter} column={column} options={options} />);
    });

    it("should rendering number options instead of number input", () => {
      const select = screen.getByTestId("number-filter-select");
      expect(select).toBeInTheDocument();
      expect(select.querySelectorAll("option").length).toBe(options.length + 1);
    });

    describe("when withoutEmptyNumberOption props is defined", () => {
      beforeEach(() => {
        render(
          <NumberFilter
            onFilter={onFilter}
            column={column}
            options={options}
            withoutEmptyNumberOption
          />
        );
      });

      it("should rendering number options instead of number input", () => {
        const select = screen.getByTestId("number-filter-select");
        expect(select).toBeInTheDocument();
        expect(select.querySelectorAll("option").length).toBe(options.length);
      });
    });

    describe("when defaultValue.number props is defined", () => {
      const number = 203;

      beforeEach(() => {
        render(
          <NumberFilter
            onFilter={onFilter}
            column={column}
            defaultValue={{ number }}
            options={options}
          />
        );
      });

      it("should rendering number options successfully", () => {
        const select = screen.getByTestId("number-filter-select");
        expect(select).toBeInTheDocument();
        expect(select).toHaveValue(number.toString());
      });
    });

    describe("when defaultValue.number and defaultValue.comparator props is defined", () => {
      const number = options[1];
      const comparator = EQ;

      beforeEach(() => {
        render(
          <NumberFilter
            onFilter={onFilter}
            column={column}
            defaultValue={{ number, comparator }}
            options={options}
          />
        );
      });

      it("should rendering number options successfully", () => {
        const select = screen.getByTestId("number-filter-select");
        expect(select).toBeInTheDocument();
      });
    });
  });

  describe("when style props is defined", () => {
    const style = { backgroundColor: "red" };
    beforeEach(() => {
      render(
        <NumberFilter onFilter={onFilter} column={column} style={style} />
      );
    });

    it("should rendering component successfully", () => {
      expect(screen.getByTestId("number-filter")).toHaveStyle("background-color: red");
    });
  });

  describe("when numberStyle props is defined", () => {
    const numberStyle = { backgroundColor: "red" };
    beforeEach(() => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          numberStyle={numberStyle}
        />
      );
    });

    it("should rendering component successfully", () => {
      expect(screen.getByTestId("number-filter-input")).toHaveStyle("background-color: red");
    });
  });

  describe("when comparatorStyle props is defined", () => {
    const comparatorStyle = { backgroundColor: "red" };
    beforeEach(() => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          comparatorStyle={comparatorStyle}
        />
      );
    });

    it("should rendering component successfully", () => {
      expect(screen.getByTestId("number-filter-comparator")).toHaveStyle("background-color: red");
    });
  });

  describe("when className props is defined", () => {
    const className = "test";
    beforeEach(() => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          className={className}
        />
      );
    });

    it("should rendering component successfully", () => {
      expect(screen.getByTestId("number-filter")).toHaveClass(className);
    });
  });

  describe("when numberClassName props is defined", () => {
    const className = "test";
    beforeEach(() => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          numberClassName={className}
        />
      );
    });

    it("should rendering component successfully", () => {
      expect(screen.getByTestId("number-filter-input")).toHaveClass(className);
    });
  });

  describe("when comparatorClassName props is defined", () => {
    const className = "test";
    beforeEach(() => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
          comparatorClassName={className}
        />
      );
    });

    it("should rendering component successfully", () => {
      expect(screen.getByTestId("number-filter-comparator")).toHaveClass(className);
    });
  });

  describe("filter", () => {
    it("should call onFilter and set state correctly", () => {
      render(
        <NumberFilter
          onFilter={onFilter}
          column={column}
        />
      );
      const input = screen.getByTestId("number-filter-input");
      fireEvent.change(input, { target: { value: "123" } });
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalled();
    });
  });
});
