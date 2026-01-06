import React from "react";
import { render } from "@testing-library/react";
import paginationHandler from "../src/pagination-handler";

const MockComponent = () => null;
const MockComponentWithPaginationHandler = paginationHandler(MockComponent);

describe("paginationHandler", () => {
  let instance: any;

  const createMockProps = (props?: any) => ({
    dataSize: 100,
    sizePerPageList: [10, 20, 30, 50],
    currPage: 1,
    currSizePerPage: 10,
    pageStartIndex: 1,
    paginationSize: 5,
    withFirstAndLast: true,
    firstPageText: "<<",
    prePageText: "<",
    nextPageText: ">",
    lastPageText: ">>",
    alwaysShowAllBtns: false,
    onPageChange: jest.fn(),
    onSizePerPageChange: jest.fn(),
    hidePageListOnlyOnePage: false,
    hideSizePerPage: false,
    ...props,
  });

  function getInstance(props = createMockProps()) {
    // Render and get the instance from the rendered tree
    let inst: any;
    function InstanceGetter(props: any) {
      inst = React.useRef<any>(null);
      return (
        <MockComponentWithPaginationHandler
          ref={inst}
          {...props}
        />
      );
    }
    render(<InstanceGetter {...props} />);
    // Since paginationHandler is a class component, we can instantiate directly for logic tests
    return new (MockComponentWithPaginationHandler as any)(props);
  }

  describe("default pagination", () => {
    let props: any;
    beforeEach(() => {
      props = createMockProps();
      instance = getInstance(props);
    });

    it("should have correct state", () => {
      expect(instance.state).toBeDefined();
      expect(instance.state.totalPages).toEqual(instance.calculateTotalPage());
      expect(instance.state.lastPage).toEqual(
        instance.calculateLastPage(instance.state.totalPages)
      );
    });

    it("should render MockComponent with correct props", () => {
      const rendered = render(<MockComponentWithPaginationHandler {...props} />);
      // Since MockComponent renders null, we check props via instance
      expect(instance.props.lastPage).toBeUndefined(); // lastPage is not a prop, but state
      expect(instance.state.lastPage).toBeDefined();
      expect(instance.state.totalPages).toBeDefined();
      expect(typeof instance.handleChangePage).toBe("function");
      expect(typeof instance.handleChangeSizePerPage).toBe("function");
    });
  });

  describe("handleChangePage", () => {
    let props: any;
    beforeEach(() => {
      props = createMockProps({ currPage: 6 });
      instance = getInstance(props);
    });

    afterEach(() => {
      props.onPageChange.mockClear();
    });

    it("should call props.onPageChange correctly when new page is prePageText", () => {
      instance.handleChangePage(props.prePageText);
      expect(props.onPageChange).toHaveBeenCalledWith(5);
    });

    it("should call props.onPageChange correctly when new page is nextPageText", () => {
      instance.handleChangePage(props.nextPageText);
      expect(props.onPageChange).toHaveBeenCalledWith(7);
    });

    it("should call props.onPageChange correctly when new page is lastPageText", () => {
      instance.handleChangePage(props.lastPageText);
      expect(props.onPageChange).toHaveBeenCalledWith(10);
    });

    it("should call props.onPageChange correctly when new page is firstPageText", () => {
      instance.handleChangePage(props.firstPageText);
      expect(props.onPageChange).toHaveBeenCalledWith(props.pageStartIndex);
    });

    it("should call props.onPageChange correctly when new page is a numeric page", () => {
      const newPage = "8";
      instance.handleChangePage(newPage);
      expect(props.onPageChange).toHaveBeenCalledWith(parseInt(newPage, 10));
    });

    it("should not call props.onPageChange when page is not changed", () => {
      const newPage = props.currPage;
      instance.handleChangePage(newPage);
      expect(props.onPageChange).not.toHaveBeenCalled();
    });
  });

  describe("handleChangeSizePerPage", () => {
    let props: any;
    beforeEach(() => {
      props = createMockProps();
      instance = getInstance(props);
    });

    it("should always set state.dropdownOpen to false", () => {
      instance.handleChangeSizePerPage(10);
      expect(instance.state.dropdownOpen).toBeFalsy();
    });

    describe("when new sizePerPage is same as current one", () => {
      it("should not call props.onSizePerPageChange callback", () => {
        instance.handleChangeSizePerPage(10);
        expect(props.onSizePerPageChange).not.toHaveBeenCalled();
      });
    });

    describe("when new sizePerPage is different than current one", () => {
      it("should call props.onSizePerPageChange callback", () => {
        instance.handleChangeSizePerPage(30);
        expect(props.onSizePerPageChange).toHaveBeenCalled();
      });

      it("should call props.onSizePerPageChange with correct argument if new current page is still in the new pagination list", () => {
        instance.handleChangeSizePerPage(30);
        expect(props.onSizePerPageChange).toHaveBeenCalledWith(30, props.currPage);
      });

      it("should call props.onSizePerPageChange with correct argument if new current page is not in the new pagination list", () => {
        const customProps = createMockProps({ currPage: 10 });
        const customInstance = getInstance(customProps);
        customInstance.handleChangeSizePerPage(30);
        expect(customProps.onSizePerPageChange).toHaveBeenCalledWith(30, 4);
      });
    });
  });

  describe("componentDidUpdate", () => {
    it("should set correct state.totalPages when currSizePerPage changes", () => {
      const nextProps = createMockProps({ currSizePerPage: 20 });
      instance = getInstance(createMockProps());
      instance.componentDidUpdate(nextProps);
      expect(instance.state.totalPages).toEqual(
        instance.calculateTotalPage(instance.state.currSizePerPage)
      );
    });

    it("should set correct state.lastPage when currSizePerPage changes", () => {
      const nextProps = createMockProps({ currSizePerPage: 20 });
      instance = getInstance(createMockProps());
      instance.componentDidUpdate(nextProps);
      const totalPages = instance.calculateTotalPage(instance.state.currSizePerPage);
      expect(instance.state.lastPage).toEqual(
        instance.calculateLastPage(totalPages)
      );
    });

    it("should set correct state.totalPages when dataSize changes", () => {
      const nextProps = createMockProps({ dataSize: 33 });
      instance = getInstance(createMockProps());
      instance.componentDidUpdate(nextProps);
      expect(instance.state.totalPages).toEqual(
        instance.calculateTotalPage(
          instance.state.currSizePerPage,
          instance.state.dataSize
        )
      );
    });

    it("should set correct state.lastPage when dataSize changes", () => {
      const nextProps = createMockProps({ dataSize: 33 });
      instance = getInstance(createMockProps());
      instance.componentDidUpdate(nextProps);
      const totalPages = instance.calculateTotalPage(
        instance.state.currSizePerPage,
        instance.state.dataSize
      );
      expect(instance.state.lastPage).toEqual(
        instance.calculateLastPage(totalPages)
      );
    });
  });
});
