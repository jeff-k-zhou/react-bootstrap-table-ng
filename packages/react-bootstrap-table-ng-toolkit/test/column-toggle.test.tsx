import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ToggleList from "../src/column-toggle/toggle-list";

describe("ToggleList", () => {
  const columns = [
    { dataField: "id", text: "ID" },
    { dataField: "name", text: "Name" },
    { dataField: "age", text: "Age" },
  ];

  const toggles: Record<string, boolean> = { id: true, name: false, age: true };

  const onColumnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders buttons for each column", () => {
    render(
      <ToggleList
        columns={columns}
        onColumnToggle={onColumnToggle}
        toggles={toggles}
      />
    );
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("marks toggled columns as active", () => {
    render(
      <ToggleList
        columns={columns}
        onColumnToggle={onColumnToggle}
        toggles={toggles}
      />
    );
    const idBtn = screen.getByText("ID").closest("button");
    const nameBtn = screen.getByText("Name").closest("button");
    expect(idBtn).toHaveClass("active");
    expect(nameBtn).not.toHaveClass("active");
  });

  it("calls onColumnToggle with dataField when clicked", () => {
    render(
      <ToggleList
        columns={columns}
        onColumnToggle={onColumnToggle}
        toggles={toggles}
      />
    );
    fireEvent.click(screen.getByText("Name"));
    expect(onColumnToggle).toHaveBeenCalledWith("name");
  });

  it("announces the toggled column via aria-live", () => {
    render(
      <ToggleList
        columns={columns}
        onColumnToggle={onColumnToggle}
        toggles={toggles}
      />
    );
    fireEvent.click(screen.getByText("Name"));
    const liveRegion = screen.getByText(/Column Name visibility toggled/);
    expect(liveRegion).toBeInTheDocument();
  });

  it("applies contextual class to buttons", () => {
    render(
      <ToggleList
        columns={columns}
        onColumnToggle={onColumnToggle}
        toggles={toggles}
        contextual="danger"
      />
    );
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn.className).toContain("btn-danger");
    });
  });

  it("applies custom btnClassName", () => {
    render(
      <ToggleList
        columns={columns}
        onColumnToggle={onColumnToggle}
        toggles={toggles}
        btnClassName="my-custom-btn"
      />
    );
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn.className).toContain("my-custom-btn");
    });
  });

  it("applies custom className to the container div", () => {
    const { container } = render(
      <ToggleList
        columns={columns}
        onColumnToggle={onColumnToggle}
        toggles={toggles}
        className="custom-group"
      />
    );
    expect(container.querySelector(".custom-group")).toBeInTheDocument();
  });

  it("sets aria-pressed on buttons based on toggle state", () => {
    render(
      <ToggleList
        columns={columns}
        onColumnToggle={onColumnToggle}
        toggles={toggles}
      />
    );
    const idBtn = screen.getByText("ID").closest("button");
    const nameBtn = screen.getByText("Name").closest("button");
    expect(idBtn).toHaveAttribute("aria-pressed", "true");
    expect(nameBtn).toHaveAttribute("aria-pressed", "false");
  });
});
