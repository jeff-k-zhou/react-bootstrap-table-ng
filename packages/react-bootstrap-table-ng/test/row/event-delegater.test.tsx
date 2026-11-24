import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRowEventDelegater, RowEventDelegater } from "../../src/row/event-delegater";

describe("useRowEventDelegater", () => {
  const row = { id: 1, name: "Test" };
  const rowIndex = 0;

  it("handles click without DELAY_FOR_DBCLICK", () => {
    const onClick = jest.fn();
    const onRowSelect = jest.fn();
    const onRowExpand = jest.fn();

    const TestComponent = () => {
      const { createClickEventHandler } = useRowEventDelegater({
        row,
        rowIndex,
        selectRow: { clickToSelect: true, clickToExpand: true, onRowSelect },
        expandRow: { onRowExpand },
        selectable: true,
        expandable: true,
        keyField: "id",
      });

      return (
        <tr
          data-testid="row"
          onClick={createClickEventHandler(onClick)}
        >
          <td>Cell</td>
        </tr>
      );
    };

    render(
      <table>
        <tbody>
          <TestComponent />
        </tbody>
      </table>
    );

    const tr = screen.getByTestId("row");
    fireEvent.click(tr);

    expect(onClick).toHaveBeenCalledWith(expect.anything(), row, 0);
    expect(onRowSelect).toHaveBeenCalledWith(1, true, 0, expect.anything());
    expect(onRowExpand).toHaveBeenCalledWith(1, true, 0, expect.anything());
  });

  it("handles DELAY_FOR_DBCLICK with debounce", () => {
    jest.useFakeTimers();
    const onClick = jest.fn();

    const TestComponent = () => {
      const { createClickEventHandler } = useRowEventDelegater({
        row,
        rowIndex,
        DELAY_FOR_DBCLICK: 200,
        keyField: "id",
      });

      return (
        <tr
          data-testid="row"
          onClick={createClickEventHandler(onClick)}
        >
          <td>Cell</td>
        </tr>
      );
    };

    render(
      <table>
        <tbody>
          <TestComponent />
        </tbody>
      </table>
    );

    const tr = screen.getByTestId("row");
    fireEvent.click(tr);

    // Not called immediately due to debounce
    expect(onClick).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(onClick).toHaveBeenCalledWith(expect.anything(), row, 0);
    jest.useRealTimers();
  });

  it("delegates other events like onMouseEnter, onContextMenu", () => {
    const onMouseEnter = jest.fn();
    const onContextMenu = jest.fn();

    const TestComponent = () => {
      const { delegate } = useRowEventDelegater({ row, rowIndex });
      const events = delegate({ onMouseEnter, onContextMenu });

      return (
        <tr data-testid="row" {...events}>
          <td>Cell</td>
        </tr>
      );
    };

    render(
      <table>
        <tbody>
          <TestComponent />
        </tbody>
      </table>
    );

    const tr = screen.getByTestId("row");
    fireEvent.mouseEnter(tr);
    expect(onMouseEnter).toHaveBeenCalledWith(expect.anything(), row, 0);

    fireEvent.contextMenu(tr);
    expect(onContextMenu).toHaveBeenCalledWith(expect.anything(), row, 0);
  });

  it("wraps component with RowEventDelegater HOC", () => {
    const onClick = jest.fn();
    const BaseComp: React.FC<any> = ({ createClickEventHandler }) => (
      <tr data-testid="hoc-row" onClick={createClickEventHandler(onClick)}>
        <td>HOC</td>
      </tr>
    );

    const Wrapped = RowEventDelegater(BaseComp);

    render(
      <table>
        <tbody>
          <Wrapped row={row} rowIndex={0} keyField="id" />
        </tbody>
      </table>
    );

    const tr = screen.getByTestId("hoc-row");
    fireEvent.click(tr);
    expect(onClick).toHaveBeenCalledWith(expect.anything(), row, 0);
  });
});
