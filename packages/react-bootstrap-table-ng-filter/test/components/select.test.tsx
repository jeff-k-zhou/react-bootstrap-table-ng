import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FILTER_TYPES } from "../..";
import SelectFilter from "../../src/components/select";

describe("Select Filter", () => {
  let programmaticallyFilter: any;

  const onFilter = jest.fn();
  const onFilterFirstReturn = jest.fn();

  const column = {
    dataField: "quality",
    text: "Product Quality",
  };

  const options: { [index: number | string]: string } = {
    0: "Bad",
    1: "Good",
    2: "Unknown",
  };

  beforeEach(() => {
    onFilter.mockReset();
    onFilterFirstReturn.mockReset();
    onFilter.mockReturnValue(onFilterFirstReturn);
  });

  describe("initialization", () => {
    beforeEach(() => {
      render(
        <SelectFilter onFilter={onFilter} column={column} options={options} />
      );
    });

    it("should have correct state", () => {
      // No direct state access, but placeholder should be present
      expect(screen.getByTestId("select-filter")).toBeInTheDocument();
      expect(screen.getByTestId("select-filter")).toHaveClass("select-filter");
      expect(screen.getByTestId("select-filter-placeholder")).toBeInTheDocument();
    });

    it("should rendering component successfully", () => {
      expect(screen.getByTestId("select-filter")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByTestId("select-filter")).toHaveClass("select-filter");
      expect(screen.getByTestId("select-filter-placeholder")).toBeInTheDocument();
    });

    it("should rendering select options correctly", () => {
      const select = screen.getByRole("combobox");
      const optionEls = select.querySelectorAll("option");
      expect(optionEls.length).toBe(Object.keys(options).length + 1);
      expect(optionEls[0].textContent).toEqual(`Select ${column.text}...`);
      Object.keys(options).forEach((key, i) => {
        expect(optionEls[i + 1].value).toEqual(key);
        expect(optionEls[i + 1].textContent).toEqual(options[key]);
      });
    });
  });

  describe("when defaultValue is defined", () => {
    let defaultValue: any;

    describe("and it is valid", () => {
      beforeEach(() => {
        defaultValue = "0";
        render(
          <SelectFilter
            onFilter={onFilter}
            column={column}
            options={options}
            defaultValue={defaultValue}
          />
        );
      });

      it("should have correct state", () => {
        // Placeholder should not be present
        expect(screen.queryByTestId("select-filter-placeholder")).not.toBeInTheDocument();
      });

      it("should rendering component successfully", () => {
        expect(screen.getByTestId("select-filter")).toBeInTheDocument();
      });

      it("should calling onFilter on componentDidMount", () => {
        expect(onFilter).toHaveBeenCalledTimes(1);
        expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.SELECT, true);
        expect(onFilterFirstReturn).toHaveBeenCalledTimes(1);
        expect(onFilterFirstReturn).toHaveBeenCalledWith(defaultValue);
      });
    });
  });

  describe("when props.getFilter is defined", () => {
    const filterValue = "foo";
    const getFilter = (filter: any) => {
      programmaticallyFilter = filter;
    };

    beforeEach(() => {
      render(
        <SelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          getFilter={getFilter}
        />
      );
      const { act } = require("@testing-library/react");
      act(() => {
        programmaticallyFilter(filterValue);
      });
    });

    it("should do onFilter correctly when exported function was executed", () => {
      expect(onFilter).toHaveBeenCalledTimes(1);
      expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.SELECT);
      expect(onFilterFirstReturn).toHaveBeenCalledTimes(1);
      expect(onFilterFirstReturn).toHaveBeenCalledWith(filterValue);
    });
  });

  describe("when placeholder is defined", () => {
    const placeholder = "test";
    beforeEach(() => {
      render(
        <SelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          placeholder={placeholder}
        />
      );
    });

    it("should rendering component successfully", () => {
      const select = screen.getByRole("combobox");
      expect(select.querySelector("option")?.textContent).toEqual(placeholder);
    });
  });

  describe("when style is defined", () => {
    const style = { backgroundColor: "red" };
    beforeEach(() => {
      render(
        <SelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          style={style}
        />
      );
    });

    it("should rendering component successfully", () => {
      expect(screen.getByRole("combobox")).toHaveStyle("background-color: rgb(255, 0, 0)");
    });
  });

  describe("when withoutEmptyOption is defined", () => {
    beforeEach(() => {
      render(
        <SelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          withoutEmptyOption
        />
      );
    });

    it("should rendering select without default empty option", () => {
      const select = screen.getByRole("combobox");
      expect(select.querySelectorAll("option").length).toBe(Object.keys(options).length);
    });
  });

  describe("componentDidUpdate", () => {
    it("should update when defaultValue changes", () => {
      const { rerender } = render(
        <SelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          defaultValue="0"
        />
      );
      const { act } = require("@testing-library/react");
      act(() => {
        rerender(
          <SelectFilter
            onFilter={onFilter}
            column={column}
            options={options}
            defaultValue="1"
          />
        );
      });
      expect(onFilter).toHaveBeenCalledTimes(2);
      expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.SELECT);
      expect(onFilterFirstReturn).toHaveBeenCalledTimes(2);
      expect(onFilterFirstReturn).toHaveBeenCalledWith("1");
    });

    it("should update when options changes", () => {
      const { rerender } = render(
        <SelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          defaultValue="1"
        />
      );
      const { act } = require("@testing-library/react");
      act(() => {
        rerender(
          <SelectFilter
            onFilter={onFilter}
            column={column}
            options={{ ...options, 3: "Best" }}
            defaultValue="1"
          />
        );
      });
      expect(onFilter).toHaveBeenCalledTimes(2);
      expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.SELECT);
      expect(onFilterFirstReturn).toHaveBeenCalledTimes(2);
      expect(onFilterFirstReturn).toHaveBeenCalledWith("1");
    });
  });

  describe("cleanFiltered", () => {
    it("should call onFilter and set state correctly when defaultValue is defined", () => {
      let filterRef: any;
      render(
        <SelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          defaultValue="0"
          ref={(ref: any) => (filterRef = ref)}
        />
      );
      const { act } = require("@testing-library/react");
      act(() => {
        filterRef.cleanFiltered();
      });
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalled();
    });

    it("should call onFilter and set state correctly when defaultValue is not defined", () => {
      let filterRef: any;
      render(
        <SelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          ref={(ref: any) => (filterRef = ref)}
        />
      );
      const { act } = require("@testing-library/react");
      act(() => {
        filterRef.cleanFiltered();
      });
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalled();
    });
  });

  describe("applyFilter", () => {
    const value = "2";
    it("should call onFilter and set state correctly", () => {
      let filterRef: any;
      render(
        <SelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          ref={(ref: any) => (filterRef = ref)}
        />
      );
      const { act } = require("@testing-library/react");
      act(() => {
        filterRef.applyFilter(value);
      });
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalledWith(value);
    });
  });

  describe("filter", () => {
    const value = "0";
    it("should call onFilter and set state correctly", () => {
      render(
        <SelectFilter onFilter={onFilter} column={column} options={options} />
      );
      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value } });
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalledWith(value);
    });
  });
});
