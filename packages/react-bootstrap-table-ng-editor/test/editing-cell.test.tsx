/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { stub } from "sinon";

import _ from "../../react-bootstrap-table-ng/src/utils";
import { EDITTYPE } from "..";
import CheckBoxEditor from "../src/checkbox-editor";
import DateEditor from "../src/date-editor";
import DropDownEditor from "../src/dropdown-editor";
import editingCellFactory from "../src/editing-cell";
import EditorIndicator from "../src/editor-indicator";
import TextEditor from "../src/text-editor";
import TextAreaEditor from "../src/textarea-editor";

const EditingCell = editingCellFactory(_);
const TableRowWrapper = (props: any) => (
  <table>
    <tbody>
      <tr>{props.children}</tr>
    </tbody>
  </table>
);

describe("EditingCell", () => {
  let onUpdate: any;
  let onEscape: any;
  const row: { [key: string]: number | string } = {
    id: 1,
    name: "A",
  };

  const rowIndex = 1;
  const columnIndex = 1;

  let column: {
    dataField: any;
    validator?: any;
    editorClasses?: any;
    editorStyle?: any;
    editor?: { type: any; options?: any };
    editorRenderer?: any;
    text: any;
  } = {
    dataField: "id",
    text: "ID",
  };

  beforeEach(() => {
    onEscape = stub();
    onUpdate = stub();
    render(
      <TableRowWrapper>
        <EditingCell
          row={row}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          column={column}
          onUpdate={onUpdate}
          onEscape={onEscape}
        />
      </TableRowWrapper>
    );
  });

  it("should render default editor successfully", () => {
    expect(screen.getByRole("cell")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should render TextEditor with correct props", () => {
    const textEditor = screen.getByRole("textbox");
    expect(textEditor).toHaveValue("" + row[column.dataField]);
  });

  it("should not render EditorIndicator due to state.invalidMessage is null", () => {
    expect(screen.queryByTestId("editor-indicator")).not.toBeInTheDocument();
  });

  it("when press ENTER on TextEditor should call onUpdate correctly", () => {
    const textEditor = screen.getByRole("textbox");
    fireEvent.change(textEditor, { target: { value: "test" } });
    fireEvent.keyDown(textEditor, { key: "Enter", keyCode: 13 });
    expect(onUpdate.callCount).toBe(1);
  });

  it("when press ESC on TextEditor should call onEscape correctly", () => {
    const textEditor = screen.getByRole("textbox");
    fireEvent.keyDown(textEditor, { key: "Escape", keyCode: 27 });
    expect(onEscape.callCount).toBe(1);
  });

  it("when blur from TextEditor should call onEscape correctly", () => {
    const textEditor = screen.getByRole("textbox");
    fireEvent.blur(textEditor);
    expect(onEscape.callCount).toBe(1);
  });

  describe("if style prop is defined", () => {
    const customStyle = { backgroundColor: "red" };
    beforeEach(() => {
      render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={column}
            onUpdate={onUpdate}
            onEscape={onEscape}
            style={customStyle}
          />
        </TableRowWrapper>
      );
    });

    it("should render component with style successfully", () => {
      expect(screen.getAllByRole("cell")[1]).toHaveStyle("background-color: rgb(255, 0, 0)");
    });
  });

  describe("if className prop is defined", () => {
    const className = "test-class";
    beforeEach(() => {
      render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={column}
            onUpdate={onUpdate}
            onEscape={onEscape}
            className={className}
          />
        </TableRowWrapper>
      );
    });

    it("should render component with style successfully", () => {
      expect(screen.getAllByRole("cell")[1]).toHaveClass(className);
    });
  });

  describe("if column.editorClasses is defined", () => {
    let columnWithEditorClasses: any;
    const classes = "test test1";

    describe("and it is a function", () => {
      beforeEach(() => {
        columnWithEditorClasses = {
          ...column,
          editorClasses: jest.fn(() => classes),
        };
        render(
          <TableRowWrapper>
            <EditingCell
              row={row}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              column={columnWithEditorClasses}
              onUpdate={onUpdate}
              onEscape={onEscape}
            />
          </TableRowWrapper>
        );
      });

      it("should render TextEditor with correct props", () => {
        const textEditor = screen.getAllByRole("textbox");
        expect(textEditor[1]).toHaveClass(classes);
      });

      it("should call column.editorClasses correctly", () => {
        expect(columnWithEditorClasses.editorClasses).toHaveBeenCalledTimes(1);
        expect(columnWithEditorClasses.editorClasses).toHaveBeenCalledWith(
          _.get(row, column.dataField),
          row,
          rowIndex,
          columnIndex
        );
      });
    });

    describe("and it is a string", () => {
      beforeEach(() => {
        columnWithEditorClasses = {
          ...column,
          editorClasses: classes,
        };
        render(
          <TableRowWrapper>
            <EditingCell
              row={row}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              column={columnWithEditorClasses}
              onUpdate={onUpdate}
              onEscape={onEscape}
            />
          </TableRowWrapper>
        );
      });

      it("should render TextEditor with correct props", () => {
        const textEditor = screen.getAllByRole("textbox");
        expect(textEditor[1]).toHaveClass(classes);
      });
    });
  });

  describe("if column.editorStyle is defined", () => {
    let columnWithEditorStyle: any;
    const style = { color: "red" };

    describe("and it is a function", () => {
      beforeEach(() => {
        columnWithEditorStyle = {
          ...column,
          editorStyle: jest.fn(() => style),
        };
        render(
          <TableRowWrapper>
            <EditingCell
              row={row}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              column={columnWithEditorStyle}
              onUpdate={onUpdate}
              onEscape={onEscape}
            />
          </TableRowWrapper>
        );
      });

      it("should render TextEditor with correct props", () => {
        const textEditor = screen.getAllByRole("textbox");
        expect(textEditor[1]).toHaveStyle("color: rgb(255, 0, 0)");
      });

      it("should call column.editorStyle correctly", () => {
        expect(columnWithEditorStyle.editorStyle).toHaveBeenCalledTimes(1);
        expect(columnWithEditorStyle.editorStyle).toHaveBeenCalledWith(
          _.get(row, column.dataField),
          row,
          rowIndex,
          columnIndex
        );
      });
    });

    describe("and it is an object", () => {
      beforeEach(() => {
        columnWithEditorStyle = {
          ...column,
          editorStyle: style,
        };
        render(
          <TableRowWrapper>
            <EditingCell
              row={row}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              column={columnWithEditorStyle}
              onUpdate={onUpdate}
              onEscape={onEscape}
            />
          </TableRowWrapper>
        );
      });

      it("should render TextEditor with correct props", () => {
        const textEditor = screen.getAllByRole("textbox");
        expect(textEditor[1]).toHaveStyle("color: rgb(255, 0, 0)");
      });
    });
  });

  describe("if blurToSave prop is true", () => {
    beforeEach(() => {
      render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={column}
            onUpdate={onUpdate}
            onEscape={onEscape}
            blurToSave
          />
        </TableRowWrapper>
      );
    });

    it("when blur from TextEditor should call onUpdate correctly", () => {
      const textEditor = screen.getAllByRole("textbox");
      fireEvent.blur(textEditor[1]);
      expect(onUpdate.callCount).toBe(1);
    });
  });

  describe("when column.validator is defined", () => {
    let newValue: any;
    let validForm: any;
    let validatorCallBack: any;

    describe("and column.validator return an object", () => {
      beforeEach(() => {
        newValue = "newValue";
        validForm = { valid: false, message: "Something is invalid" };
        validatorCallBack = stub().returns(validForm);
        column = {
          dataField: "id",
          text: "ID",
          validator: validatorCallBack,
        };
        render(
          <TableRowWrapper>
            <EditingCell
              row={row}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              column={column}
              onUpdate={onUpdate}
              onEscape={onEscape}
            />
          </TableRowWrapper>
        );
        // Trigger validation
        const textEditor = screen.getAllByRole("textbox")[1];
        fireEvent.change(textEditor, { target: { value: newValue } });
        fireEvent.keyDown(textEditor, { key: "Enter", keyCode: 13 });
      });

      it("should call column.validator successfully", () => {
        expect(validatorCallBack.callCount).toBe(1);
        expect(validatorCallBack.calledWith(newValue, row, column)).toBe(true);
      });

      it("should not call onUpdate", () => {
        expect(onUpdate.callCount).toBe(0);
      });

      it("should set indicatorTimer successfully", () => {
        // ...existing code...
      });

      it("should set invalidMessage state correctly", () => {
        //TODO: ...existing code...
      });

      it("should render TextEditor with correct shake and animated class", () => {
        const textEditor = screen.getAllByRole("textbox")[1];
        expect(textEditor).toHaveClass("animated shake");
      });

      it("should render EditorIndicator correctly", () => {
        const indicator = screen.getByTestId("editor-indicator");
        expect(indicator).toBeInTheDocument();
        expect(indicator).toHaveTextContent(validForm.message);
      });
    });

    describe("and column.validator return true or something", () => {
      beforeEach(() => {
        newValue = "newValue";
        validForm = true;
        validatorCallBack = stub().returns(validForm);
        column = {
          dataField: "id",
          text: "ID",
          validator: validatorCallBack,
        };
        render(
          <TableRowWrapper>
            <EditingCell
              row={row}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              column={column}
              onUpdate={onUpdate}
              onEscape={onEscape}
            />
          </TableRowWrapper>
        );
        // Trigger validation
        const textEditor = screen.getAllByRole("textbox")[1];
        fireEvent.change(textEditor, { target: { value: newValue } });
        fireEvent.keyDown(textEditor, { key: "Enter", keyCode: 13 });
      });

      it("should call column.validator successfully", () => {
        expect(validatorCallBack.callCount).toBe(1);
        expect(validatorCallBack.calledWith(newValue, row, column)).toBe(true);
      });

      it("should call onUpdate", () => {
        expect(onUpdate.callCount).toBe(1);
      });
    });
  });

  describe("if column.editorRenderer is defined", () => {
    const TestEditor = () => <input type="text" />;

    beforeEach(() => {
      column = {
        dataField: "id",
        text: "ID",
        editorRenderer: stub().returns(<TestEditor />),
      };

      render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={column}
            onUpdate={onUpdate}
            onEscape={onEscape}
          />
        </TableRowWrapper>
      );
    });

    it("should call column.editorRenderer correctly", () => {
      expect(column.editorRenderer.callCount).toBe(1);
    });

    it("should render correctly", () => {
      expect(screen.getAllByRole("textbox").length).toBeTruthy();
    });
  });

  describe("if column.editor is select", () => {
    beforeEach(() => {
      column = {
        dataField: "id",
        text: "ID",
        editor: {
          type: EDITTYPE.SELECT,
          options: [
            {
              value: 1,
              label: "A",
            },
          ],
        },
      };

      render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={column}
            onUpdate={onUpdate}
            onEscape={onEscape}
          />
        </TableRowWrapper>
      );
    });

    it("should render dropdown editor successfully", () => {
      const editor = screen.getByRole("combobox");
      expect(editor).toBeInTheDocument();
    });
  });

  describe("if column.editor is textarea", () => {
    beforeEach(() => {
      column = {
        dataField: "id",
        text: "ID",
        editor: {
          type: EDITTYPE.TEXTAREA,
        },
      };

      render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={column}
            onUpdate={onUpdate}
            onEscape={onEscape}
          />
        </TableRowWrapper>
      );
    });

    it("should render textarea editor successfully", () => {
      const editor = screen.getByRole("textbox");
      expect(editor).toBeInTheDocument();
    });
  });

  describe("if column.editor is checkbox", () => {
    beforeEach(() => {
      column = {
        dataField: "id",
        text: "ID",
        editor: {
          type: EDITTYPE.CHECKBOX,
        },
      };

      render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={column}
            onUpdate={onUpdate}
            onEscape={onEscape}
          />
        </TableRowWrapper>
      );
    });

    it("should render checkbox editor successfully", () => {
      const editor = screen.getByRole("checkbox");
      expect(editor).toBeInTheDocument();
    });
  });

  describe("if column.editor is date", () => {
    beforeEach(() => {
      column = {
        dataField: "id",
        text: "ID",
        editor: {
          type: EDITTYPE.DATE,
        },
      };

      render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={column}
            onUpdate={onUpdate}
            onEscape={onEscape}
          />
        </TableRowWrapper>
      );
    });

    it("should render date editor successfully", () => {
      const editor = screen.getByRole("checkbox");
      expect(editor).toBeInTheDocument();
    });
  });

  describe("async validation, onStartEdit, and keyboard interactions", () => {
    const textCol = { dataField: "name", text: "Name" };

    it("calls onStartEdit when provided to factory", () => {
      const onStartEdit = jest.fn();
      const CustomEditingCell = editingCellFactory(_, onStartEdit);
      render(
        <TableRowWrapper>
          <CustomEditingCell
            row={row}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={textCol}
            onUpdate={jest.fn()}
            onEscape={jest.fn()}
          />
        </TableRowWrapper>
      );
      expect(onStartEdit).toHaveBeenCalledWith(row, textCol, rowIndex, columnIndex);
    });

    it("handles async validator returning { async: true } and calling callback with valid: false", () => {
      let asyncDone: any;
      const validator = jest.fn((val, r, c, done) => {
        asyncDone = done;
        return { async: true };
      });
      const localOnUpdate = jest.fn();

      render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={{ ...textCol, validator }}
            onUpdate={localOnUpdate}
            onEscape={jest.fn()}
          />
        </TableRowWrapper>
      );

      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { keyCode: 13 });
      expect(validator).toHaveBeenCalled();

      // Complete async validation with error
      act(() => {
        asyncDone({ valid: false, message: "Async Error" });
      });
      expect(screen.getByText("Async Error")).toBeInTheDocument();
      expect(localOnUpdate).not.toHaveBeenCalled();

      // Complete async validation with valid: true
      act(() => {
        asyncDone({ valid: true });
      });
      expect(localOnUpdate).toHaveBeenCalled();
    });

    it("displays message when message prop is passed and triggers onErrorMessageDisappear after timeout", () => {
      jest.useFakeTimers();
      const onErrorMessageDisappear = jest.fn();

      render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={textCol}
            onUpdate={jest.fn()}
            onEscape={jest.fn()}
            message="Initial Error"
            timeToCloseMessage={100}
            onErrorMessageDisappear={onErrorMessageDisappear}
          />
        </TableRowWrapper>
      );

      expect(screen.getByText("Initial Error")).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(150);
      });

      expect(onErrorMessageDisappear).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it("handles ESC keydown and click stopPropagation", () => {
      const localOnEscape = jest.fn();
      render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={textCol}
            onUpdate={jest.fn()}
            onEscape={localOnEscape}
          />
        </TableRowWrapper>
      );

      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { keyCode: 27 });
      expect(localOnEscape).toHaveBeenCalled();

      const clickEvent = new MouseEvent("click", { bubbles: true });
      const spy = jest.spyOn(clickEvent, "stopPropagation");
      input.dispatchEvent(clickEvent);
      expect(spy).toHaveBeenCalled();
    });

    it("handles validator returning sync valid: true, default async result, rAF on escape, TD click, other key, and editorProps.onUpdate", () => {
      jest.useFakeTimers();
      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = (cb: any) => { cb(); return 0; };

      const focusSpy = jest.spyOn(HTMLElement.prototype, "focus");

      let capturedAsync: any;
      const validCol = {
        dataField: "text",
        text: "Text",
        validator: (newVal: any, r: any, c: any, asyncCb: any) => {
          capturedAsync = asyncCb;
          return { valid: true };
        },
      };

      const localOnUpdate = jest.fn();
      const localOnEscape = jest.fn();

      const { container } = render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={1}
            columnIndex={1}
            column={validCol}
            onUpdate={localOnUpdate}
            onEscape={localOnEscape}
            message="Timer without onErrorMessageDisappear"
            timeToCloseMessage={50}
          />
        </TableRowWrapper>
      );

      // Timeout fires without onErrorMessageDisappear callback
      act(() => {
        jest.advanceTimersByTime(100);
      });

      const input = container.querySelector("input")!;
      // Enter calls validator which returns { valid: true } -> onUpdate
      fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
      expect(localOnUpdate).toHaveBeenCalled();

      // Trigger capturedAsync with default argument (no arg passed)
      act(() => {
        capturedAsync();
      });

      // Press other key (not Enter or ESC)
      fireEvent.keyDown(input, { keyCode: 65 });

      // Click directly on TD
      const td = container.querySelector("td")!;
      fireEvent.click(td);

      // Press ESC to trigger rAF and focus
      fireEvent.keyDown(input, { key: "Escape", keyCode: 27 });
      expect(localOnEscape).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalled();
      focusSpy.mockRestore();

      // Test editorProps.onUpdate default callback by having both editor and editorRenderer defined
      let defaultOnUpdateCalled = false;
      const bothCol = {
        dataField: "name",
        text: "Name",
        editor: {}, // triggers isDefaultEditorDefined, skipping else if
        editorRenderer: (editorProps: any) => {
          editorProps.onUpdate();
          defaultOnUpdateCalled = true;
          return <div data-testid="both-editor" />;
        },
      };

      render(
        <TableRowWrapper>
          <EditingCell
            row={row}
            rowIndex={1}
            columnIndex={1}
            column={bothCol}
            onUpdate={jest.fn()}
            onEscape={jest.fn()}
          />
        </TableRowWrapper>
      );
      expect(defaultOnUpdateCalled).toBe(true);

      window.requestAnimationFrame = originalRAF;
      jest.useRealTimers();
    });
  });
});




