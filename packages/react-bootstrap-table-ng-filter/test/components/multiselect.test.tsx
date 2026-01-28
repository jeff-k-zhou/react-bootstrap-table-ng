import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FILTER_TYPES } from "../..";
import MultiSelectFilter from "../../src/components/multiselect";

describe("Multi Select Filter", () => {
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

  afterEach(() => {
    onFilter.mockReset();
    onFilterFirstReturn.mockReset();
    onFilter.mockReturnValue(onFilterFirstReturn);
  });

  describe("initialization", () => {
    beforeEach(() => {
      onFilter.mockReturnValue(onFilterFirstReturn);
      render(
        <MultiSelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
        />
      );
    });

    it("should rendering component successfully", () => {
      expect(screen.getByTestId("multiselect-filter")).toBeInTheDocument();
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(screen.getByTestId("multiselect-filter")).toHaveClass("select-filter");
      expect(screen.getByTestId("multiselect-placeholder")).toBeInTheDocument();
    });

    it("should rendering select options correctly", () => {
      const select = screen.getByRole("listbox");
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
        defaultValue = ["0"];
        onFilter.mockReturnValue(onFilterFirstReturn);
        render(
          <MultiSelectFilter
            onFilter={onFilter}
            column={column}
            options={options}
            defaultValue={defaultValue}
          />
        );
      });

      it("should rendering component successfully", () => {
        expect(screen.getByTestId("multiselect-filter")).toBeInTheDocument();
        expect(screen.queryByTestId("multiselect-placeholder")).not.toBeInTheDocument();
      });

      it("should calling onFilter on mount", () => {
        expect(onFilter).toHaveBeenCalledTimes(1);
        expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.MULTISELECT);
        expect(onFilterFirstReturn).toHaveBeenCalledTimes(1);
        expect(onFilterFirstReturn).toHaveBeenCalledWith(defaultValue);
      });
    });
  });

  describe("when props.getFilter is defined", () => {
    const filterValue = ["foo"];
    const getFilter = (filter: any) => {
      programmaticallyFilter = filter;
    };

    beforeEach(() => {
      onFilter.mockReturnValue(onFilterFirstReturn);
      render(
        <MultiSelectFilter
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
      expect(onFilter).toHaveBeenCalledWith(column, FILTER_TYPES.MULTISELECT);
      expect(onFilterFirstReturn).toHaveBeenCalledTimes(1);
      expect(onFilterFirstReturn).toHaveBeenCalledWith(filterValue);
    });
  });

  describe("when placeholder is defined", () => {
    const placeholder = "test";
    beforeEach(() => {
      render(
        <MultiSelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          placeholder={placeholder}
        />
      );
    });

    it("should rendering component successfully", () => {
      const select = screen.getByRole("listbox");
      expect(select.querySelector("option")?.textContent).toEqual(placeholder);
    });
  });

  describe("when style is defined", () => {
    const style = { backgroundColor: "red" };
    beforeEach(() => {
      render(
        <MultiSelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          style={style}
        />
      );
    });

    it("should rendering component successfully", () => {
      expect(screen.getByRole("listbox")).toHaveStyle("background-color: rgb(255, 0, 0)");
    });
  });

  describe("when withoutEmptyOption is defined", () => {
    beforeEach(() => {
      render(
        <MultiSelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          withoutEmptyOption
        />
      );
    });

    it("should rendering select without default empty option", () => {
      const select = screen.getByRole("listbox");
      expect(select.querySelectorAll("option").length).toBe(Object.keys(options).length);
    });
  });

  describe("componentDidUpdate", () => {
    it("should update when defaultValue changes", () => {
      const { rerender } = render(
        <MultiSelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          defaultValue={["1"]}
        />
      );
      const { act } = require("@testing-library/react");
      act(() => {
        rerender(
          <MultiSelectFilter
            onFilter={onFilter}
            column={column}
            options={options}
            defaultValue={[]}
          />
        );
      });
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalled();
    });

    it("should update when options changes", () => {
      const { rerender } = render(
        <MultiSelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
        />
      );
      const { act } = require("@testing-library/react");
      act(() => {
        rerender(
          <MultiSelectFilter
            onFilter={onFilter}
            column={column}
            options={{ ...options, 3: "Best" }}
          />
        );
      });
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalled();
    });
  });

  describe("cleanFiltered", () => {
    it("should call onFilter and set state correctly when defaultValue is defined", () => {
      const defaultValue = ["0"];
      let filterRef: any;
      render(
        <MultiSelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          defaultValue={defaultValue}
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
        <MultiSelectFilter
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
    const values = ["2"];
    it("should call onFilter and set state correctly", () => {
      let filterRef: any;
      render(
        <MultiSelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
          ref={(ref: any) => (filterRef = ref)}
        />
      );
      const { act } = require("@testing-library/react");
      act(() => {
        filterRef.applyFilter(values);
      });
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalledWith(values);
    });
  });

  describe("filter", () => {
    it("should call onFilter and set state correctly", () => {
      render(
        <MultiSelectFilter
          onFilter={onFilter}
          column={column}
          options={options}
        />
      );
      const select = screen.getByRole("listbox");
      const value = ["0"];
      fireEvent.change(select, {
        target: { value: ["0"] },
      });
      expect(onFilter).toHaveBeenCalled();
      expect(onFilterFirstReturn).toHaveBeenCalledWith(value);
    });
  });
});
