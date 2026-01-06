import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FILTER_TYPES } from "../..";
import TextFilter from "../../src/components/text";

jest.useFakeTimers();

describe("Text Filter", () => {
  let programmaticallyFilter: any;

  const onFilter = jest.fn();
  const onFilterFirstReturn = jest.fn();

  const column = {
    dataField: "price",
    text: "Price",
  };

  afterEach(() => {
    onFilter.mockReset();
    onFilterFirstReturn.mockReset();
    onFilter.mockReturnValue(onFilterFirstReturn);
  });

  describe("initialization", () => {
    beforeEach(() => {
      onFilter.mockReturnValue(onFilterFirstReturn);
      render(<TextFilter onFilter={onFilter} column={column} />);
    });

    it("should have correct state", () => {
      // No direct state access, but input should be empty
      expect(screen.getByRole("textbox")).toHaveValue("");
    });

    it("should render component successfully", () => {
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "placeholder",
        `Enter ${column.text}...`
      );
    });
  });

  describe("when defaultValue is defined", () => {
    const defaultValue = "123";
    beforeEach(() => {
      onFilter.mockReturnValue(onFilterFirstReturn);
      render(
        <TextFilter
          onFilter={onFilter}
          column={column}
          defaultValue={defaultValue}
        />
      );
    });

    it("should have correct state", () => {
      expect(screen.getByRole("textbox")).toHaveValue(defaultValue);
    });

    it("should render component successfully", () => {
      expect(screen.getByRole("textbox")).toHaveValue(defaultValue);
    });

    it("should call onFilter on mount", () => {
      expect(onFilter).toHaveBeenCalledTimes(1);
      expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.TEXT, true);
      expect(onFilterFirstReturn).toHaveBeenCalledTimes(1);
      expect(onFilterFirstReturn).toHaveBeenCalledWith(defaultValue);
    });
  });

  describe("when props.getFilter is defined", () => {
    const filterValue = "foo";
    const getFilter = (filter: any) => {
      programmaticallyFilter = filter;
    };

    beforeEach(() => {
      onFilter.mockReturnValue(onFilterFirstReturn);
      render(
        <TextFilter onFilter={onFilter} column={column} getFilter={getFilter} />
      );
      programmaticallyFilter(filterValue);
    });

    it("should do onFilter correctly when exported function was executed", () => {
      expect(onFilter).toHaveBeenCalledTimes(1);
      expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.TEXT);
      expect(onFilterFirstReturn).toHaveBeenCalledTimes(1);
      expect(onFilterFirstReturn).toHaveBeenCalledWith(filterValue);
    });

    it("should set value correctly when exported function was executed", () => {
      expect(screen.getByRole("textbox")).toHaveValue(filterValue);
    });
  });

  describe("when placeholder is defined", () => {
    const placeholder = "test";
    beforeEach(() => {
      render(
        <TextFilter
          onFilter={onFilter}
          column={column}
          placeholder={placeholder}
        />
      );
    });

    it("should render component successfully", () => {
      expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", placeholder);
    });
  });

  describe("when style is defined", () => {
    const style = { backgroundColor: "red" };
    beforeEach(() => {
      render(
        <TextFilter onFilter={onFilter} column={column} style={style} />
      );
    });

    it("should render component successfully", () => {
      expect(screen.getByRole("textbox")).toHaveStyle("background-color: red");
    });
  });

  describe("componentDidUpdate", () => {
    const nextDefaultValue = "tester";
    it("should set value and call onFilter when defaultValue changes", () => {
      const { rerender } = render(
        <TextFilter onFilter={onFilter} column={column} />
      );
      rerender(
        <TextFilter onFilter={onFilter} column={column} defaultValue={nextDefaultValue} />
      );
      expect(screen.getByRole("textbox")).toHaveValue(nextDefaultValue);
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalledWith(nextDefaultValue);
    });
  });

  describe("cleanFiltered", () => {
    const defaultValue = "";
    it("should set value and call onFilter", () => {
      let filterRef: any;
      render(
        <TextFilter
          onFilter={onFilter}
          column={column}
          ref={(ref: any) => (filterRef = ref)}
        />
      );
      filterRef.cleanFiltered();
      expect(screen.getByRole("textbox")).toHaveValue(defaultValue);
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalledWith(defaultValue);
    });
  });

  describe("applyFilter", () => {
    const filterText = "test";
    it("should set value and call onFilter", () => {
      let filterRef: any;
      render(
        <TextFilter
          onFilter={onFilter}
          column={column}
          ref={(ref: any) => (filterRef = ref)}
        />
      );
      filterRef.applyFilter(filterText);
      expect(screen.getByRole("textbox")).toHaveValue(filterText);
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalledWith(filterText);
    });
  });

  describe("filter", () => {
    const filterText = "tester";
    it("should set value and call onFilter with delay", () => {
      render(<TextFilter onFilter={onFilter} column={column} />);
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: filterText } });
      // Simulate debounce delay
      jest.runAllTimers();
      expect(input).toHaveValue(filterText);
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalledWith(filterText);
    });
  });
});
