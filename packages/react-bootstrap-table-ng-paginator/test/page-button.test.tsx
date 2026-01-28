import React from "react";
import { render, screen, fireEvent, createEvent } from "@testing-library/react";
import PageButton from "../src/page-button";

describe("PageButton", () => {
  const onPageChangeCallback = jest.fn();
  const props = {
    onPageChange: onPageChangeCallback,
    page: 2,
  };

  afterEach(() => {
    onPageChangeCallback.mockReset();
  });

  describe("default PageButton", () => {
    beforeEach(() => {
      render(<PageButton {...props} active disabled={false} />);
    });

    it("should render PageButton correctly", () => {
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass("page-link");
      expect(link.textContent).toEqual(`${props.page}`);
    });

    describe("when clicking", () => {
      it("should call preventDefault and onPageChange prop with correct argument", () => {
        const link = screen.getByRole("link");
        const event = createEvent.click(link);
        fireEvent(link, event);
        expect(event.defaultPrevented).toBe(true);
        expect(onPageChangeCallback).toHaveBeenCalledTimes(1);
        expect(onPageChangeCallback).toHaveBeenCalledWith(props.page);
      });
    });
  });

  describe("when active prop is true", () => {
    beforeEach(() => {
      render(<PageButton {...props} active disabled={false} />);
    });

    it("should render PageButton with active class", () => {
      const li = screen.getByRole("listitem");
      expect(li).toHaveClass("active");
    });
  });

  describe("when active prop is false", () => {
    beforeEach(() => {
      render(<PageButton {...props} active={false} disabled={false} />);
    });

    it("should render PageButton without active class", () => {
      const li = screen.getByRole("listitem");
      expect(li).not.toHaveClass("active");
    });
  });

  describe("when disabled prop is true", () => {
    beforeEach(() => {
      render(<PageButton {...props} active disabled />);
    });

    it("should render PageButton with disabled class", () => {
      const li = screen.getByRole("listitem");
      expect(li).toHaveClass("disabled");
    });
  });

  describe("when disabled prop is false", () => {
    beforeEach(() => {
      render(<PageButton {...props} active disabled={false} />);
    });

    it("should render PageButton without disabled class", () => {
      const li = screen.getByRole("listitem");
      expect(li).not.toHaveClass("disabled");
    });
  });

  describe("when title prop is defined", () => {
    const title = "aTitle";
    beforeEach(() => {
      render(<PageButton {...props} active disabled={false} title={title} />);
    });

    it("should render PageButton with correct title", () => {
      const link = screen.getByRole("link");
      expect(link.parentElement).toHaveAttribute("title", title);
    });
  });
});
