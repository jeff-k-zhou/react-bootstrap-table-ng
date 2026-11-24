import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExpandCell from "../../src/row-expand/expand-cell";

describe("ExpandCell", () => {
  const onRowExpand = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a td with expand-cell class", () => {
    render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={false}
              expandable={true}
              onRowExpand={onRowExpand}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByTestId("expand-cell")).toBeInTheDocument();
  });

  it("shows expand button with (+) when not expanded", () => {
    render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={false}
              expandable={true}
              onRowExpand={onRowExpand}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText("(+)")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("shows collapse button with (-) when expanded", () => {
    render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={true}
              expandable={true}
              onRowExpand={onRowExpand}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText("(-)")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("renders empty content when not expandable", () => {
    render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={false}
              expandable={false}
              onRowExpand={onRowExpand}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onRowExpand with negated expanded when clicked", () => {
    render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={false}
              expandable={true}
              onRowExpand={onRowExpand}
              rowIndex={0}
            />
          </tr>
        </tbody>
      </table>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onRowExpand).toHaveBeenCalledWith(1, true, 0, expect.anything());
  });

  it("calls onRowExpand when Enter key is pressed", () => {
    render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={2}
              expanded={false}
              expandable={true}
              onRowExpand={onRowExpand}
              rowIndex={1}
            />
          </tr>
        </tbody>
      </table>
    );
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(onRowExpand).toHaveBeenCalledWith(2, true, 1, expect.anything());
  });

  it("calls onRowExpand when Space key is pressed", () => {
    render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={3}
              expanded={true}
              expandable={true}
              onRowExpand={onRowExpand}
              rowIndex={2}
            />
          </tr>
        </tbody>
      </table>
    );
    fireEvent.keyDown(screen.getByRole("button"), { key: " " });
    expect(onRowExpand).toHaveBeenCalledWith(3, false, 2, expect.anything());
  });

  it("uses custom expandColumnRenderer when provided", () => {
    const expandColumnRenderer = jest.fn().mockReturnValue(<span>Custom</span>);
    render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={false}
              expandable={true}
              onRowExpand={onRowExpand}
              expandColumnRenderer={expandColumnRenderer}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(expandColumnRenderer).toHaveBeenCalledWith({
      expandable: true,
      expanded: false,
      rowKey: 1,
    });
  });

  it("renders expansionRowId as aria-controls on button", () => {
    render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={false}
              expandable={true}
              onRowExpand={onRowExpand}
              expansionRowId="expansion-row-1"
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-controls", "expansion-row-1");
  });

  /* eslint-disable jsx-a11y/tabindex-no-positive */
  it("sets tabIndex from prop", () => {
    render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={false}
              expandable={true}
              onRowExpand={onRowExpand}
              tabIndex={2}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByRole("button")).toHaveAttribute("tabindex", "2");
  });
  /* eslint-enable jsx-a11y/tabindex-no-positive */

  it("has aria-label 'Expand row' when not expanded and expandable", () => {
    render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={false}
              expandable={true}
              onRowExpand={onRowExpand}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Expand row");
  });

  it("has aria-label 'Collapse row' when expanded and expandable", () => {
    render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={true}
              expandable={true}
              onRowExpand={onRowExpand}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Collapse row");
  });

  it("handles memo rerender with identical and different props", () => {
    const { rerender } = render(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={false}
              expandable={true}
              rowIndex={0}
              tabIndex={0}
              onRowExpand={onRowExpand}
            />
          </tr>
        </tbody>
      </table>
    );

    rerender(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={false}
              expandable={true}
              rowIndex={0}
              tabIndex={0}
              onRowExpand={onRowExpand}
            />
          </tr>
        </tbody>
      </table>
    );

    rerender(
      <table>
        <tbody>
          <tr>
            <ExpandCell
              rowKey={1}
              expanded={true}
              expandable={true}
              rowIndex={0}
              tabIndex={0}
              onRowExpand={onRowExpand}
            />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText("(-)")).toBeInTheDocument();
  });
});
