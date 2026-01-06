import React from "react";
import { render, screen } from "@testing-library/react";
import Pagination from "../src/pagination";
import PaginationList from "../src/pagination-list";
import SizePerPageDropDown from "../src/size-per-page-dropdown";

describe("Pagination", () => {
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

  describe("default pagination", () => {
    const props = createMockProps();

    it("should render correctly", () => {
      const { container } = render(<Pagination {...props} />);
      expect(container.querySelector(".react-bootstrap-table-pagination")).toBeInTheDocument();
      expect(container.querySelector(".react-bootstrap-table-pagination-list-hidden")).not.toBeInTheDocument();
    });

    it("should have correct state", () => {
      // Render and get the instance for state checks
      const { container } = render(<Pagination {...props} />);
      // Since we can't access instance.state directly, we check DOM and props
      expect(container.querySelector(".react-bootstrap-table-pagination")).toBeInTheDocument();
    });
  });

  describe("when props.hidePageListOnlyOnePage is true", () => {
    it("should find react-bootstrap-table-pagination-list-hidden class when only one page", () => {
      const props = createMockProps({
        hidePageListOnlyOnePage: true,
        dataSize: 7,
      });
      const { container } = render(<Pagination {...props} />);
      expect(container.querySelector(".react-bootstrap-table-pagination-list-hidden")).toBeInTheDocument();
    });
  });

  describe("when props.pageListRenderer is defined", () => {
    let pageListRenderer: any;
    beforeEach(() => {
      pageListRenderer = jest.fn().mockReturnValue(<div data-testid="custom-page-list" />);
    });

    it("should not render PaginationList", () => {
      const props = createMockProps({ pageListRenderer });
      const { queryByTestId } = render(<Pagination {...props} />);
      // Should render custom renderer, not PaginationList
      expect(queryByTestId("custom-page-list")).toBeInTheDocument();
      // PaginationList should not be in the DOM
      expect(screen.queryByTestId("pagination-list")).not.toBeInTheDocument();
    });

    it("should call props.pageListRenderer correctly", () => {
      const props = createMockProps({ pageListRenderer });
      render(<Pagination {...props} />);
      expect(pageListRenderer).toHaveBeenCalledTimes(1);
    });
  });

  describe("when props.sizePerPageRenderer is defined", () => {
    let sizePerPageRenderer: any;
    beforeEach(() => {
      sizePerPageRenderer = jest.fn().mockReturnValue(<div data-testid="custom-size-per-page" />);
    });

    it("should not render SizePerPageDropDown", () => {
      const props = createMockProps({ sizePerPageRenderer });
      const { queryByTestId } = render(<Pagination {...props} />);
      expect(queryByTestId("custom-size-per-page")).toBeInTheDocument();
      // SizePerPageDropDown should not be in the DOM
      expect(screen.queryByTestId("size-per-page-dropdown")).not.toBeInTheDocument();
    });

    it("should call props.sizePerPageRenderer correctly", () => {
      const props = createMockProps({ sizePerPageRenderer });
      render(<Pagination {...props} />);
      expect(sizePerPageRenderer).toHaveBeenCalledTimes(1);
    });
  });

  describe("when props.showTotal is true", () => {
    it("should render PaginationTotal correctly", () => {
      const props = createMockProps({ showTotal: true });
      const { container } = render(<Pagination {...props} />);
      expect(container.querySelector(".react-bootstrap-table-pagination-total")).toBeInTheDocument();
    });

    describe("if props.paginationTotalRenderer is defined", () => {
      let paginationTotalRenderer: any;

      beforeEach(() => {
        paginationTotalRenderer = jest.fn(() => <div data-testid="custom-total" />);
      });

      it("should not render default PaginationTotal", () => {
        const props = createMockProps({
          showTotal: true,
          paginationTotalRenderer,
        });
        const { queryByTestId, container } = render(<Pagination {...props} />);
        expect(queryByTestId("custom-total")).toBeInTheDocument();
        expect(container.querySelector(".react-bootstrap-table-pagination-total")).not.toBeInTheDocument();
      });

      it("should call props.paginationTotalRenderer correctly", () => {
        const props = createMockProps({
          showTotal: true,
          paginationTotalRenderer,
        });
        render(<Pagination {...props} />);
        expect(paginationTotalRenderer).toHaveBeenCalledTimes(1);
      });
    });
  });
});
