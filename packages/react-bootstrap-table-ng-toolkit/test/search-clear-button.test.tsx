import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClearButton from "../src/search/clear-button";

describe("ClearButton", () => {
  const onClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default text 'Clear'", () => {
    render(<ClearButton onClear={onClear} />);
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("renders with custom text", () => {
    render(<ClearButton onClear={onClear} text="Reset" />);
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("calls onClear when clicked", () => {
    render(<ClearButton onClear={onClear} />);
    fireEvent.click(screen.getByText("Clear"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("applies default classes", () => {
    const { container } = render(<ClearButton onClear={onClear} />);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("btn");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ClearButton onClear={onClear} className="custom-clear" />
    );
    expect(container.querySelector(".custom-clear")).toBeInTheDocument();
  });
});
