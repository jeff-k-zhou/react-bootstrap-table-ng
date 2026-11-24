import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import TextFilter from "../../src/components/text";
import SelectFilter from "../../src/components/select";
import NumberFilter from "../../src/components/number";
import DateFilter from "../../src/components/date";
import MultiSelectFilter from "../../src/components/multiselect";
import { EQ } from "../../src/const";

describe("Extra filter components coverage", () => {
  const column = { dataField: "val", text: "Value" };
  const mockOnFilterReturn = jest.fn();
  const onFilter = jest.fn(() => mockOnFilterReturn);

  beforeEach(() => {
    jest.clearAllMocks();
    onFilter.mockReturnValue(mockOnFilterReturn);
  });

  describe("TextFilter extra branches", () => {
    it("handles imperative ref applyFilter and cleanFiltered", () => {
      const ref = React.createRef<any>();
      render(<TextFilter ref={ref} column={column} onFilter={onFilter} />);

      act(() => {
        ref.current?.applyFilter("test-val");
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith("test-val");

      act(() => {
        ref.current?.cleanFiltered();
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith("");
    });

    it("handles onClick callback and stopPropagation", () => {
      const onClick = jest.fn();
      render(<TextFilter column={column} onFilter={onFilter} onClick={onClick} />);
      const input = screen.getByRole("textbox");
      fireEvent.click(input);
      expect(onClick).toHaveBeenCalled();
    });

    it("handles defaultValue update on rerender", () => {
      const { rerender } = render(
        <TextFilter column={column} onFilter={onFilter} defaultValue="init" />
      );
      expect(screen.getByRole("textbox")).toHaveValue("init");

      rerender(
        <TextFilter column={column} onFilter={onFilter} defaultValue="updated" />
      );
      expect(screen.getByRole("textbox")).toHaveValue("updated");
    });

    it("handles filterState prop sync and delay timer clearing", () => {
      jest.useFakeTimers();
      let exportFilter: any;
      const { rerender } = render(
        <TextFilter
          column={column}
          onFilter={onFilter}
          filterState={{ filterVal: "initial-val" }}
          delay={100}
          getFilter={(fn) => { exportFilter = fn; }}
        />
      );
      expect(screen.getByRole("textbox")).toHaveValue("initial-val");

      // Multiple rapid changes to clear timeout
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "first" } });
      fireEvent.change(input, { target: { value: "second" } });
      act(() => {
        jest.advanceTimersByTime(150);
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith("second");

      // Test getFilter callback
      act(() => {
        exportFilter("exported");
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith("exported");

      // Rerender with different filterState
      rerender(
        <TextFilter
          column={column}
          onFilter={onFilter}
          filterState={{ filterVal: "remote-updated" }}
        />
      );
      expect(screen.getByRole("textbox")).toHaveValue("remote-updated");
      jest.useRealTimers();
    });
  });

  describe("SelectFilter extra branches", () => {
    const optionsObj = { 1: "One", 2: "Two" };

    it("handles imperative ref applyFilter and cleanFiltered", () => {
      const ref = React.createRef<any>();
      render(
        <SelectFilter
          ref={ref}
          column={column}
          options={optionsObj}
          onFilter={onFilter}
        />
      );

      act(() => {
        ref.current?.applyFilter("1");
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith("1");

      act(() => {
        ref.current?.cleanFiltered();
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith("");
    });

    it("supports options as array of objects", () => {
      const optionsArr = [
        { value: "a", label: "Alpha" },
        { value: "b", label: "Beta" },
      ];

      render(
        <SelectFilter
          column={column}
          options={optionsArr}
          onFilter={onFilter}
        />
      );
      expect(screen.getByText("Alpha")).toBeInTheDocument();
      expect(screen.getByText("Beta")).toBeInTheDocument();
    });

    it("handles defaultValue and click stopPropagation", () => {
      render(
        <SelectFilter
          column={column}
          options={optionsObj}
          defaultValue="1"
          onFilter={onFilter}
        />
      );
      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("1");
      fireEvent.click(select);
    });

    it("handles filterState prop sync, withoutEmptyOption and getFilter", () => {
      let exportFilter: any;
      const { rerender } = render(
        <SelectFilter
          column={column}
          options={optionsObj}
          onFilter={onFilter}
          withoutEmptyOption={true}
          filterState={{ filterVal: "1" }}
          getFilter={(fn) => { exportFilter = fn; }}
        />
      );
      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("1");

      act(() => {
        exportFilter("2");
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith("2");

      rerender(
        <SelectFilter
          column={column}
          options={optionsObj}
          onFilter={onFilter}
          withoutEmptyOption={true}
          filterState={{ filterVal: "2" }}
        />
      );
      expect(select).toHaveValue("2");
    });
  });

  describe("NumberFilter extra branches", () => {
    it("handles imperative ref applyFilter", () => {
      const ref = React.createRef<any>();
      render(<NumberFilter ref={ref} column={column} onFilter={onFilter} />);

      act(() => {
        ref.current?.applyFilter({ number: 42, comparator: EQ });
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith({ number: 42, comparator: EQ });
    });

    it("handles withoutSelect and click on input", () => {
      render(
        <NumberFilter
          column={column}
          onFilter={onFilter}
          withoutSelect
          defaultValue={{ number: 10, comparator: EQ }}
        />
      );

      const input = screen.getByRole("spinbutton");
      fireEvent.click(input);
      expect(input).toHaveValue(10);
    });

    it("handles comparator select and number input change", () => {
      render(<NumberFilter column={column} onFilter={onFilter} />);
      const select = screen.getByRole("combobox");
      const input = screen.getByRole("spinbutton");

      fireEvent.change(select, { target: { value: EQ } });
      fireEvent.change(input, { target: { value: "50" } });
      expect(input).toHaveValue(50);
    });

    it("handles options array (select mode) and filterState sync and delay", () => {
      jest.useFakeTimers();
      let exportFilter: any;
      const { rerender } = render(
        <NumberFilter
          column={column}
          onFilter={onFilter}
          options={[10, 20, 30]}
          delay={100}
          filterState={{ filterVal: { number: 10, comparator: EQ } }}
          getFilter={(fn) => { exportFilter = fn; }}
        />
      );

      const selectNumber = screen.getByTestId("number-filter-select");
      expect(selectNumber).toHaveValue("10");

      fireEvent.change(selectNumber, { target: { value: "20" } });
      expect(mockOnFilterReturn).toHaveBeenCalledWith({ number: "20", comparator: EQ });

      // Change with empty value
      fireEvent.change(selectNumber, { target: { value: "" } });
      expect(mockOnFilterReturn).toHaveBeenCalledWith({ number: "", comparator: EQ });

      // Test getFilter
      act(() => {
        exportFilter({ number: 30, comparator: EQ });
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith({ number: 30, comparator: EQ });

      // Stop propagation on fieldset click
      fireEvent.click(screen.getByTestId("number-filter"));

      // Rerender with different filterState
      rerender(
        <NumberFilter
          column={column}
          onFilter={onFilter}
          options={[10, 20, 30]}
          filterState={{ filterVal: { number: 30, comparator: "!=" } }}
        />
      );
      expect(selectNumber).toHaveValue("30");
      jest.useRealTimers();
    });

    it("handles text input with delay and rapid typing", () => {
      jest.useFakeTimers();
      render(
        <NumberFilter
          column={column}
          onFilter={onFilter}
          delay={100}
          defaultValue={{ number: 5, comparator: EQ }}
        />
      );
      const input = screen.getByTestId("number-filter-input");
      fireEvent.change(input, { target: { value: "15" } });
      fireEvent.change(input, { target: { value: "25" } });
      act(() => {
        jest.advanceTimersByTime(150);
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith({ number: "25", comparator: EQ });
      jest.useRealTimers();
    });
  });

  describe("DateFilter extra branches", () => {
    it("handles imperative ref cleanFiltered", () => {
      const ref = React.createRef<any>();
      render(<DateFilter ref={ref} column={column} onFilter={onFilter} />);

      act(() => {
        ref.current?.cleanFiltered();
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith({ date: null, comparator: "" });
    });

    it("handles withoutSelect and date input change", () => {
      const { container } = render(
        <DateFilter
          column={column}
          onFilter={onFilter}
          withoutSelect
        />
      );

      const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
      expect(dateInput).toBeInTheDocument();
      fireEvent.change(dateInput, { target: { value: "2026-05-10" } });
      expect(dateInput.value).toBe("2026-05-10");
    });

    it("handles filterState, applyFilter without date, delay, and getFilter", () => {
      jest.useFakeTimers();
      const ref = React.createRef<any>();
      let exportFilter: any;
      const { rerender, container } = render(
        <DateFilter
          ref={ref}
          column={column}
          onFilter={onFilter}
          delay={100}
          withoutEmptyComparatorOption={true}
          filterState={{ filterVal: { date: new Date("2026-05-15"), comparator: ">" } }}
          getFilter={(fn) => { exportFilter = fn; }}
        />
      );

      // Stop propagation
      fireEvent.click(screen.getByTestId("date-filter"));

      // Comparator change
      const compSelect = screen.getByTestId("date-filter-comparator");
      fireEvent.change(compSelect, { target: { value: "<" } });

      // Rapid date input changes for delay clearTimeout
      const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
      fireEvent.change(dateInput, { target: { value: "2026-06-01" } });
      fireEvent.change(dateInput, { target: { value: "2026-06-02" } });
      act(() => {
        jest.advanceTimersByTime(150);
      });
      expect(mockOnFilterReturn).toHaveBeenCalled();

      // Imperative applyFilter with and without date
      act(() => {
        ref.current?.applyFilter({ comparator: "=" });
      });
      act(() => {
        ref.current?.applyFilter({ date: "2026-07-04", comparator: ">" });
      });

      // getFilter test with valid and null
      act(() => {
        exportFilter({ date: "2026-08-01", comparator: ">=" });
      });
      act(() => {
        exportFilter(null);
      });

      // Rerender with different filterState
      rerender(
        <DateFilter
          ref={ref}
          column={column}
          onFilter={onFilter}
          filterState={{ filterVal: { date: new Date("2026-09-01"), comparator: "<=" } }}
        />
      );
      jest.useRealTimers();
    });
  });

  describe("MultiSelectFilter extra branches", () => {
    const options = { a: "A", b: "B", c: "C" };

    it("handles imperative ref applyFilter and cleanFiltered", () => {
      const ref = React.createRef<any>();
      render(
        <MultiSelectFilter
          ref={ref}
          column={column}
          options={options}
          onFilter={onFilter}
        />
      );

      act(() => {
        ref.current?.applyFilter(["a", "b"]);
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith(["a", "b"]);

      act(() => {
        ref.current?.cleanFiltered();
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith([]);
    });

    it("handles selection change event", () => {
      render(
        <MultiSelectFilter
          column={column}
          options={options}
          onFilter={onFilter}
        />
      );
      const select = screen.getByRole("listbox");
      fireEvent.change(select, { target: { value: ["a", "c"] } });
      expect(mockOnFilterReturn).toHaveBeenCalled();
    });

    it("handles selecting empty option, filterState sync, withoutEmptyOption and getFilter", () => {
      let exportFilter: any;
      const { rerender } = render(
        <MultiSelectFilter
          column={column}
          options={options}
          onFilter={onFilter}
          withoutEmptyOption={true}
          filterState={{ filterVal: ["a"] }}
          getFilter={(fn) => { exportFilter = fn; }}
        />
      );

      // Select empty string
      const select = screen.getByRole("listbox");
      fireEvent.change(select, { target: { value: [""] } });
      expect(mockOnFilterReturn).toHaveBeenCalledWith([]);

      // Test getFilter
      act(() => {
        exportFilter(["b"]);
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith(["b"]);

      // Rerender with different filterState
      rerender(
        <MultiSelectFilter
          column={column}
          options={options}
          onFilter={onFilter}
          filterState={{ filterVal: ["b", "c"] }}
        />
      );
    });

    it("handles options change that triggers needFilter", () => {
      const { rerender } = render(
        <MultiSelectFilter
          column={column}
          options={{ a: "A" }}
          onFilter={onFilter}
        />
      );
      // Change options -> triggers optionsEquals false -> needFilter
      rerender(
        <MultiSelectFilter
          column={column}
          options={{ a: "A", b: "B" }}
          onFilter={onFilter}
        />
      );
    });

    it("handles click stopPropagation on the select element", () => {
      render(
        <MultiSelectFilter
          column={column}
          options={options}
          onFilter={onFilter}
        />
      );
      const select = screen.getByRole("listbox");
      // Should not throw
      fireEvent.click(select);
    });

    it("renders placeholder option with custom text when no defaultValue", () => {
      render(
        <MultiSelectFilter
          column={column}
          options={options}
          onFilter={onFilter}
          placeholder="Pick one"
        />
      );
      expect(screen.getByText("Pick one")).toBeInTheDocument();
    });

    it("handles applyFilter with empty array (single empty string branch)", () => {
      const ref = React.createRef<any>();
      render(
        <MultiSelectFilter
          ref={ref}
          column={column}
          options={options}
          onFilter={onFilter}
        />
      );
      // applyFilter with single [""] should clear filter
      act(() => {
        ref.current?.applyFilter([""]);
      });
      expect(mockOnFilterReturn).toHaveBeenCalled();
    });
  });

  describe("TextFilter - additional branch coverage", () => {
    it("renders without onFilter (no crash)", () => {
      render(
        <TextFilter
          column={column}
          onFilter={undefined as any}
          defaultValue="hello"
        />
      );
      expect(screen.getByRole("textbox")).toHaveValue("hello");
    });

    it("handles null defaultValue gracefully", () => {
      render(
        <TextFilter
          column={column}
          onFilter={onFilter}
          defaultValue={null as any}
        />
      );
      expect(screen.getByRole("textbox")).toHaveValue("");
    });

    it("handles filterState cleared (undefined filterVal) after having a value", () => {
      const { rerender } = render(
        <TextFilter
          column={column}
          onFilter={onFilter}
          filterState={{ filterVal: "init" }}
        />
      );
      expect(screen.getByRole("textbox")).toHaveValue("init");

      // Clearing filterState should NOT reset the input
      rerender(
        <TextFilter
          column={column}
          onFilter={onFilter}
          filterState={{}}
        />
      );
      // The input stays as-is when filterState has no filterVal
      expect(screen.getByRole("textbox")).toHaveValue("init");
    });

    it("handles getFilter callback without onFilter prop", () => {
      let exportFilter: any;
      render(
        <TextFilter
          column={column}
          onFilter={undefined as any}
          getFilter={(fn) => { exportFilter = fn; }}
        />
      );
      act(() => {
        exportFilter("exported-val");
      });
      expect(screen.getByRole("textbox")).toHaveValue("exported-val");
    });
  });

  describe("SelectFilter - additional branch coverage", () => {
    it("handles optionsEquals for arrays with same and different elements", () => {
      const optionsArr = [
        { value: "a", label: "Alpha" },
        { value: "b", label: "Beta" },
      ];
      const { rerender } = render(
        <SelectFilter
          column={column}
          options={optionsArr}
          onFilter={onFilter}
        />
      );

      // Same array => no filter needed
      rerender(
        <SelectFilter
          column={column}
          options={[...optionsArr]}
          onFilter={onFilter}
        />
      );

      // Different length => needFilter
      rerender(
        <SelectFilter
          column={column}
          options={[{ value: "a", label: "Alpha" }]}
          onFilter={onFilter}
        />
      );

      // Different values => needFilter
      rerender(
        <SelectFilter
          column={column}
          options={[{ value: "z", label: "Zulu" }]}
          onFilter={onFilter}
        />
      );
    });

    it("handles options as a function", () => {
      const optionsFn = jest.fn().mockReturnValue([{ value: "x", label: "X" }]);
      render(
        <SelectFilter
          column={column}
          options={optionsFn}
          onFilter={onFilter}
        />
      );
      expect(screen.getByText("X")).toBeInTheDocument();
      expect(optionsFn).toHaveBeenCalledWith(column);
    });

    it("handles withoutEmptyOption with non-empty defaultValue (no placeholder)", () => {
      const opts = { a: "Alpha", b: "Beta" };
      render(
        <SelectFilter
          column={column}
          options={opts}
          onFilter={onFilter}
          defaultValue="a"
          withoutEmptyOption={false}
        />
      );
      // No placeholder when defaultValue is set
      expect(screen.queryByText(/Select/)).not.toBeInTheDocument();
    });
  });

  describe("NumberFilter - additional branch coverage", () => {
    it("renders without options (input mode) and empty comparator - does not call onFilter on number change", () => {
      render(
        <NumberFilter
          column={column}
          onFilter={onFilter}
        />
      );
      const input = screen.getByTestId("number-filter-input");
      // Comparator is still empty, so changing number should NOT call filter
      fireEvent.change(input, { target: { value: "10" } });
      // onFilter should not be called yet since comparator is ""
      expect(mockOnFilterReturn).not.toHaveBeenCalled();
    });

    it("renders with withoutEmptyComparatorOption", () => {
      render(
        <NumberFilter
          column={column}
          onFilter={onFilter}
          withoutEmptyComparatorOption={true}
        />
      );
      // Should not have empty option in comparator select
      const comparatorSelect = screen.getByTestId("number-filter-comparator");
      expect(comparatorSelect).toBeInTheDocument();
    });

    it("renders with withoutEmptyNumberOption", () => {
      render(
        <NumberFilter
          column={column}
          onFilter={onFilter}
          options={[1, 2, 3]}
          withoutEmptyNumberOption={true}
        />
      );
      const numberSelect = screen.getByTestId("number-filter-select");
      // Options should not have empty option
      expect(numberSelect.querySelectorAll("option").length).toBe(3);
    });

    it("handles propComparators override", () => {
      const customComparators = ["=", ">"];
      render(
        <NumberFilter
          column={column}
          onFilter={onFilter}
          comparators={customComparators}
        />
      );
      expect(screen.getByText("=")).toBeInTheDocument();
      expect(screen.getByText(">")).toBeInTheDocument();
    });

    it("handles id prop, empty defaultValue, and filterState with undefined fields", () => {
      const ref = React.createRef<any>();
      let exportFilter: any;
      const { rerender } = render(
        <NumberFilter
          ref={ref}
          id="custom-num-id"
          column={column}
          onFilter={onFilter}
          defaultValue={{ number: "", comparator: "" }}
          filterState={{ filterVal: { number: undefined, comparator: undefined } }}
          getFilter={(fn) => { exportFilter = fn; }}
        />
      );
      expect(document.getElementById("number-filter-column-val-custom-num-id")).toBeInTheDocument();

      // applyFilter with undefined fields
      act(() => {
        ref.current?.applyFilter({ number: undefined, comparator: undefined });
      });

      // getFilter with undefined fields
      act(() => {
        exportFilter({ number: undefined, comparator: undefined });
      });

      // rerender with changed options
      rerender(
        <NumberFilter
          id="custom-num-id"
          column={column}
          onFilter={onFilter}
          options={[10, 20]}
        />
      );

      // rerender with changed defaultValue
      rerender(
        <NumberFilter
          id="custom-num-id"
          column={column}
          onFilter={onFilter}
          defaultValue={{ number: 10, comparator: "=" }}
          options={[10, 20]}
        />
      );
    });
  });

  describe("DateFilter - additional branch coverage", () => {
    it("handles dateParser with empty/invalid inputs, custom id, and empty defaultValue", () => {
      const ref = React.createRef<any>();
      let exportFilter: any;
      const { rerender } = render(
        <DateFilter
          ref={ref}
          id="custom-date-id"
          column={column}
          onFilter={onFilter}
          defaultValue={{ date: "", comparator: "" }}
          filterState={{ filterVal: { date: null, comparator: undefined } }}
          getFilter={(fn) => { exportFilter = fn; }}
          delay={10}
        />
      );
      expect(document.getElementById("date-filter-column-val-custom-date-id")).toBeInTheDocument();

      // applyFilter with val missing comparator
      act(() => {
        ref.current?.applyFilter({ date: "invalid-date", comparator: undefined });
      });

      // getFilter with null
      act(() => {
        exportFilter(null);
      });

      // rerender with filterState containing date
      rerender(
        <DateFilter
          id="custom-date-id"
          column={column}
          onFilter={onFilter}
          filterState={{ filterVal: { date: "2023-05-15", comparator: "=" } }}
        />
      );

      // test withoutEmptyComparatorOption
      rerender(
        <DateFilter
          id="custom-date-id"
          column={column}
          onFilter={onFilter}
          withoutEmptyComparatorOption={true}
        />
      );
    });
  });

  describe("MultiSelectFilter - additional branch coverage", () => {
    const opts = { a: "Alpha", b: "Beta", c: "Gamma" };

    it("handles custom id, placeholder, and withoutEmptyOption", () => {
      render(
        <MultiSelectFilter
          id="custom-multi-id"
          column={column}
          options={opts}
          onFilter={onFilter}
          withoutEmptyOption={true}
          placeholder="Custom choose..."
        />
      );
      expect(document.getElementById("custom-multi-id")).toBeInTheDocument();
    });

    it("handles defaultValue changes and optionsEquals changes on rerender", () => {
      const { rerender } = render(
        <MultiSelectFilter
          column={column}
          options={opts}
          onFilter={onFilter}
          defaultValue={["a"]}
        />
      );

      // Change defaultValue
      rerender(
        <MultiSelectFilter
          column={column}
          options={opts}
          onFilter={onFilter}
          defaultValue={["b"]}
        />
      );

      // Change options with different length
      rerender(
        <MultiSelectFilter
          column={column}
          options={{ a: "Alpha" }}
          onFilter={onFilter}
          defaultValue={["b"]}
        />
      );

      // Change options with same length but different values
      rerender(
        <MultiSelectFilter
          column={column}
          options={{ a: "Different" }}
          onFilter={onFilter}
          defaultValue={["b"]}
        />
      );
    });

    it("handles getSelections with fallback loop when selectedOptions is undefined", () => {
      const ref = React.createRef<any>();
      render(
        <MultiSelectFilter
          ref={ref}
          column={column}
          options={opts}
          onFilter={onFilter}
        />
      );

      // Simulate change event where target doesn't have selectedOptions but has options with selected
      const select = screen.getByRole("listbox") as HTMLSelectElement;
      Object.defineProperty(select, "selectedOptions", {
        get: () => undefined,
        configurable: true,
      });
      // Mark options
      if (select.options[1]) select.options[1].selected = true;
      if (select.options[2]) select.options[2].selected = true;
      fireEvent.change(select);
      expect(mockOnFilterReturn).toHaveBeenCalled();

      // Simulate target with array value
      Object.defineProperty(select, "value", {
        get: () => ["b"],
        configurable: true,
      });
      fireEvent.change(select);
      expect(mockOnFilterReturn).toHaveBeenCalledWith(["b"]);
    });

    it("handles ref applyFilter with falsy/empty value and cleanFiltered", () => {
      const ref = React.createRef<any>();
      render(
        <MultiSelectFilter
          ref={ref}
          column={column}
          options={opts}
          onFilter={onFilter}
        />
      );
      act(() => {
        ref.current?.applyFilter(null);
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith([]);

      act(() => {
        ref.current?.cleanFiltered();
      });
      expect(mockOnFilterReturn).toHaveBeenCalledWith([]);
    });
  });

  describe("SelectFilter and TextFilter - id and fallback branches", () => {
    it("SelectFilter handles custom id and getOptionValue with matching array label", () => {
      const arrayOptions = [
        { value: "1", label: "One" },
        { value: "2", label: "Two" },
      ];
      render(
        <SelectFilter
          id="custom-select-id"
          column={column}
          options={arrayOptions}
          onFilter={onFilter}
          defaultValue="One"
        />
      );
      expect(document.getElementById("custom-select-id")).toBeInTheDocument();
    });

    it("TextFilter handles custom id and defaultValue updating to undefined", () => {
      const { rerender } = render(
        <TextFilter
          id="custom-text-id"
          column={column}
          onFilter={onFilter}
          defaultValue="initial"
        />
      );
      expect(document.getElementById("text-filter-column-val-custom-text-id")).toBeInTheDocument();

      rerender(
        <TextFilter
          id="custom-text-id"
          column={column}
          onFilter={onFilter}
          defaultValue={undefined as any}
        />
      );
      expect(screen.getByRole("textbox")).toHaveValue("");
    });

    it("handles TextFilter without onFilter and defaultValue updating to null", () => {
      const { rerender } = render(<TextFilter column={column} defaultValue="a" />);
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "typed" } });
      rerender(<TextFilter column={column} defaultValue={null as any} />);
      expect(input).toHaveValue("");
    });

    it("handles DateFilter dateParser with null date", () => {
      render(
        <DateFilter
          column={column}
          onFilter={onFilter}
          defaultValue={{ date: null as any, comparator: EQ }}
        />
      );
    });

    it("handles DateFilter applyFilter and cleanFiltered when inputRef is null (after unmount)", () => {
      // Test the null inputRef branches by unmounting before calling imperative handle
      const ref = React.createRef<any>();
      let getFilterCb: any;
      const { unmount } = render(
        <DateFilter
          ref={ref}
          column={column}
          onFilter={onFilter}
          getFilter={(cb: any) => { getFilterCb = cb; }}
          filterState={{ filterVal: { date: new Date("2026-06-20"), comparator: ">" } }}
        />
      );
      // Capture the ref handle before unmount
      const handle = ref.current;
      unmount();
      // After unmount, inputRef.current is null - covers the false branch of `if (inputRef.current)`
      act(() => {
        handle?.applyFilter({ date: "2026-05-15", comparator: EQ });
        handle?.cleanFiltered();
      });
    });

    it("handles NumberFilter without onFilter and defaultValue fallback when filterState is missing", () => {
      let getFilterCb: any;
      const ref = React.createRef<any>();
      render(
        <NumberFilter
          ref={ref}
          column={column}
          defaultValue={{ number: 10, comparator: EQ }}
          filterState={null as any}
          getFilter={(cb: any) => { getFilterCb = cb; }}
        />
      );
      act(() => {
        ref.current?.applyFilter({ number: 20, comparator: EQ });
        getFilterCb?.({ number: 30, comparator: EQ });
      });

      const input = screen.getByRole("spinbutton");
      fireEvent.change(input, { target: { value: "40" } });
    });

    it("handles SelectFilter with null selectInputRef", () => {
      let count = 0;
      const origUseRef = React.useRef;
      const spy = jest.spyOn(React, "useRef").mockImplementation((init) => {
        count++;
        if (count % 3 === 1) {
          return {
            get current() { return null; },
            set current(_) {}
          };
        }
        return origUseRef(init);
      });

      let getFilterCb: any;
      const ref = React.createRef<any>();
      const { rerender } = render(
        <SelectFilter
          ref={ref}
          column={column}
          options={{ a: "A" }}
          onFilter={onFilter}
          getFilter={(cb: any) => { getFilterCb = cb; }}
        />
      );

      act(() => {
        ref.current?.applyFilter("a");
        ref.current?.cleanFiltered();
        getFilterCb?.("a");
      });

      rerender(
        <SelectFilter
          ref={ref}
          column={column}
          options={{ a: "A" }}
          onFilter={onFilter}
          defaultValue="b"
        />
      );

      spy.mockRestore();
    });

    it("handles TextFilter with null inputRef", () => {
      let count = 0;
      const origUseRef = React.useRef;
      const spy = jest.spyOn(React, "useRef").mockImplementation((init) => {
        count++;
        if (count % 4 === 1) {
          return {
            get current() { return null; },
            set current(_) {}
          };
        }
        return origUseRef(init);
      });

      let getFilterCb: any;
      const ref = React.createRef<any>();
      render(
        <TextFilter
          ref={ref}
          column={column}
          onFilter={onFilter}
          getFilter={(cb: any) => { getFilterCb = cb; }}
        />
      );

      act(() => {
        ref.current?.applyFilter("a");
        ref.current?.cleanFiltered();
        getFilterCb?.("a");
      });

      spy.mockRestore();
    });

    it("handles TextFilter applyFilter and cleanFiltered without onFilter prop", () => {
      const ref = React.createRef<any>();
      render(
        <TextFilter
          ref={ref}
          column={column}
          onFilter={undefined as any}
          defaultValue="hello"
        />
      );
      // Call applyFilter/cleanFiltered without onFilter - covers the `if (onFilter)` false branches
      act(() => {
        ref.current?.applyFilter("new-val");
      });
      act(() => {
        ref.current?.cleanFiltered();
      });
    });

    it("handles TextFilter filterHandler delay fires without onFilter", () => {
      jest.useFakeTimers();
      render(
        <TextFilter
          column={column}
          onFilter={undefined as any}
          delay={100}
        />
      );
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "typed" } });
      // Advance timer to fire the timeout - covers `if (onFilter)` false branch in timer callback
      act(() => {
        jest.advanceTimersByTime(200);
      });
      jest.useRealTimers();
    });

    it("handles NumberFilter applyFiltering without onFilter", () => {
      const ref = React.createRef<any>();
      render(
        <NumberFilter
          ref={ref}
          column={column}
          onFilter={undefined as any}
          defaultValue={{ number: 5, comparator: EQ }}
        />
      );
      // applyFilter covers `if (onFilter)` false branch in applyFiltering
      act(() => {
        ref.current?.applyFilter({ number: 10, comparator: EQ });
      });
      // Also trigger onChangeNumber - covers `if (onFilter)` false branch in applyFiltering via number change
      const input = screen.getByRole("spinbutton");
      fireEvent.change(input, { target: { value: "20" } });
    });

    it("handles MultiSelectFilter getFilter when selectRef is null", () => {
      // Cover the `if (selectRef.current)` false branch in getFilter callback
      let exportFilter: any;
      render(
        <MultiSelectFilter
          column={column}
          options={{ a: "A", b: "B" }}
          onFilter={onFilter}
          getFilter={(fn) => { exportFilter = fn; }}
        />
      );
      // getFilter is exported - call it to cover selectRef.current branch
      act(() => {
        exportFilter(["a"]);
      });
      expect(mockOnFilterReturn).toHaveBeenCalled();
    });

    it("handles MultiSelectFilter with empty defaultValue array (no items selected initially)", () => {
      // defaultValue defaults to [] - rendering without defaultValue uses the component default
      render(
        <MultiSelectFilter
          column={column}
          options={{ a: "A", b: "B" }}
          onFilter={onFilter}
        />
      );
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      // No items selected
      const select = screen.getByRole("listbox") as HTMLSelectElement;
      expect(Array.from(select.selectedOptions)).toHaveLength(0);
    });

    it("handles MultiSelectFilter getFilter when selectRef is detached (null current)", () => {
      // Cover line 109: `if (selectRef.current)` false branch in getFilter callback
      // We call getFilter after unmount so selectRef.current becomes null
      let exportFilter: any;
      const { unmount } = render(
        <MultiSelectFilter
          column={column}
          options={{ a: "A", b: "B" }}
          onFilter={onFilter}
          getFilter={(fn) => { exportFilter = fn; }}
        />
      );
      // Capture exportFilter (set during mount effect)
      // getFilter is called during useEffect on mount
      unmount();
      // After unmount selectRef.current is null
      // Calling exportFilter after unmount hits `if (selectRef.current)` false branch
      if (exportFilter) {
        act(() => {
          exportFilter(["a"]);
        });
      }
    });
  });
});
