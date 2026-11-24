import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExpansionHeaderCell from "../../src/row-expand/expand-header-cell";

describe("ExpansionHeaderCell", () => {
  const onAllRowExpand = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a th element with expand-cell-header class", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <ExpansionHeaderCell
              isAnyExpands={false}
              onAllRowExpand={onAllRowExpand}
            />
          </tr>
        </thead>
      </table>
    );
    expect(container.querySelector(".expand-cell-header")).toBeInTheDocument();
  });

  it("shows (+) when isAnyExpands is false", () => {
    render(
      <table>
        <thead>
          <tr>
            <ExpansionHeaderCell
              isAnyExpands={false}
              onAllRowExpand={onAllRowExpand}
            />
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByText("(+)")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Expand all rows");
  });

  it("shows (-) when isAnyExpands is true", () => {
    render(
      <table>
        <thead>
          <tr>
            <ExpansionHeaderCell
              isAnyExpands={true}
              onAllRowExpand={onAllRowExpand}
            />
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByText("(-)")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Collapse all rows");
  });

  it("calls onAllRowExpand with negated state when clicked", () => {
    render(
      <table>
        <thead>
          <tr>
            <ExpansionHeaderCell
              isAnyExpands={false}
              onAllRowExpand={onAllRowExpand}
            />
          </tr>
        </thead>
      </table>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onAllRowExpand).toHaveBeenCalledWith(expect.anything(), true);
  });

  it("calls onAllRowExpand with false when isAnyExpands=true and clicked", () => {
    render(
      <table>
        <thead>
          <tr>
            <ExpansionHeaderCell
              isAnyExpands={true}
              onAllRowExpand={onAllRowExpand}
            />
          </tr>
        </thead>
      </table>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onAllRowExpand).toHaveBeenCalledWith(expect.anything(), false);
  });

  it("calls onAllRowExpand on Enter key", () => {
    render(
      <table>
        <thead>
          <tr>
            <ExpansionHeaderCell
              isAnyExpands={false}
              onAllRowExpand={onAllRowExpand}
            />
          </tr>
        </thead>
      </table>
    );
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(onAllRowExpand).toHaveBeenCalled();
  });

  it("calls onAllRowExpand on Space key", () => {
    render(
      <table>
        <thead>
          <tr>
            <ExpansionHeaderCell
              isAnyExpands={false}
              onAllRowExpand={onAllRowExpand}
            />
          </tr>
        </thead>
      </table>
    );
    fireEvent.keyDown(screen.getByRole("button"), { key: " " });
    expect(onAllRowExpand).toHaveBeenCalled();
  });

  it("does not call onAllRowExpand on other keys", () => {
    render(
      <table>
        <thead>
          <tr>
            <ExpansionHeaderCell
              isAnyExpands={false}
              onAllRowExpand={onAllRowExpand}
            />
          </tr>
        </thead>
      </table>
    );
    fireEvent.keyDown(screen.getByRole("button"), { key: "Escape" });
    expect(onAllRowExpand).not.toHaveBeenCalled();
  });

  it("uses custom expandHeaderColumnRenderer when provided", () => {
    const expandHeaderColumnRenderer = jest
      .fn()
      .mockReturnValue(<span>CustomHeader</span>);
    render(
      <table>
        <thead>
          <tr>
            <ExpansionHeaderCell
              isAnyExpands={false}
              onAllRowExpand={onAllRowExpand}
              expandHeaderColumnRenderer={expandHeaderColumnRenderer}
            />
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByText("CustomHeader")).toBeInTheDocument();
    expect(expandHeaderColumnRenderer).toHaveBeenCalledWith({ isAnyExpands: false });
  });

  it("handles undefined isAnyExpands (defaults to false)", () => {
    render(
      <table>
        <thead>
          <tr>
            <ExpansionHeaderCell onAllRowExpand={onAllRowExpand} />
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });
});
