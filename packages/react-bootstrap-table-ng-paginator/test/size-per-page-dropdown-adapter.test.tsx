import React from "react";
import { render } from "@testing-library/react";
import sizePerPageDropdownAdapter from "../src/size-per-page-dropdown-adapter";

const MockComponent = () => null;

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
    it("should render successfully", () => {
      let receivedProps: any = null;
      const SpyComponent = (p: any) => {
        receivedProps = p;
        return null;
      };
      const AdapterWithSpy = sizePerPageDropdownAdapter(SpyComponent);
      render(<AdapterWithSpy {...createMockProps()} />);
      expect(receivedProps).toBeDefined();
      expect(receivedProps.currSizePerPage).toEqual("10");
      expect(receivedProps.options).toBeDefined();
      expect(receivedProps.optionRenderer).toBeDefined();
      expect(typeof receivedProps.onSizePerPageChange).toBe("function");
      expect(typeof receivedProps.onClick).toBe("function");
      expect(typeof receivedProps.onBlur).toBe("function");
      expect(typeof receivedProps.open).toBe("boolean");
    });
  });

  describe("when props.sizePerPageList is empty array", () => {
    it("should not render component", () => {
      let rendered = false;
      const SpyComponent = () => {
        rendered = true;
        return null;
      };
      const AdapterWithSpy = sizePerPageDropdownAdapter(SpyComponent);
      render(<AdapterWithSpy {...createMockProps({ sizePerPageList: [] })} />);
      expect(rendered).toBe(false);
    });
  });

  describe("when props.hideSizePerPage is true", () => {
    it("should not render component", () => {
      let rendered = false;
      const SpyComponent = () => {
        rendered = true;
        return null;
      };
      const AdapterWithSpy = sizePerPageDropdownAdapter(SpyComponent);
      render(<AdapterWithSpy {...createMockProps({ hideSizePerPage: true })} />);
      expect(rendered).toBe(false);
    });
  });

  describe("toggleDropDown", () => {
    it("should toggle dropdownOpen state", () => {
      const AdapterClass: any = SizePerPageDropdownAdapter;
      const instance = new AdapterClass(createMockProps());
      instance.setState = (updater: any) => {
        const nextState = typeof updater === "function" ? updater(instance.state) : updater;
        instance.state = { ...instance.state, ...nextState };
      };
      expect(instance.state.dropdownOpen).toBeFalsy();
      instance.toggleDropDown();
      expect(instance.state.dropdownOpen).toBeTruthy();
      instance.toggleDropDown();
      expect(instance.state.dropdownOpen).toBeFalsy();
    });
  });

  describe("closeDropDown", () => {
    it("should always set dropdownOpen to false", () => {
      const AdapterClass: any = SizePerPageDropdownAdapter;
      const instance = new AdapterClass(createMockProps());
      instance.setState = (updater: any) => {
        const nextState = typeof updater === "function" ? updater(instance.state) : updater;
        instance.state = { ...instance.state, ...nextState };
      };
      instance.state.dropdownOpen = true;
      instance.closeDropDown();
      expect(instance.state.dropdownOpen).toBeFalsy();
      instance.closeDropDown();
      expect(instance.state.dropdownOpen).toBeFalsy();
    });
  });

  describe("handleChangeSizePerPage", () => {
    it("should call props.onSizePerPageChange and close dropdown", () => {
      const props = createMockProps();
      const AdapterClass: any = SizePerPageDropdownAdapter;
      const instance = new AdapterClass(props);
      instance.setState = jest.fn();
      instance.handleChangeSizePerPage(25);
      expect(props.onSizePerPageChange).toHaveBeenCalledTimes(1);
      expect(props.onSizePerPageChange).toHaveBeenCalledWith(25);
      expect(instance.setState).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("when props.sizePerPageRenderer is defined", () => {
    it("should not render default component and call renderer", () => {
      const sizePerPageRenderer = jest.fn().mockReturnValue(null);
      let rendered = false;
      const SpyComponent = () => {
        rendered = true;
        return null;
      };
      const AdapterWithSpy = sizePerPageDropdownAdapter(SpyComponent);
      render(
        <AdapterWithSpy
          {...createMockProps({ sizePerPageRenderer })}
        />
      );
      expect(rendered).toBe(false);
      expect(sizePerPageRenderer).toHaveBeenCalledTimes(1);
    });
  });
});
