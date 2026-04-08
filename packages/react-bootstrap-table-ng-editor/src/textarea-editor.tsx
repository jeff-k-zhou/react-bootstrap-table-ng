import cs from "classnames";
import React, { Component } from "react";

interface TextEditorProps {
  className?: string;
  defaultValue?: string | number;
  autoSelectText?: boolean;
  didMount?: () => void;
  onKeyDown: (event: any) => void;
  onUpdate?: any;
}

const TextAreaEditor = React.forwardRef<any, TextEditorProps>((props, ref) => {
  const {
    defaultValue = "",
    didMount,
    className = "",
    autoSelectText = false,
    onKeyDown,
    onUpdate,
    ...rest
  } = props;

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

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

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13 && !e.shiftKey) return;
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const editorClass = cs(className, "form-control editor edit-textarea");
  return (
    <textarea
      ref={inputRef}
      className={editorClass}
      {...rest}
      onKeyDown={handleKeyDown}
    />
  );
});

export default TextAreaEditor;
