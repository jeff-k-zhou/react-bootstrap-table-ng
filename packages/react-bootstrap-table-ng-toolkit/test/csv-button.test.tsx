import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExportCSVButton from "../src/csv/button";

describe("ExportCSVButton", () => {
  const onExport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a button with default class", () => {
    const { container } = render(
      <ExportCSVButton onExport={onExport}>Export CSV</ExportCSVButton>
    );
    const button = container.querySelector("button");
    expect(button).toBeInTheDocument();
    expect(button?.className).toContain("react-bs-table-csv-btn");
  });

  it("calls onExport when clicked", () => {
    render(
      <ExportCSVButton onExport={onExport}>Export</ExportCSVButton>
    );
    fireEvent.click(screen.getByText("Export"));
    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it("renders children", () => {
    render(
      <ExportCSVButton onExport={onExport}>My Export</ExportCSVButton>
    );
    expect(screen.getByText("My Export")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ExportCSVButton onExport={onExport} className="custom-class">
        Export
      </ExportCSVButton>
    );
    expect(container.querySelector("button")?.className).toContain("custom-class");
  });

  it("applies custom style", () => {
    const { container } = render(
      <ExportCSVButton onExport={onExport} style={{ color: "red" }}>
        Export
      </ExportCSVButton>
    );
    expect((container.querySelector("button") as HTMLButtonElement)?.style.color).toBe("red");
  });
});
