import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import sizePerPageDropdownAdapter from "../src/size-per-page-dropdown-adapter";

const MockComponent = (props: any) => (
  <div data-testid="mock-component">
    <button data-testid="toggle-btn" onClick={props.onClick}>Toggle</button>
    <button data-testid="change-btn" onClick={() => props.onSizePerPageChange(25)}>Change</button>
    <div data-testid="dropdown-state">{props.open ? "open" : "closed"}</div>
    <div data-testid="curr-size">{props.currSizePerPage}</div>
  </div>
);

const SizePerPageDropdownAdapter = sizePerPageDropdownAdapter(MockComponent);

describe("sizePerPageDropdownAdapter", () => {
  const createMockProps = (props?: any) => ({
    dataSize: 100,
    sizePerPageList: [10, 20, 30, 50],
    currPage: 1,
    currSizePerPage: 10,
    alwaysShowAllBtns: false,
    onSizePerPageChange: jest.fn(),
    hidePageListOnlyOnePage: false,
    hideSizePerPage: false,
    optionRenderer: jest.fn(),
    sizePerPageOptionRenderer: jest.fn(),
    ...props,
  });

  describe("render", () => {
    it("should render successfully and pass correct props", () => {
      render(<SizePerPageDropdownAdapter {...createMockProps()} />);
      expect(screen.getByTestId("mock-component")).toBeInTheDocument();
      expect(screen.getByTestId("curr-size")).toHaveTextContent("10");
      expect(screen.getByTestId("dropdown-state")).toHaveTextContent("closed");
    });
  });

  describe("when props.sizePerPageList is empty array", () => {
    it("should not render component", () => {
      render(<SizePerPageDropdownAdapter {...createMockProps({ sizePerPageList: [] })} />);
      expect(screen.queryByTestId("mock-component")).not.toBeInTheDocument();
    });
  });

  describe("when props.hideSizePerPage is true", () => {
    it("should not render component", () => {
      render(<SizePerPageDropdownAdapter {...createMockProps({ hideSizePerPage: true })} />);
      expect(screen.queryByTestId("mock-component")).not.toBeInTheDocument();
    });
  });

  describe("toggleDropDown", () => {
    it("should toggle dropdownOpen state", () => {
      render(<SizePerPageDropdownAdapter {...createMockProps()} />);
      const toggleBtn = screen.getByTestId("toggle-btn");
      const state = screen.getByTestId("dropdown-state");

      expect(state).toHaveTextContent("closed");
      fireEvent.click(toggleBtn);
      expect(state).toHaveTextContent("open");
      fireEvent.click(toggleBtn);
      expect(state).toHaveTextContent("closed");
    });
  });

  describe("handleChangeSizePerPage", () => {
    it("should call props.onSizePerPageChange and close dropdown", () => {
      const props = createMockProps();
      render(<SizePerPageDropdownAdapter {...props} />);
      
      const toggleBtn = screen.getByTestId("toggle-btn");
      const changeBtn = screen.getByTestId("change-btn");
      const state = screen.getByTestId("dropdown-state");

      fireEvent.click(toggleBtn);
      expect(state).toHaveTextContent("open");

      fireEvent.click(changeBtn);
      expect(props.onSizePerPageChange).toHaveBeenCalledWith(25, 1);
      expect(state).toHaveTextContent("closed");
    });
  });

  describe("when props.sizePerPageRenderer is defined", () => {
    it("should not render default component and call renderer", () => {
      const sizePerPageRenderer = jest.fn().mockReturnValue(<div data-testid="custom-renderer" />);
      render(<SizePerPageDropdownAdapter {...createMockProps({ sizePerPageRenderer })} />);
      
      expect(screen.queryByTestId("mock-component")).not.toBeInTheDocument();
      expect(screen.getByTestId("custom-renderer")).toBeInTheDocument();
      expect(sizePerPageRenderer).toHaveBeenCalledTimes(1);
    });
  });
});
