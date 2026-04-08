/* eslint no-return-assign: 0 */
import cs from "classnames";
import React, { Component } from "react";

interface TextEditorProps {
  className?: string;
  defaultValue?: string | number;
  autoSelectText?: boolean;
  didMount?: () => void;
  onUpdate: (row: object, column: object, value: any) => void;
}

const TextEditor = React.forwardRef<any, TextEditorProps>((props, ref) => {
  const {
    defaultValue = "",
    didMount,
    className = "",
    autoSelectText = false,
    onUpdate,
    ...rest
  } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => ({
    getValue() {
      return inputRef.current?.value;
    }
  }));

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = defaultValue as string;
      inputRef.current.focus();
      if (autoSelectText) inputRef.current.select();
    }
    if (didMount) didMount();
  }, []); // Run only once on mount

  const editorClass = cs(className, "form-control editor edit-text");
  return (
    <input
      ref={inputRef}
      type="text"
      className={editorClass}
      {...rest}
    />
  );
});

export default TextEditor;
