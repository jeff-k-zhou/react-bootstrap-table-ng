import React from "react";
import { render, screen } from "@testing-library/react";
import PageButton from "../src/page-button";
import PaginationList from "../src/pagination-list";

describe("PaginationList", () => {
  const onPageChange = jest.fn();
  const pages = [
    {
      page: 1,
      active: false,
      disabled: false,
      title: "1",
    },
    {
      page: 2,
      active: true,
      disabled: false,
      title: "2",
    },
    {
      page: 3,
      active: false,
      disabled: false,
      title: "3",
    },
  ];

  beforeEach(() => {
    onPageChange.mockReset();
  });

  it("should render PaginationList correctly", () => {
    render(<PaginationList pages={pages} onPageChange={onPageChange} />);
    // Check for the ul element with the correct class
    const ul = screen.getByRole("list");
    expect(ul).toHaveClass("react-bootstrap-table-page-btns-ul");
    // There should be as many PageButton components as pages
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBe(pages.length);
    // Check that each button has the correct title
    pages.forEach((p) => {
      expect(screen.getByTitle(p.title)).toBeInTheDocument();
    });
  });

  describe("when props.pageButtonRenderer is existing", () => {
    const pageButtonRenderer = jest.fn().mockReturnValue(<li>Custom</li>);
    beforeEach(() => {
      pageButtonRenderer.mockClear();
      render(
        <PaginationList
          pages={pages}
          onPageChange={onPageChange}
          pageButtonRenderer={pageButtonRenderer}
        />
      );
    });

    it("should call props.pageButtonRenderer correctly", () => {
      expect(pageButtonRenderer).toHaveBeenCalledTimes(pages.length);
    });

    it("should render custom page buttons", () => {
      // Should render the custom li elements
      expect(screen.getAllByText("Custom").length).toBe(pages.length);
    });
  });
});
