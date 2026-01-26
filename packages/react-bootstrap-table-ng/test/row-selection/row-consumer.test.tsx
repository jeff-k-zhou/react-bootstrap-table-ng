import React from "react";
import { render } from "@testing-library/react";
import { createSelectionContext } from "../../src/contexts/selection-context";
import withSelectionConsumer from "../../src/row-selection/row-consumer";

describe("withSelectionConsumer", () => {
  let selectRow: any;
  const BaseComponent = (props: any) => (
    <div
      data-testid="base"
      data-selected={String(props.selected)}
      data-selectable={String(props.selectable)}
      {...props}
    />
  );
  const WithSelectionComponent = withSelectionConsumer((props) => (
    <BaseComponent {...props} />
  ));

  const data = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 3, name: "C" },
  ];
  const rowIndex = 1;
  const row = data[rowIndex];
  const keyField = "id";
  const value = row[keyField];

  const SelectionContext = createSelectionContext();

  function renderWithContext(props: any = {}, selectRowProp: any = selectRow) {
    return render(
      <SelectionContext.Provider data={data} keyField={keyField} selectRow={selectRowProp}>
        <WithSelectionComponent
          row={row}
          value={value}
          keyField={keyField}
          rowIndex={rowIndex}
          {...props}
        />
      </SelectionContext.Provider>
    );
  }

  describe("if current row is selected", () => {
    beforeEach(() => {
      selectRow = { mode: "checkbox", selected: [data[rowIndex][keyField]] };
    });

    it("should inject selected prop as true to target component", () => {
      const { getByTestId } = renderWithContext();
      expect(getByTestId("base")).toHaveAttribute("data-selected", "true");
    });
  });

  describe("if current row is not selected", () => {
    beforeEach(() => {
      selectRow = { mode: "checkbox", selected: [] };
    });

    it("should inject selected prop as false to target component", () => {
      const { getByTestId } = renderWithContext();
      expect(getByTestId("base")).toHaveAttribute("data-selected", "false");
    });
  });

  describe("if current row is selectable", () => {
    beforeEach(() => {
      selectRow = { mode: "checkbox", nonSelectable: [] };
    });

    it("should inject selectable prop as true to target component", () => {
      const { getByTestId } = renderWithContext();
      expect(getByTestId("base")).toHaveAttribute("data-selectable", "true");
    });
  });

  describe("if current row is non selectable", () => {
    beforeEach(() => {
      selectRow = {
        mode: "checkbox",
        nonSelectable: [data[rowIndex][keyField]],
      };
    });

    it("should inject selectable prop as false to target component", () => {
      const { getByTestId } = renderWithContext();
      expect(getByTestId("base")).toHaveAttribute("data-selectable", "false");
    });
  });

  describe("if current row is selected", () => {
    const selectedStyle = { backgroundColor: "green", fontWeight: "bold" };
    describe("when selectRow.style is defined as an object", () => {
      beforeEach(() => {
        selectRow = {
          mode: "checkbox",
          selected: [data[rowIndex][keyField]],
          style: selectedStyle,
        };
      });

      it("should inject style prop correctly", () => {
        const { getByTestId } = renderWithContext();
        expect(getByTestId("base").style.backgroundColor).toBe("green");
        expect(getByTestId("base").style.fontWeight).toBe("bold");
      });

      describe("and props.style is also defined", () => {
        const componentStyle = { fontSize: "16px" };
        beforeEach(() => {
          selectRow = {
            ...selectRow,
            style: selectedStyle,
          };
        });

        it("should inject style prop correctly", () => {
          const { getByTestId } = renderWithContext({ style: componentStyle });
          expect(getByTestId("base").style.backgroundColor).toBe("green");
          expect(getByTestId("base").style.fontWeight).toBe("bold");
          expect(getByTestId("base").style.fontSize).toBe("16px");
        });
      });

      describe("and selectRow.bgColor is also defined as an object", () => {
        beforeEach(() => {
          selectRow.bgColor = "gray";
        });

        it("should inject style prop with correct backgroundColor", () => {
          const { getByTestId } = renderWithContext();
          expect(getByTestId("base").style.backgroundColor).toBe("gray");
        });
      });

      describe("and selectRow.bgColor is also defined as a function", () => {
        const color = "gray";
        beforeEach(() => {
          selectRow.bgColor = jest.fn().mockReturnValue(color);
        });

        it("should inject style prop with correct backgroundColor", () => {
          const { getByTestId } = renderWithContext();
          expect(getByTestId("base").style.backgroundColor).toBe(color);
        });

        it("should call selectRow.bgColor function correctly", () => {
          renderWithContext();
          expect(selectRow.bgColor).toHaveBeenCalledTimes(1);
          expect(selectRow.bgColor).toHaveBeenCalledWith(row, rowIndex);
        });
      });
    });

    describe("when selectRow.style is defined as a function", () => {
      beforeEach(() => {
        selectRow = {
          mode: "checkbox",
          selected: [data[rowIndex][keyField]],
          style: jest.fn().mockReturnValue(selectedStyle),
        };
      });

      it("should inject style prop correctly", () => {
        const { getByTestId } = renderWithContext();
        expect(getByTestId("base").style.backgroundColor).toBe("green");
        expect(getByTestId("base").style.fontWeight).toBe("bold");
      });

      it("should call selectRow.style function correctly", () => {
        renderWithContext();
        expect(selectRow.style).toHaveBeenCalledTimes(1);
        expect(selectRow.style).toHaveBeenCalledWith(row, rowIndex);
      });

      describe("and props.style is also defined", () => {
        const componentStyle = { fontSize: "16px" };
        it("should inject style prop correctly", () => {
          const { getByTestId } = renderWithContext({ style: componentStyle });
          expect(getByTestId("base").style.backgroundColor).toBe("green");
          expect(getByTestId("base").style.fontWeight).toBe("bold");
          expect(getByTestId("base").style.fontSize).toBe("16px");
        });
      });

      describe("and selectRow.bgColor is also defined as an object", () => {
        beforeEach(() => {
          selectRow.bgColor = "gray";
        });

        it("should inject style prop with correct backgroundColor", () => {
          const { getByTestId } = renderWithContext();
          expect(getByTestId("base").style.backgroundColor).toBe("gray");
        });
      });

      describe("and selectRow.bgColor is also defined as a function", () => {
        const color = "gray";
        beforeEach(() => {
          selectRow.bgColor = jest.fn().mockReturnValue(color);
        });

        it("should inject style prop with correct backgroundColor", () => {
          const { getByTestId } = renderWithContext();
          expect(getByTestId("base").style.backgroundColor).toBe(color);
        });

        it("should call selectRow.bgColor function correctly", () => {
          renderWithContext();
          expect(selectRow.bgColor).toHaveBeenCalledTimes(1);
          expect(selectRow.bgColor).toHaveBeenCalledWith(row, rowIndex);
        });
      });
    });
  });

  describe("if current row is selected", () => {
    const selectedClassName = "select-classname";
    describe("when selectRow.classes is defined as an object", () => {
      beforeEach(() => {
        selectRow = {
          mode: "checkbox",
          selected: [data[rowIndex][keyField]],
          classes: selectedClassName,
        };
      });

      it("should inject className prop correctly", () => {
        const { getByTestId } = renderWithContext();
        expect(getByTestId("base").className).toContain(selectedClassName);
      });

      describe("and props.className is also defined", () => {
        const componentClassName = "component-classname";
        it("should inject className prop correctly", () => {
          const { getByTestId } = renderWithContext({ className: componentClassName });
          expect(getByTestId("base").className).toContain(componentClassName);
          expect(getByTestId("base").className).toContain(selectedClassName);
        });
      });
    });

    describe("when selectRow.classes is defined as a function", () => {
      beforeEach(() => {
        selectRow = {
          mode: "checkbox",
          selected: [data[rowIndex][keyField]],
          classes: jest.fn().mockReturnValue(selectedClassName),
        };
      });

      it("should inject className prop correctly", () => {
        const { getByTestId } = renderWithContext();
        expect(getByTestId("base").className).toContain(selectedClassName);
      });

      it("should call selectRow.classes function correctly", () => {
        renderWithContext();
        expect(selectRow.classes).toHaveBeenCalledTimes(1);
        expect(selectRow.classes).toHaveBeenCalledWith(row, rowIndex);
      });

      describe("and props.className is also defined", () => {
        const componentClassName = "component-classname";
        it("should inject className prop correctly", () => {
          const { getByTestId } = renderWithContext({ className: componentClassName });
          expect(getByTestId("base").className).toContain(componentClassName);
          expect(getByTestId("base").className).toContain(selectedClassName);
        });
      });
    });
  });
});
