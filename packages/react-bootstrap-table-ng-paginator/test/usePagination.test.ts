import { renderHook, act } from "@testing-library/react";
import EventEmitter from "events";
import { usePagination } from "../src/hooks/usePagination";
import { usePaginationState } from "../src/hooks/usePaginationState";
import Const from "../src/const";

describe("usePagination and usePaginationState hooks", () => {
  const baseProps = {
    currPage: 1,
    currSizePerPage: 10,
    dataSize: 50,
    pageStartIndex: 1,
    paginationSize: 5,
    withFirstAndLast: true,
    firstPageText: "<<",
    prePageText: "<",
    nextPageText: ">",
    lastPageText: ">>",
    alwaysShowAllBtns: false,
    sizePerPageList: [10, 25, 50],
    onPageChange: jest.fn(),
    onSizePerPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("usePagination", () => {
    it("handles dataSize = 0 (empty table)", () => {
      const { result } = renderHook(() =>
        usePagination({
          ...baseProps,
          dataSize: 0,
        })
      );
      expect(result.current.getPageStatus()).toEqual([]);
      expect(result.current.fromTo).toEqual([0, 0]);
    });

    it("handles backToPrevPage when at pageStartIndex", () => {
      const onPageChange = jest.fn();
      const { result } = renderHook(() =>
        usePagination({
          ...baseProps,
          currPage: 1,
          pageStartIndex: 1,
          onPageChange,
        })
      );
      act(() => {
        result.current.handleChangePage("<");
      });
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it("handles next page when at lastPage (clamp to lastPage)", () => {
      const onPageChange = jest.fn();
      const { result } = renderHook(() =>
        usePagination({
          ...baseProps,
          currPage: 5,
          dataSize: 50,
          currSizePerPage: 10,
          pageStartIndex: 1,
          onPageChange,
        })
      );
      act(() => {
        result.current.handleChangePage(">");
      });
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it("navigates with firstPageText and lastPageText", () => {
      const onPageChange = jest.fn();
      const { result } = renderHook(() =>
        usePagination({
          ...baseProps,
          currPage: 3,
          onPageChange,
        })
      );

      act(() => {
        result.current.handleChangePage("<<");
      });
      expect(onPageChange).toHaveBeenCalledWith(1, 10);

      act(() => {
        result.current.handleChangePage(">>");
      });
      expect(onPageChange).toHaveBeenCalledWith(5, 10);
    });

    it("handles string sizePerPage and clamps currPage when new page count is smaller", () => {
      const onSizePerPageChange = jest.fn();
      const { result } = renderHook(() =>
        usePagination({
          ...baseProps,
          currPage: 5,
          currSizePerPage: 10,
          dataSize: 50,
          onSizePerPageChange,
        })
      );

      act(() => {
        result.current.handleChangeSizePerPage("50");
      });
      expect(onSizePerPageChange).toHaveBeenCalledWith(50, 1);
    });

    it("does nothing when selecting the current sizePerPage", () => {
      const onSizePerPageChange = jest.fn();
      const { result } = renderHook(() =>
        usePagination({
          ...baseProps,
          currSizePerPage: 10,
          onSizePerPageChange,
        })
      );
      act(() => {
        result.current.handleChangeSizePerPage(10);
      });
      expect(onSizePerPageChange).not.toHaveBeenCalled();
    });

    it("formats sizePerPageList with objects and values", () => {
      const { result } = renderHook(() =>
        usePagination({
          ...baseProps,
          sizePerPageList: [
            10,
            { text: "Twenty-Five", value: 25 },
          ],
        })
      );
      expect(result.current.getSizePerPageStatus()).toEqual([
        { text: "10", page: 10 },
        { text: "Twenty-Five", page: 25 },
      ]);
    });
  });

  describe("usePaginationState", () => {
    it("initializes sizePerPage from sizePerPageList object when options.sizePerPage is undefined", () => {
      const { result } = renderHook(() =>
        usePaginationState(
          {
            pagination: {
              options: {
                totalSize: 100,
                sizePerPageList: [{ text: "Twenty", value: 20 }, 50],
              },
            },
          } as any
        )
      );
      const props = result.current.getPaginationProps();
      expect(props.sizePerPage).toBe(20);
    });

    it("handles custom pageStartIndex and emits remote events with propRemoteEmitter", () => {
      const emitter = new EventEmitter();
      const onPaginationChange = jest.fn();
      emitter.on("paginationChange", onPaginationChange);

      const { result } = renderHook(() =>
        usePaginationState(
          {
            pagination: {
              options: {
                totalSize: 100,
                pageStartIndex: 0,
                onPageChange: jest.fn(),
                onSizePerPageChange: jest.fn(),
              },
            },
            isRemotePagination: () => true,
            remoteEmitter: emitter,
          } as any
        )
      );

      act(() => {
        result.current.handleChangePage(2);
      });
      expect(onPaginationChange).toHaveBeenCalledWith(2, Const.SIZE_PER_PAGE_LIST[0]);

      act(() => {
        result.current.handleChangeSizePerPage(25, 1);
      });
      expect(onPaginationChange).toHaveBeenCalledWith(1, 25);
    });

    it("handles filterChanged event on dataChangeListener and cleans up on unmount", () => {
      const { result, unmount } = renderHook(() =>
        usePaginationState({
          pagination: {
            options: {
              totalSize: 100,
              sizePerPage: 10,
              pageStartIndex: 1,
            },
          },
        } as any)
      );

      act(() => {
        result.current.dataChangeListener.emit("filterChanged", 20);
      });

      expect(result.current.dataSize).toBe(20);

      // Test unmount cleanup
      unmount();
    });

    it("evaluates isRemotePagination when it is not a function", () => {
      const emitter = new EventEmitter();
      let isRemoteResult = false;
      emitter.on("isRemotePagination", (e: any) => {
        e.result = isRemoteResult;
      });

      const { result } = renderHook(() =>
        usePaginationState({
          pagination: {
            options: {
              totalSize: 100,
            },
          },
          remoteEmitter: emitter,
        } as any)
      );

      expect(result.current.isRemotePagination()).toBe(false);

      isRemoteResult = true;
      expect(result.current.isRemotePagination()).toBe(true);
    });
  });
});

