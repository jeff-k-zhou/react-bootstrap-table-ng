import React from "react";
import { render, screen } from "@testing-library/react";
import paginationHandler from "../src/pagination-handler";

const MockComponent = (props: any) => (
  <div data-testid="mock-component">
    <div data-testid="curr-page">{props.currPage}</div>
    <div data-testid="total-pages">{props.totalPages}</div>
    <div data-testid="last-page">{props.lastPage}</div>
    <button data-testid="page-change-btn" onClick={() => props.onPageChange(2)}>Change Page</button>
    <button data-testid="size-change-btn" onClick={() => props.onSizePerPageChange(20, 1)}>Change Size</button>
  </div>
);
const MockComponentWithPaginationHandler = paginationHandler(MockComponent);

describe("paginationHandler", () => {
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
    it("should render MockComponent with correct injected props", () => {
      render(<MockComponentWithPaginationHandler {...createMockProps()} />);
      expect(screen.getByTestId("mock-component")).toBeInTheDocument();
      expect(screen.getByTestId("curr-page")).toHaveTextContent("1");
      expect(screen.getByTestId("total-pages")).toHaveTextContent("10"); // 100 / 10
      expect(screen.getByTestId("last-page")).toHaveTextContent("10");
    });
  });

  describe("handleChangePage", () => {
    it("should call props.onPageChange via injected onPageChange prop", () => {
        const props = createMockProps();
        render(<MockComponentWithPaginationHandler {...props} />);
        screen.getByTestId("page-change-btn").click();
        expect(props.onPageChange).toHaveBeenCalledWith(2, 10); // page 2, current size 10
    });
  });

  describe("handleChangeSizePerPage", () => {
    it("should call props.onSizePerPageChange via injected onSizePerPageChange prop", () => {
        const props = createMockProps();
        render(<MockComponentWithPaginationHandler {...props} />);
        screen.getByTestId("size-change-btn").click();
        expect(props.onSizePerPageChange).toHaveBeenCalledWith(20, 1);
    });
  });

  describe("re-render on prop change", () => {
    it("should update totalPages when dataSize changes", () => {
      const { rerender } = render(<MockComponentWithPaginationHandler {...createMockProps()} />);
      expect(screen.getByTestId("total-pages")).toHaveTextContent("10");
      
      rerender(<MockComponentWithPaginationHandler {...createMockProps({ dataSize: 50 })} />);
      expect(screen.getByTestId("total-pages")).toHaveTextContent("5");
    });

    it("should update totalPages when currSizePerPage changes", () => {
        const { rerender } = render(<MockComponentWithPaginationHandler {...createMockProps()} />);
        expect(screen.getByTestId("total-pages")).toHaveTextContent("10");
        
        rerender(<MockComponentWithPaginationHandler {...createMockProps({ currSizePerPage: 20 })} />);
        expect(screen.getByTestId("total-pages")).toHaveTextContent("5");
      });
  });
});
