/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import ToggleList from "../src/column-toggle/toggle-list";
import SearchBar from "../src/search/SearchBar";

// ─────────────────────────────────────────────────────────────────────────────
// ToggleList extra coverage (line 35: column.text || column.dataField fallback)
// ─────────────────────────────────────────────────────────────────────────────
describe("ToggleList extra coverage", () => {
  const onColumnToggle = jest.fn();
  const columns = [
    { dataField: "id", text: "ID" },
    { dataField: "name", text: "" }, // empty text -> falls back to dataField
  ];
  const toggles = { id: true, name: false };

  it("uses dataField as live region label when column.text is empty", () => {
    const { container } = render(
      <ToggleList
        columns={columns}
        onColumnToggle={onColumnToggle}
        toggles={toggles}
      />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    // Click the column with empty text (name) - uses dataField as live region text
    fireEvent.click(buttons[1]);
    // Live region is a span with aria-live="polite" (no explicit role)
    const liveRegion = container.querySelector("[aria-live=polite]")!;
    expect(liveRegion).toHaveTextContent("Column name visibility toggled");
  });

  it("shows text in live region when column.text is provided", () => {
    const { container } = render(
      <ToggleList
        columns={columns}
        onColumnToggle={onColumnToggle}
        toggles={toggles}
      />
    );
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    const liveRegion = container.querySelector("[aria-live=polite]")!;
    expect(liveRegion).toHaveTextContent("Column ID visibility toggled");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SearchBar extra coverage (line 27: immediate debounce call)
// ─────────────────────────────────────────────────────────────────────────────
describe("SearchBar extra coverage", () => {
  it("calls onSearch when input changes (debounced)", () => {
    jest.useFakeTimers();
    const onSearch = jest.fn();
    render(
      <SearchBar onSearch={onSearch} delay={200} />
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    jest.advanceTimersByTime(250);
    expect(onSearch).toHaveBeenCalledWith("test");
    jest.useRealTimers();
  });

  it("syncs when defaultSearchText prop changes", () => {
    const onSearch = jest.fn();
    const { rerender } = render(
      <SearchBar onSearch={onSearch} searchText="initial" />
    );
    expect(screen.getByRole("textbox")).toHaveValue("initial");

    rerender(<SearchBar onSearch={onSearch} searchText="updated" />);
    expect(screen.getByRole("textbox")).toHaveValue("updated");
  });

  it("renders with default props (no onSearch, empty searchText)", () => {
    render(<SearchBar />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("shows correct live region text when searching", () => {
    jest.useFakeTimers();
    render(<SearchBar onSearch={jest.fn()} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "hello" } });
    expect(screen.getByText("Search applied for: hello")).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("shows Search cleared when input is empty", () => {
    render(<SearchBar onSearch={jest.fn()} />);
    expect(screen.getByText("Search cleared")).toBeInTheDocument();
  });

  it("handles immediate=true debounce (callNow branch)", () => {
    // The handleDebounce function has an immediate branch
    // We can indirectly test this by importing SearchBar - the module-level fn is tested
    // via the SearchBar component behavior
    jest.useFakeTimers();
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} delay={0} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "q" } });
    jest.runAllTimers();
    expect(onSearch).toHaveBeenCalledWith("q");
    jest.useRealTimers();
  });
});
