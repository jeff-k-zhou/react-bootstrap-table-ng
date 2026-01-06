import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SizePerPageDropDown from "../src/size-per-page-dropdown";
import SizePerPageOption from "../src/size-per-page-option";

describe("SizePerPageDropDown", () => {
  const currSizePerPage = "25";
  const options = [
    {
      text: "10",
      page: 10,
    },
    {
      text: "25",
      page: 25,
    },
  ];
  const onClick = jest.fn();
  const onBlur = jest.fn();
  const onSizePerPageChange = jest.fn();
  const props = {
    currSizePerPage,
    options,
    onClick,
    onBlur,
    onSizePerPageChange,
  };

  beforeEach(() => {
    onClick.mockReset();
    onBlur.mockReset();
    onSizePerPageChange.mockReset();
  });

  describe("default SizePerPageDropDown component", () => {
    beforeEach(() => {
      render(<SizePerPageDropDown {...props} />);
    });

    it("should render SizePerPageDropDown correctly", () => {
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain(currSizePerPage);
    });

    it("should render SizePerPageOption successfully", () => {
      const list = screen.getByRole("menu");
      expect(list).toBeInTheDocument();
      const items = screen.getAllByRole("menuitem");
      expect(items.length).toBe(options.length);
      options.forEach((option) => {
        expect(screen.getByText(option.text)).toBeInTheDocument();
      });
    });

    it("default variation is dropdown", () => {
      const dropdown = screen.getByTestId("size-per-page-dropdown");
      expect(dropdown.className).toMatch(/dropdown/);
    });

    it("default dropdown is not open", () => {
      const dropdown = screen.getByTestId("size-per-page-dropdown");
      expect(dropdown.className).not.toMatch(/open|show/);
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("when bootstrap4 context is true", () => {
    beforeEach(() => {
      render(<SizePerPageDropDown {...props} bootstrap4 />);
    });

    it("should render SizePerPageDropDown correctly", () => {
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain(currSizePerPage);
    });

    it("should render SizePerPageOption successfully", () => {
      const items = screen.getAllByRole("menuitem");
      expect(items.length).toBe(options.length);
      options.forEach((option) => {
        expect(screen.getByText(option.text)).toBeInTheDocument();
      });
    });

    it("no need to render caret", () => {
      // Should not find any element with class 'caret'
      const dropdown = screen.getByTestId("size-per-page-dropdown");
      expect(dropdown.querySelector(".caret")).toBeNull();
    });

    it("default variation is dropdown", () => {
      const dropdown = screen.getByTestId("size-per-page-dropdown");
      expect(dropdown.className).toMatch(/dropdown/);
    });

    it("default dropdown is not open", () => {
      const dropdown = screen.getByTestId("size-per-page-dropdown");
      expect(dropdown.className).not.toMatch(/open|show/);
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("when open prop is true", () => {
    beforeEach(() => {
      render(<SizePerPageDropDown {...props} open />);
    });

    it("should render SizePerPageDropDown correctly", () => {
      const dropdown = screen.getByTestId("size-per-page-dropdown");
      expect(dropdown.className).toMatch(/open|show/);
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("when hidden prop is true", () => {
    beforeEach(() => {
      render(<SizePerPageDropDown {...props} hidden />);
    });

    it("should render SizePerPageDropDown correctly", () => {
      const dropdown = screen.getByTestId("size-per-page-dropdown");
      expect(dropdown).toHaveStyle("visibility: hidden");
    });
  });

  describe("when btnContextual prop is defined", () => {
    const contextual = "btn-warning";
    beforeEach(() => {
      render(<SizePerPageDropDown {...props} btnContextual={contextual} />);
    });

    it("should render SizePerPageDropDown correctly", () => {
      const button = screen.getByRole("button");
      expect(button.className).toMatch(new RegExp(contextual));
    });
  });

  describe("when variation prop is defined", () => {
    const variation = "dropup";
    beforeEach(() => {
      render(<SizePerPageDropDown {...props} variation={variation} />);
    });

    it("should render SizePerPageDropDown correctly", () => {
      const dropdown = screen.getByTestId("size-per-page-dropdown");
      expect(dropdown.className).toMatch(new RegExp(variation));
    });
  });

  describe("when className prop is defined", () => {
    const className = "custom-class";
    beforeEach(() => {
      render(<SizePerPageDropDown {...props} className={className} />);
    });

    it("should render SizePerPageDropDown correctly", () => {
      const dropdown = screen.getByTestId("size-per-page-dropdown");
      expect(dropdown.className).toMatch(new RegExp(className));
    });
  });

  describe("when optionRenderer prop is defined", () => {
    const optionRenderer = jest.fn((option: any) => <li role="menuitem">{option.text}</li>);
    beforeEach(() => {
      optionRenderer.mockClear();
      render(<SizePerPageDropDown {...props} optionRenderer={optionRenderer} />);
    });

    it("should not render SizePerPageOption", () => {
      // Should not find SizePerPageOption in the DOM
      expect(screen.queryByTestId("size-per-page-option")).toBeNull();
    });

    it("should call optionRenderer prop correctly", () => {
      expect(optionRenderer).toHaveBeenCalledTimes(props.options.length);
    });
  });
});
