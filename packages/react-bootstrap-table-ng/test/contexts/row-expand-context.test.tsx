import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import createRowExpandContext from "../../src/contexts/row-expand-context";

describe("RowExpandContext", () => {
  const data = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 3, name: "C" },
  ];
  const keyField = "id";

  let capturedContext: any = null;

  function renderContext(expandRow: any = {}, extraProps: any = {}) {
    capturedContext = null;
    const { Provider, Consumer } = createRowExpandContext();

    return render(
      <Provider
        data={data}
        keyField={keyField}
        expandRow={expandRow}
        {...extraProps}
      >
        <Consumer>
          {(ctx: any) => {
            capturedContext = ctx;
            return <div>rendered</div>;
          }}
        </Consumer>
      </Provider>
    );
  }

  it("provides default context values", () => {
    renderContext({});
    expect(capturedContext.expanded).toEqual([]);
    expect(capturedContext.isClosing).toEqual([]);
    expect(capturedContext.isAnyExpands).toBe(false);
  });

  it("exposes state via ref", () => {
    const ref = React.createRef<any>();
    renderContext({ expanded: [1] }, { ref });
    expect(ref.current?.state.expanded).toEqual([1]);
  });

  it("expands a row on onRowExpand(rowKey, true, ...)", () => {
    const onExpand = jest.fn();
    renderContext({ onExpand });

    act(() => {
      capturedContext.onRowExpand(1, true, 0, {});
    });

    expect(capturedContext.expanded).toContain(1);
    expect(onExpand).toHaveBeenCalledWith(data[0], true, 0, {});
  });

  it("collapses a row on onRowExpand(rowKey, false, ...)", () => {
    renderContext({ expanded: [1, 2] });

    act(() => {
      capturedContext.onRowExpand(1, false, 0, {});
    });

    expect(capturedContext.expanded).toEqual([2]);
    expect(capturedContext.isClosing).toContain(1);
  });

  it("supports onlyOneExpanding option", () => {
    renderContext({ expanded: [1], onlyOneExpanding: true });

    act(() => {
      capturedContext.onRowExpand(2, true, 1, {});
    });

    expect(capturedContext.expanded).toEqual([2]);
    expect(capturedContext.isClosing).toContain(1);
  });

  it("ignores expansion if rowKey is in nonExpandable", () => {
    const onExpand = jest.fn();
    renderContext({ nonExpandable: [1], onExpand });

    act(() => {
      capturedContext.onRowExpand(1, true, 0, {});
    });

    expect(capturedContext.expanded).toEqual([]);
    expect(onExpand).not.toHaveBeenCalled();
  });

  it("clears closed row from isClosing on onClosed", () => {
    renderContext({ isClosing: [1, 2] });

    act(() => {
      capturedContext.onClosed(1);
    });

    expect(capturedContext.isClosing).toEqual([2]);
  });

  it("expands all rows on onAllRowExpand(e, true)", () => {
    const onExpandAll = jest.fn();
    renderContext({ onExpandAll });

    act(() => {
      capturedContext.onAllRowExpand({}, true);
    });

    expect(capturedContext.expanded).toEqual([1, 2, 3]);
    expect(onExpandAll).toHaveBeenCalledWith(true, data, {});
  });

  it("collapses all rows on onAllRowExpand(e, false)", () => {
    const onExpandAll = jest.fn();
    renderContext({ expanded: [1, 2, 3], onExpandAll });

    act(() => {
      capturedContext.onAllRowExpand({}, false);
    });

    expect(capturedContext.expanded).toEqual([]);
    expect(onExpandAll).toHaveBeenCalledWith(false, [], {});
  });

  it("syncs external expanded prop updates and tracks isClosing", () => {
    const { rerender } = renderContext({ expanded: [1, 2] });
    expect(capturedContext.expanded).toEqual([1, 2]);

    const { Provider, Consumer } = createRowExpandContext();
    rerender(
      <Provider
        data={data}
        keyField={keyField}
        expandRow={{ expanded: [2], nonExpandable: [] }}
      >
        <Consumer>
          {(ctx: any) => {
            capturedContext = ctx;
            return <div>rendered</div>;
          }}
        </Consumer>
      </Provider>
    );

    expect(capturedContext.expanded).toEqual([2]);
    expect(capturedContext.isClosing).toContain(1);
  });

  it("handles default context callbacks when rendered outside provider", () => {
    const { Consumer } = createRowExpandContext();
    let defaultCtx: any;
    render(
      <Consumer>
        {(ctx: any) => {
          defaultCtx = ctx;
          return null;
        }}
      </Consumer>
    );
    expect(typeof defaultCtx.onClosed).toBe("function");
    expect(typeof defaultCtx.onRowExpand).toBe("function");
    expect(typeof defaultCtx.onAllRowExpand).toBe("function");
    defaultCtx.onClosed();
    defaultCtx.onRowExpand();
    defaultCtx.onAllRowExpand();
  });
});

