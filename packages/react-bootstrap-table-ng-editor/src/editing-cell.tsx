import cs from "classnames";

import React, { useId } from "react";

import { EDITTYPE, TIME_TO_CLOSE_MESSAGE } from "..";
import CheckBoxEditor from "./checkbox-editor";
import DateEditor from "./date-editor";
import DropdownEditor from "./dropdown-editor";
import EditorIndicator from "./editor-indicator";
import TextEditor from "./text-editor";
import TextAreaEditor from "./textarea-editor";

interface EditingCellProps {
  row: object;
  rowIndex: number;
  column: {
    dataField: any;
    validator?: any;
    editorClasses?: any;
    editorStyle?: any;
    editor?: { type: any; options?: any };
    editorRenderer?: Function;
    text: any;
  };
  columnIndex: number;
  onUpdate: (row: object, column: object, value: any) => void;
  onEscape: () => void;
  timeToCloseMessage?: number;
  autoSelectText?: boolean;
  className?: string;
  style?: object;
  onErrorMessageDisappear?: any;
  blurToSave?: boolean;
}

interface EditingCellState {
  invalidMessage: any;
}

const createEditingCell = (_: any, onStartEdit?: any) => {
  const EditingCell: React.FC<EditingCellProps & { message?: any }> = (props) => {
    const {
      row,
      rowIndex,
      column,
      columnIndex,
      onUpdate,
      onEscape,
      timeToCloseMessage = TIME_TO_CLOSE_MESSAGE,
      autoSelectText = false,
      className,
      style,
      onErrorMessageDisappear,
      blurToSave,
      message: propMessage,
    } = props;

    const [invalidMessage, setInvalidMessage] = React.useState<any>(null);
    const editorRef = React.useRef<any>(null);
    const indicatorTimerRef = React.useRef<any>(null);
    /** Stable id so aria-describedby links to the error indicator (WCAG 3.3.1) */
    const indicatorId = useId();

    const clearTimer = React.useCallback(() => {
      if (indicatorTimerRef.current) {
        clearTimeout(indicatorTimerRef.current);
      }
    }, []);

    const createTimer = React.useCallback(() => {
      clearTimer();
      indicatorTimerRef.current = _.sleep(() => {
        setInvalidMessage(null);
        if (_.isFunction(onErrorMessageDisappear)) onErrorMessageDisappear();
      }, timeToCloseMessage);
    }, [clearTimer, onErrorMessageDisappear, timeToCloseMessage]);

    const displayErrorMessage = React.useCallback((message: any) => {
      setInvalidMessage(message);
      createTimer();
    }, [createTimer]);

    const asyncbeforeCompete = React.useCallback((newValue: any) => {
      return (result = { valid: true }) => {
        const { valid, message } = result as any;
        if (!valid) {
          displayErrorMessage(message);
          return;
        }
        onUpdate(row, column, newValue);
      };
    }, [displayErrorMessage, onUpdate, row, column]);

    const beforeComplete = React.useCallback((newValue: any) => {
      if (_.isFunction(column.validator)) {
        const validateForm = column.validator(
          newValue,
          row,
          column,
          asyncbeforeCompete(newValue)
        );
        if (_.isObject(validateForm)) {
          if (validateForm.async) {
            return;
          } else if (!validateForm.valid) {
            displayErrorMessage(validateForm.message);
            return;
          }
        }
      }
      onUpdate(row, column, newValue);
    }, [column, row, asyncbeforeCompete, displayErrorMessage, onUpdate]);

    const handleBlur = React.useCallback(() => {
      if (blurToSave) {
        beforeComplete(editorRef.current?.getValue());
      } else {
        onEscape();
      }
    }, [blurToSave, beforeComplete, onEscape]);

    const handleKeyDown = React.useCallback((e: any) => {
      if (e.keyCode === 27) {
        // ESC — cancel edit and restore focus to the originating cell (WCAG 2.4.3)
        onEscape();
        // Find the <td> that was active before editing started and return focus to it.
        // The <td> carries data-col-idx set by RowPureContent, and the row <tr> has an id.
        // We look for [data-col-idx="columnIndex"] within the nearest ancestor <tr>.
        requestAnimationFrame(() => {
          const cell = document.querySelector<HTMLElement>(
            `[data-editing-cell="${rowIndex}-${columnIndex}"]`
          );
          cell?.focus();
        });
      } else if (e.keyCode === 13) {
        // ENTER
        beforeComplete(editorRef.current?.getValue());
      }
    }, [beforeComplete, onEscape, rowIndex, columnIndex]);

    const handleClick = React.useCallback((e: any) => {
      if (e.target.tagName !== "TD") {
        e.stopPropagation();
      }
    }, []);

    React.useEffect(() => {
      return () => clearTimer();
    }, [clearTimer]);

    React.useEffect(() => {
      if (_.isDefined(propMessage)) {
        displayErrorMessage(propMessage);
      }
    }, [propMessage, displayErrorMessage]);

    const { dataField } = column;
    const value = _.get(row, dataField);
    const hasError = _.isDefined(invalidMessage);

    let customEditorClass = column.editorClasses || "";
    if (_.isFunction(column.editorClasses)) {
      customEditorClass = column.editorClasses(
        value,
        row,
        rowIndex,
        columnIndex
      );
    }

    let editorStyle = column.editorStyle || {};
    if (_.isFunction(column.editorStyle)) {
      editorStyle = column.editorStyle(value, row, rowIndex, columnIndex);
    }

    const editorClass = cs(
      {
        animated: hasError,
        shake: hasError,
      },
      customEditorClass
    );

    let editorProps: any = {
      ref: editorRef,
      defaultValue: value,
      style: editorStyle,
      className: editorClass,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      didMount: () => { },
      onUpdate: () => { },
      /** WCAG 3.3.2 / 4.1.2 — every editor type receives a programmatic label */
      "aria-label": column.text,
      "aria-invalid": hasError,
      /** WCAG 3.3.1 — link to the error indicator when one is visible */
      ...(hasError ? { "aria-describedby": indicatorId } : {}),
    };

    if (onStartEdit) {
      editorProps.didMount = () =>
        onStartEdit(row, column, rowIndex, columnIndex);
    }

    const isDefaultEditorDefined = _.isObject(column.editor);

    if (isDefaultEditorDefined) {
      editorProps = {
        ...editorProps,
        ...column.editor,
      };
    } else if (_.isFunction(column.editorRenderer)) {
      editorProps = {
        ...editorProps,
        onUpdate: beforeComplete,
      };
    }

    let editor: any;
    if (_.isFunction(column.editorRenderer)) {
      editor = column.editorRenderer!(
        editorProps,
        value,
        row,
        column,
        rowIndex,
        columnIndex
      );
    } else if (
      isDefaultEditorDefined &&
      column.editor?.type === EDITTYPE.SELECT
    ) {
      editor = <DropdownEditor {...editorProps} row={row} column={column} />;
    } else if (
      isDefaultEditorDefined &&
      column.editor?.type === EDITTYPE.TEXTAREA
    ) {
      editor = (
        <TextAreaEditor {...editorProps} autoSelectText={autoSelectText} />
      );
    } else if (
      isDefaultEditorDefined &&
      column.editor?.type === EDITTYPE.CHECKBOX
    ) {
      editor = <CheckBoxEditor {...editorProps} />;
    } else if (
      isDefaultEditorDefined &&
      column.editor?.type === EDITTYPE.DATE
    ) {
      editor = <DateEditor {...editorProps} />;
    } else {
      editor = (
        <TextEditor {...editorProps} autoSelectText={autoSelectText} />
      );
    }

    return (
      <td
        className={cs("react-bootstrap-table-editing-cell", className)}
        style={style}
        onClick={handleClick}
        /** data-editing-cell lets the Esc handler refocus this cell (WCAG 2.4.3) */
        data-editing-cell={`${rowIndex}-${columnIndex}`}
      >
        {editor}
        {hasError ? (
          <EditorIndicator invalidMessage={invalidMessage} id={indicatorId} />
        ) : null}
      </td>
    );
  };
  return EditingCell;
};

export default createEditingCell;
