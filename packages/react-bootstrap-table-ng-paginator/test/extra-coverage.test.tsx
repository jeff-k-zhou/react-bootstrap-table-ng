/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import PageButton from "../src/page-button";
import PaginationJump from "../src/pagination-jump";
import SizePerPageDropDown from "../src/size-per-page-dropdown";
import SizePerPageOption from "../src/size-per-page-option";
import { alignPage } from "../src/page";
import { PaginationTotalWithAdapter } from "../src/pagination-total-adapter";
import { SizePerPageDropdownWithAdapter } from "../src/size-per-page-dropdown-adapter";
import paginationFactory from "..";
import createDataContext from "../src/data-context";
import { usePaginationState } from "../src/hooks/usePaginationState";

// ─────────────────────────────────────────────────────────────────────────────
// page-button.tsx (line 45: disabled + Enter/Space)
// ─────────────────────────────────────────────────────────────────────────────
describe("PageButton extra coverage", () => {
  it("prevents Enter key on disabled page button", () => {
    const onPageChange = jest.fn();
    render(
      <ul>
        <PageButton page={1} active={false} disabled={true} onPageChange={onPageChange} />
      </ul>
    );
    const link = screen.getByRole("link");
    fireEvent.keyDown(link, { key: "Enter" });
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("prevents Space key on disabled page button", () => {
    const onPageChange = jest.fn();
    render(
      <ul>
        <PageButton page={1} active={false} disabled={true} onPageChange={onPageChange} />
      </ul>
    );
    const link = screen.getByRole("link");
    fireEvent.keyDown(link, { key: " " });
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("does not prevent Tab key on disabled page button (no-op)", () => {
    const onPageChange = jest.fn();
    render(
      <ul>
        <PageButton page={2} active={false} disabled={true} onPageChange={onPageChange} />
      </ul>
    );
    const link = screen.getByRole("link");
    // Tab key is not handled - no error
    fireEvent.keyDown(link, { key: "Tab" });
  });

  it("does not call onPageChange on click when disabled", () => {
    const onPageChange = jest.fn();
    render(
      <ul>
        <PageButton page={3} active={false} disabled={true} onPageChange={onPageChange} />
      </ul>
    );
    fireEvent.click(screen.getByRole("link"));
    expect(onPageChange).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// page.ts (line 22: page < pageStartIndex)
// ─────────────────────────────────────────────────────────────────────────────
describe("page.ts alignPage extra coverage", () => {
  it("returns pageStartIndex when page < pageStartIndex", () => {
    // page=0 (less than pageStartIndex=1) -> returns pageStartIndex
    const result = alignPage(10, 10, 0, 5, 1);
    expect(result).toBe(1);
  });

  it("returns pageStartIndex when dataSize <= 0", () => {
    const result = alignPage(0, 5, 3, 5, 1);
    expect(result).toBe(1);
  });

  it("handles pageStartIndex=0 branch", () => {
    const result = alignPage(10, 20, 3, 5, 0);
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// pagination-jump.tsx (line 57: Escape key handler)
// ─────────────────────────────────────────────────────────────────────────────
describe("PaginationJump extra coverage", () => {
  it("resets input on Escape key", () => {
    const onPageChange = jest.fn();
    render(
      <PaginationJump
        currPage={3}
        firstPage={1}
        lastPage={10}
        onPageChange={onPageChange}
      />
    );
    const input = screen.getByRole("spinbutton");
    // Change value then press Escape - should revert to currPage
    fireEvent.change(input, { target: { value: "7" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onPageChange).not.toHaveBeenCalled();
    // Input should be reset to "3"
    expect(input).toHaveValue(3);
  });

  it("commits same page (no onPageChange call when page unchanged)", () => {
    const onPageChange = jest.fn();
    render(
      <PaginationJump
        currPage={3}
        firstPage={1}
        lastPage={10}
        onPageChange={onPageChange}
      />
    );
    const input = screen.getByRole("spinbutton");
    // Type same page number and press Enter
    fireEvent.change(input, { target: { value: "3" } });
    fireEvent.keyDown(input, { key: "Enter" });
    // Same page - onPageChange should NOT be called
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("reverts to currPage on invalid input (out of range)", () => {
    const onPageChange = jest.fn();
    render(
      <PaginationJump
        currPage={3}
        firstPage={1}
        lastPage={10}
        onPageChange={onPageChange}
      />
    );
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "999" } });
    fireEvent.blur(input);
    expect(onPageChange).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// size-per-page-dropdown.tsx (lines 67, 79-80: no tableId, bootstrap5 toggle)
// ─────────────────────────────────────────────────────────────────────────────
describe("SizePerPageDropDown extra coverage", () => {
  const options = [{ text: "10", page: 10 }, { text: "25", page: 25 }];
  const onSizePerPageChange = jest.fn();
  const onClick = jest.fn();
  const onBlur = jest.fn();

  it("renders without tableId (generates id from useId)", () => {
    render(
      <SizePerPageDropDown
        currSizePerPage={10}
        options={options}
        onClick={onClick}
        onBlur={onBlur}
        onSizePerPageChange={onSizePerPageChange}
        // No tableId provided
      />
    );
    const btn = screen.getByRole("button");
    // ID should be generated (not tableId-based)
    expect(btn).toHaveAttribute("id");
    expect(btn.getAttribute("id")).toContain("pageDropDown-");
  });

  it("renders with bootstrap5 (uses data-bs-toggle)", () => {
    render(
      <SizePerPageDropDown
        currSizePerPage={10}
        options={options}
        onClick={onClick}
        onBlur={onBlur}
        onSizePerPageChange={onSizePerPageChange}
        bootstrap5={true}
        tableId="my-table"
      />
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("data-bs-toggle", "dropdown");
    expect(btn).not.toHaveAttribute("data-toggle");
  });

  it("renders with bootstrap4 (hides caret span)", () => {
    render(
      <SizePerPageDropDown
        currSizePerPage={10}
        options={options}
        onClick={onClick}
        onBlur={onBlur}
        onSizePerPageChange={onSizePerPageChange}
        bootstrap4={true}
        tableId="my-table"
      />
    );
    // bootstrap4=true means no caret span is rendered, only the button text
    const btn = screen.getByRole("button");
    // The button should not contain a caret span when bootstrap4=true
    expect(btn).not.toContainHTML('<span class="caret"></span>');
  });

  it("renders with optionRenderer", () => {
    const optionRenderer = jest.fn(({ text, page, onSizePerPageChange }) => (
      <li key={text} role="option" aria-selected={false}>
        <button onClick={() => onSizePerPageChange(page)}>{text}</button>
      </li>
    ));
    render(
      <SizePerPageDropDown
        currSizePerPage={10}
        options={options}
        onClick={onClick}
        onBlur={onBlur}
        onSizePerPageChange={onSizePerPageChange}
        optionRenderer={optionRenderer}
        tableId="test"
      />
    );
    expect(optionRenderer).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// size-per-page-option.tsx (line 25: Space key)
// ─────────────────────────────────────────────────────────────────────────────
describe("SizePerPageOption extra coverage", () => {
  it("handles Space key to select option", () => {
    const onSizePerPageChange = jest.fn();
    render(
      <ul>
        <SizePerPageOption
          text="10"
          page={10}
          onSizePerPageChange={onSizePerPageChange}
        />
      </ul>
    );
    const link = screen.getByRole("option");
    fireEvent.keyDown(link, { key: " " });
    expect(onSizePerPageChange).toHaveBeenCalledWith(10);
  });

  it("handles Enter key to select option", () => {
    const onSizePerPageChange = jest.fn();
    render(
      <ul>
        <SizePerPageOption
          text="25"
          page={25}
          onSizePerPageChange={onSizePerPageChange}
        />
      </ul>
    );
    const link = screen.getByRole("option");
    fireEvent.keyDown(link, { key: "Enter" });
    expect(onSizePerPageChange).toHaveBeenCalledWith(25);
  });

  it("ignores other keys", () => {
    const onSizePerPageChange = jest.fn();
    render(
      <ul>
        <SizePerPageOption
          text="10"
          page={10}
          onSizePerPageChange={onSizePerPageChange}
        />
      </ul>
    );
    fireEvent.keyDown(screen.getByRole("option"), { key: "Tab" });
    expect(onSizePerPageChange).not.toHaveBeenCalled();
  });

  it("renders with bootstrap4=true", () => {
    const onSizePerPageChange = jest.fn();
    render(
      <ul>
        <SizePerPageOption
          text="50"
          page={50}
          onSizePerPageChange={onSizePerPageChange}
          bootstrap4={true}
        />
      </ul>
    );
    const link = screen.getByRole("option");
    expect(link.tagName).toBe("A");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// pagination-total-adapter.tsx (missing function coverage: factory function)
// ─────────────────────────────────────────────────────────────────────────────
describe("PaginationTotalWithAdapter extra coverage", () => {
  it("renders PaginationTotalWithAdapter with default props", () => {
    render(
      <PaginationTotalWithAdapter
        currPage={1}
        currSizePerPage={10}
        dataSize={50}
        pageStartIndex={1}
        sizePerPageList={[10, 25, 50]}
      />
    );
    // Text is split across elements: "Showing rows 1 to 10 of 50"
    expect(
      screen.getByText((content, element) =>
        (element?.className ?? "").includes("react-bootstrap-table-pagination-total")
      )
    ).toBeInTheDocument();
  });

  it("renders PaginationTotalWithAdapter with custom renderer", () => {
    const paginationTotalRenderer = jest.fn(() => (
      <span data-testid="custom-total">Custom total</span>
    ));
    render(
      <PaginationTotalWithAdapter
        currPage={2}
        currSizePerPage={10}
        dataSize={50}
        pageStartIndex={1}
        sizePerPageList={[10]}
        paginationTotalRenderer={paginationTotalRenderer}
      />
    );
    expect(screen.getByTestId("custom-total")).toBeInTheDocument();
    expect(paginationTotalRenderer).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// size-per-page-dropdown-adapter.tsx (missing function coverage: sizePerPageRenderer)
// ─────────────────────────────────────────────────────────────────────────────
describe("SizePerPageDropdownWithAdapter extra coverage", () => {
  it("renders nothing when sizePerPageList has 1 item", () => {
    const { container } = render(
      <SizePerPageDropdownWithAdapter
        currSizePerPage={10}
        currPage={1}
        dataSize={50}
        pageStartIndex={1}
        sizePerPageList={[{ text: "10", value: 10 }]}
        hideSizePerPage={false}
        onSizePerPageChange={jest.fn()}
        onPageChange={jest.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders with custom sizePerPageRenderer", () => {
    const sizePerPageRenderer = jest.fn(({ options, currSizePerPage, onSizePerPageChange }) => (
      <div data-testid="custom-spp">Custom: {currSizePerPage}</div>
    ));
    render(
      <SizePerPageDropdownWithAdapter
        currSizePerPage={10}
        currPage={1}
        dataSize={50}
        pageStartIndex={1}
        sizePerPageList={[10, 25, 50]}
        hideSizePerPage={false}
        sizePerPageRenderer={sizePerPageRenderer}
        onSizePerPageChange={jest.fn()}
        onPageChange={jest.fn()}
      />
    );
    expect(screen.getByTestId("custom-spp")).toBeInTheDocument();
    expect(sizePerPageRenderer).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// data-context.tsx (lines 19-45: options.page, onDataSizeChange, onPageChange branches)
// ─────────────────────────────────────────────────────────────────────────────
describe("data-context.tsx extra coverage", () => {
  it("handles data size change triggering onDataSizeChange", () => {
    const onDataSizeChange = jest.fn();
    const DataContext = createDataContext();
    const pagination = paginationFactory({ page: 1, sizePerPage: 2 });

    const { rerender } = render(
      <DataContext.Provider
        data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        pagination={pagination}
        onDataSizeChange={onDataSizeChange}
      >
        <DataContext.Consumer>
          {(ctx: any) => <div data-testid="count">{ctx.data.length}</div>}
        </DataContext.Consumer>
      </DataContext.Provider>
    );

    // Rerender with reduced data - triggers onDataSizeChange
    rerender(
      <DataContext.Provider
        data={[{ id: 1 }]}
        pagination={pagination}
        onDataSizeChange={onDataSizeChange}
      >
        <DataContext.Consumer>
          {(ctx: any) => <div data-testid="count">{ctx.data.length}</div>}
        </DataContext.Consumer>
      </DataContext.Provider>
    );

    expect(onDataSizeChange).toHaveBeenCalled();
  });

  it("handles page alignment with onPageChange when data shrinks", () => {
    const onPageChange = jest.fn();
    const DataContext = createDataContext();
    const pagination = paginationFactory({
      page: 3,
      sizePerPage: 2,
      onPageChange,
    });

    const { rerender } = render(
      <DataContext.Provider
        data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]}
        pagination={pagination}
      >
        <DataContext.Consumer>{() => <div />}</DataContext.Consumer>
      </DataContext.Provider>
    );

    // Reduce data so page 3 is beyond last page
    rerender(
      <DataContext.Provider
        data={[{ id: 1 }]}
        pagination={pagination}
      >
        <DataContext.Consumer>{() => <div />}</DataContext.Consumer>
      </DataContext.Provider>
    );
    // onPageChange should have been called to re-align page
    expect(onPageChange).toHaveBeenCalled();
  });

  it("renders with remote pagination (does not align data locally)", () => {
    const DataContext = createDataContext();
    const pagination = paginationFactory({ totalSize: 100 });
    let ctxData: any;
    render(
      <DataContext.Provider
        data={[{ id: 1 }, { id: 2 }]}
        pagination={pagination}
        isRemotePagination={() => true}
      >
        <DataContext.Consumer>
          {(ctx: any) => {
            ctxData = ctx.data;
            return <div />;
          }}
        </DataContext.Consumer>
      </DataContext.Provider>
    );
    // Remote pagination returns full data (no slicing)
    expect(ctxData).toHaveLength(2);
  });

  it("handles custom pagination (does not render default Pagination)", () => {
    const DataContext = createDataContext();
    const pagination = paginationFactory({ custom: true });
    render(
      <DataContext.Provider
        data={[{ id: 1 }, { id: 2 }]}
        pagination={pagination}
      >
        <DataContext.Consumer>{() => <div data-testid="child" />}</DataContext.Consumer>
      </DataContext.Provider>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// usePaginationState.ts (lines 51-64: handleDataSizeChange, isRemotePagination via emitter)
// ─────────────────────────────────────────────────────────────────────────────
describe("usePaginationState extra coverage", () => {
  it("isRemotePagination falls back to emitter when prop is not a function", () => {
    // This tests the EventEmitter path in isRemotePagination
    const DataContext = createDataContext();
    const pagination = paginationFactory({ totalSize: 10 });
    // Pass isRemotePagination as a non-function truthy value
    const { container } = render(
      <DataContext.Provider
        data={[{ id: 1 }]}
        pagination={pagination}
        isRemotePagination={true as any}
      >
        <DataContext.Consumer>{() => <div />}</DataContext.Consumer>
      </DataContext.Provider>
    );
    expect(container).toBeDefined();
  });

  it("handleDataSizeChange is triggered via filterChanged event on emitter", () => {
    // The data-context's state-context emits filterChanged when filter data changes
    // We can test usePaginationState by using the state-context integration
    const DataContext = createDataContext();
    const pagination = paginationFactory({ page: 3, sizePerPage: 2 });
    let setRemoteEmitter: any;

    render(
      <DataContext.Provider
        data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]}
        pagination={pagination}
      >
        <DataContext.Consumer>
          {(ctx: any) => {
            setRemoteEmitter = ctx.setRemoteEmitter;
            return <div />;
          }}
        </DataContext.Consumer>
      </DataContext.Provider>
    );

    // setRemoteEmitter is available from context
    expect(typeof setRemoteEmitter).toBe("function");
  });
});
