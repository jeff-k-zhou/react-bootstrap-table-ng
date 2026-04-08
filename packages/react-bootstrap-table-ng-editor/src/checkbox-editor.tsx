/* eslint no-return-assign: 0 */
import cs from "classnames";
import React, { ChangeEvent, Component } from "react";

interface CheckBoxEditorProps {
  className?: string;
  value?: string;
  defaultValue?: any;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  didMount?: () => void;
  onUpdate?: any;
}

interface CheckBoxEditorState {
  checked: boolean;
}

const CheckBoxEditor = React.forwardRef<any, CheckBoxEditorProps>((props, ref) => {
  const {
    defaultValue = false,
    didMount,
    className = "",
    onUpdate,
    onChange,
    value = "on:off",
    ...rest
  } = props;

  const [checked, setChecked] = React.useState(
    (defaultValue ?? false).toString() === value.split(":")[0]
  );
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => ({
    getValue() {
      const [positive, negative] = value.split(":");
      return checkboxRef.current?.checked ? positive : negative;
    }
  }));

  React.useEffect(() => {
    checkboxRef.current?.focus();
    if (didMount) didMount();
  }, []); // Run only once on mount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    setChecked(e.target.checked);
  };

  const editorClass = cs("editor edit-chseckbox checkbox", className);
  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      className={editorClass}
      {...rest}
      checked={checked}
      onChange={handleChange}
    />
  );
});

export default CheckBoxEditor;
