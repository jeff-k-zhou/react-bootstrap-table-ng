import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PaginationJump from "../src/pagination-jump";
import paginationJumpAdapter, { PaginationJumpWithAdapter } from "../src/pagination-jump-adapter";
import PaginationJumpStandalone from "../src/pagination-jump-standalone";
import PaginationTotalStandalone from "../src/pagination-total-standalone";
import SizePerPageDropdownStandalone from "../src/size-per-page-dropdown-standalone";
import PaginationListStandalone from "../src/pagination-list-standalone";
import { StateContext } from "../src/state-context";
import CONST from "../src/const";

describe("CONST", () => {
  it("exports pagination default constants", () => {
    expect(CONST.PAGINATION_SIZE).toBe(5);
    expect(CONST.PAGE_START_INDEX).toBe(1);
    expect(CONST.WITH_FIRST_AND_LAST).toBe(true);
  });
});

describe("PaginationJump", () => {
  it("renders jump input and options", () => {
    const onPageChange = jest.fn();
    render(
      <PaginationJump
        currPage={2}
        firstPage={1}
        lastPage={5}
        onPageChange={onPageChange}
        tableId="my-tbl"
      />
    );

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("2");
    expect(screen.getByText("/ 5")).toBeInTheDocument();
  });

  it("updates input on typing and commits on Enter", () => {
    const onPageChange = jest.fn();
    render(
      <PaginationJump
        currPage={1}
        firstPage={1}
        lastPage={10}
        onPageChange={onPageChange}
      />
    );

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "4" } });
    expect(input.value).toBe("4");

    fireEvent.keyDown(input, { key: "Enter" });
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("reverts on Escape key", () => {
    const onPageChange = jest.fn();
    render(
      <PaginationJump
        currPage={3}
        firstPage={1}
        lastPage={10}
        onPageChange={onPageChange}
      />
    );

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "9" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(input.value).toBe("3");
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("reverts on invalid input (out of range or NaN) on blur", () => {
    const onPageChange = jest.fn();
    render(
      <PaginationJump
        currPage={2}
        firstPage={1}
        lastPage={5}
        onPageChange={onPageChange}
      />
    );

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    // out of range (> 5)
    fireEvent.change(input, { target: { value: "99" } });
    fireEvent.blur(input);
    expect(input.value).toBe("2");
    expect(onPageChange).not.toHaveBeenCalled();

    // not a number
    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.blur(input);
    expect(input.value).toBe("2");
  });

  it("does not call onPageChange if input equals currPage", () => {
    const onPageChange = jest.fn();
    render(
      <PaginationJump
        currPage={2}
        firstPage={1}
        lastPage={5}
        onPageChange={onPageChange}
      />
    );

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "2" } });
    fireEvent.blur(input);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("syncs input when currPage prop changes", () => {
    const onPageChange = jest.fn();
    const { rerender } = render(
      <PaginationJump
        currPage={1}
        firstPage={1}
        lastPage={5}
        onPageChange={onPageChange}
      />
    );
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("1");

    rerender(
      <PaginationJump
        currPage={3}
        firstPage={1}
        lastPage={5}
        onPageChange={onPageChange}
      />
    );
    expect(input.value).toBe("3");
  });
});

describe("paginationJumpAdapter", () => {
  it("returns null when totalPages <= 1", () => {
    const Component = paginationJumpAdapter(() => <div>jump</div>);
    const { container } = render(
      <Component totalPages={1} currPage={1} pageStartIndex={1} lastPage={1} onPageChange={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders wrapped component when totalPages > 1", () => {
    const onPageChange = jest.fn();
    render(
      <PaginationJumpWithAdapter
        totalPages={5}
        currPage={2}
        pageStartIndex={1}
        lastPage={5}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });
});

describe("Standalone components rendering with context", () => {
  const paginationProps = {
    dataSize: 50,
    sizePerPage: 10,
    page: 2,
    pageStartIndex: 1,
    paginationSize: 5,
    sizePerPageList: [10, 25, 50],
    onPageChange: jest.fn(),
    onSizePerPageChange: jest.fn(),
  };

  it("renders PaginationJumpStandalone inside StateContext", () => {
    render(
      <StateContext.Provider value={{ paginationProps }}>
        <PaginationJumpStandalone />
      </StateContext.Provider>
    );
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("renders PaginationTotalStandalone inside StateContext", () => {
    render(
      <StateContext.Provider
        value={{
          paginationProps: {
            ...paginationProps,
            paginationTotalRenderer: (from: number, to: number, size: number) => (
              <div>Total: {from}-{to} of {size}</div>
            ),
          },
        }}
      >
        <PaginationTotalStandalone />
      </StateContext.Provider>
    );
    expect(screen.getByText("Total: 11-20 of 50")).toBeInTheDocument();
  });

  it("renders SizePerPageDropdownStandalone inside StateContext", () => {
    render(
      <StateContext.Provider value={{ paginationProps }}>
        <SizePerPageDropdownStandalone />
      </StateContext.Provider>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders PaginationListStandalone inside StateContext", () => {
    render(
      <StateContext.Provider value={{ paginationProps }}>
        <PaginationListStandalone />
      </StateContext.Provider>
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});
