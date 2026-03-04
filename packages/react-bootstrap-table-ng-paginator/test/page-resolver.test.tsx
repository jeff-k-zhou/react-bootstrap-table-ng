import { renderHook } from "@testing-library/react";
import { usePagination, UsePaginationProps } from "../src/hooks/usePagination";
import Const from "../src/const";

describe("usePagination", () => {
  const createMockProps = (): UsePaginationProps => ({
    dataSize: 100,
    sizePerPageList: [
      { text: "10", value: 20 },
      { text: "30", value: 50 },
    ],
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
  });

  describe("initialize", () => {
    it("should calculate totalPages correctly", () => {
      const { result } = renderHook(() => usePagination(createMockProps()));
      expect(result.current.totalPages).toBe(10);
    });

    it("should calculate lastPage correctly", () => {
      const { result } = renderHook(() => usePagination(createMockProps()));
      expect(result.current.lastPage).toBe(10);
    });
  });

  describe("handleChangePage", () => {
    it("should call onPageChange with correct page for numerical input", () => {
        const props = createMockProps();
        const { result } = renderHook(() => usePagination(props));
        result.current.handleChangePage(2);
        expect(props.onPageChange).toHaveBeenCalledWith(2, 10);
    });

    it("should call onPageChange with correct page for prePageText", () => {
        const props = createMockProps();
        props.currPage = 2;
        const { result } = renderHook(() => usePagination(props));
        result.current.handleChangePage(props.prePageText);
        expect(props.onPageChange).toHaveBeenCalledWith(1, 10);
    });

    it("should call onPageChange with correct page for nextPageText", () => {
        const props = createMockProps();
        const { result } = renderHook(() => usePagination(props));
        result.current.handleChangePage(props.nextPageText);
        expect(props.onPageChange).toHaveBeenCalledWith(2, 10);
    });
  });

  describe("fromTo", () => {
    it("should return correct array with from and to value", () => {
        const { result } = renderHook(() => usePagination(createMockProps()));
        expect(result.current.fromTo).toEqual([1, 10]);
    });

    it("should return correct array with from and to value if data is empty", () => {
      const props = createMockProps();
      props.dataSize = 0;
      const { result } = renderHook(() => usePagination(props));
      expect(result.current.fromTo).toEqual([0, 0]);
    });
  });

  describe("getSizePerPageStatus", () => {
    it("should get correctly sizePerPage status", () => {
        const props = createMockProps();
        const { result } = renderHook(() => usePagination(props));
        const status = result.current.getSizePerPageStatus();
        expect(status.length).toEqual(props.sizePerPageList.length);
        expect(status[0].text).toBe("10");
        expect(status[0].page).toBe(20);
    });
  });
});
