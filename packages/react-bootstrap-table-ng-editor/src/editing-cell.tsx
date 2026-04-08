import cs from "classnames";

import React, { Component } from "react";

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
        // ESC
        onEscape();
      } else if (e.keyCode === 13) {
        // ENTER
        beforeComplete(editorRef.current?.getValue());
      }
    }, [beforeComplete, onEscape]);

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
      >
        {editor}
        {hasError ? (
          <EditorIndicator invalidMessage={invalidMessage} />
        ) : null}
      </td>
    );
  };
  return EditingCell;
};

export default createEditingCell;
