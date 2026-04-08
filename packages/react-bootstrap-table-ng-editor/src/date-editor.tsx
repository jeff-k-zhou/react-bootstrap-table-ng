/* eslint no-return-assign: 0 */
import cs from "classnames";
import React, { Component } from "react";

interface DateEditorProps {
  className?: string;
  defaultValue?: string;
  didMount?: () => void;
  onUpdate?: any;
}

const DateEditor = React.forwardRef<any, DateEditorProps>((props, ref) => {
  const {
    defaultValue = "",
    didMount,
    className = "",
    onUpdate,
    ...rest
  } = props;

  const dateRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => ({
    getValue() {
      return dateRef.current?.value;
    }
  }));

  React.useEffect(() => {
    if (dateRef.current) {
      dateRef.current.valueAsDate = new Date(defaultValue);
      dateRef.current.focus();
    }
    if (didMount) didMount();
  }, []); // Run only once on mount

  const editorClass = cs(className, "form-control editor edit-date");
  return (
    <input
      ref={dateRef}
      type="date"
      lang="en-US"
      className={editorClass}
      {...rest}
    />
  );
});

export default DateEditor;
