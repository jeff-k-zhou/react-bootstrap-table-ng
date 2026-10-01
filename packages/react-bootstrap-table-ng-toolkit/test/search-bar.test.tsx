import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "../src/search/SearchBar";

describe("SearchBar component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders with default props and handles search input", () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
    expect(input).toHaveAttribute("placeholder", "Search");

    fireEvent.change(input, { target: { value: "abc" } });
    expect(input).toHaveValue("abc");

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(onSearch).toHaveBeenCalledWith("abc");
  });

  it("handles custom placeholder, delay, className, and defaultSearchText", () => {
    const onSearch = jest.fn();
    const { rerender } = render(
      <SearchBar
        placeholder="Custom Search"
        className="custom-search-class"
        searchText="initial"
        delay={100}
        onSearch={onSearch}
      />
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("initial");
    expect(input).toHaveAttribute("placeholder", "Custom Search");
    expect(input).toHaveClass("custom-search-class");

    // Rerender with new searchText
    rerender(
      <SearchBar
        placeholder="Custom Search"
        className="custom-search-class"
        searchText="updated"
        delay={100}
        onSearch={onSearch}
      />
    );
    expect(input).toHaveValue("updated");

    // Rerender with empty string to cover defaultSearchText || ""
    rerender(
      <SearchBar
        placeholder="Custom Search"
        className="custom-search-class"
        searchText=""
        delay={100}
        onSearch={onSearch}
      />
    );
    expect(input).toHaveValue("");
  });

  it("handles null searchText prop on mount", () => {
    render(<SearchBar searchText={null as any} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("handles input change when onSearch is not provided", () => {
    render(<SearchBar delay={50} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(input).toHaveValue("test");

    // Clear input to test "Search cleared" branch
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByText("Search cleared")).toBeInTheDocument();
  });

  it("ClearButton renders with default and custom props", () => {
    const ClearButton = require("../src/search/clear-button").default;
    const onClear = jest.fn();
    const { rerender } = render(<ClearButton onClear={onClear} />);
    const btn = screen.getByRole("button", { name: "Clear" });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClear).toHaveBeenCalled();

    rerender(<ClearButton onClear={onClear} text="Reset Search" className="my-btn" />);
    expect(screen.getByRole("button", { name: "Reset Search" })).toHaveClass("my-btn");
  });
});

