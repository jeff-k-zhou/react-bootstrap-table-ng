import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useCellEventDelegater, CellEventDelegater } from "../src/cell-event-delegater";

describe("CellEventDelegater", () => {
  const column = { dataField: "price", text: "Price" };

  it("delegates events with useCellEventDelegater hook", () => {
    const onClick = jest.fn();
    const onDoubleClick = jest.fn();

    const TestComponent = () => {
      const delegate = useCellEventDelegater({ column, columnIndex: 2, index: 5 });
      const events = delegate({ onClick, onDoubleClick, "data-custom-attr": "ignore" });

      return (
        <button data-testid="btn" {...events}>
          Click
        </button>
      );
    };

    render(<TestComponent />);
    const btn = screen.getByTestId("btn");

    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledWith(expect.anything(), column, 2);

    fireEvent.doubleClick(btn);
    expect(onDoubleClick).toHaveBeenCalledWith(expect.anything(), column, 2);
  });

  it("falls back to index if columnIndex is undefined", () => {
    const onClick = jest.fn();
    const TestComponent = () => {
      const delegate = useCellEventDelegater({ column, index: 4 });
      const events = delegate({ onClick });
      return <button data-testid="btn" {...events} />;
    };

    render(<TestComponent />);
    fireEvent.click(screen.getByTestId("btn"));
    expect(onClick).toHaveBeenCalledWith(expect.anything(), column, 4);
  });

  it("works with CellEventDelegater HOC", () => {
    const onClick = jest.fn();

    interface BaseProps {
      column: any;
      index: number;
      delegate?: any;
    }

    const BaseComp: React.FC<BaseProps> = ({ delegate }) => {
      const events = delegate ? delegate({ onClick }) : {};
      return <div data-testid="hoc-comp" {...events}>HOC</div>;
    };

    const Wrapped = CellEventDelegater(BaseComp);
    render(<Wrapped column={column} index={1} />);

    const div = screen.getByTestId("hoc-comp");
    fireEvent.click(div);
    expect(onClick).toHaveBeenCalledWith(expect.anything(), column, 1);
  });
});
