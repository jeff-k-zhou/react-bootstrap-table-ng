import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SizePerPageOption from "../src/size-per-page-option";

describe("SizePerPageOption", () => {
  const text = "page1";
  const page = 1;
  const onSizePerPageChange = jest.fn();

  beforeEach(() => {
    onSizePerPageChange.mockReset();
  });

  describe("when bootstrap4 prop is false", () => {
    beforeEach(() => {
      render(<SizePerPageOption text={text} page={page} onSizePerPageChange={onSizePerPageChange} />);
    });

    it("should render SizePerPageOption correctly", () => {
      const li = screen.getByRole("menuitem");
      expect(li).toBeInTheDocument();
      expect(li).toHaveAttribute("data-page", `${page}`);
      expect(li.textContent).toEqual(text);
    });

    describe("when MouseDown event happen", () => {
      it("should call props.onSizePerPageChange correctly", () => {
        const li = screen.getByRole("menuitem");
        const preventDefault = jest.fn();
        fireEvent.mouseDown(li, { preventDefault });
        expect(preventDefault).toHaveBeenCalled();
        expect(onSizePerPageChange).toHaveBeenCalledTimes(1);
        expect(onSizePerPageChange).toHaveBeenCalledWith(page);
      });
    });
  });

  describe("when bootstrap4 prop is true", () => {
    beforeEach(() => {
      render(<SizePerPageOption text={text} page={page} onSizePerPageChange={onSizePerPageChange} bootstrap4 />);
    });

    it("should render SizePerPageOption correctly", () => {
      const li = screen.getByRole("menuitem");
      expect(li).toBeInTheDocument();
      expect(li).toHaveAttribute("data-page", `${page}`);
      expect(li.textContent).toEqual(text);
    });

    describe("when MouseDown event happen", () => {
      it("should call props.onSizePerPageChange correctly", () => {
        const li = screen.getByRole("menuitem");
        const preventDefault = jest.fn();
        fireEvent.mouseDown(li, { preventDefault });
        expect(preventDefault).toHaveBeenCalled();
        expect(onSizePerPageChange).toHaveBeenCalledTimes(1);
        expect(onSizePerPageChange).toHaveBeenCalledWith(page);
      });
    });
  });
});
