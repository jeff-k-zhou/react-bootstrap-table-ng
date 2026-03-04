/* eslint no-return-assign: 0 */
import cs from "classnames";
import React, { Component } from "react";

interface Option {
  label: string;
  value: any;
}

interface DropDownEditorProps {
  row: object;
  column: object;
  defaultValue?: string | number;
  className?: string;
  style?: object;
  options?: Option[];
  didMount?: () => void;
  getOptions?: (
    setOptions: (options: Option[]) => void,
    context: { row: object; column: object }
  ) => Option[] | void;
  onUpdate?: any;
}

interface DropDownEditorState {
  options: Option[];
}

const DropDownEditor = React.forwardRef<any, DropDownEditorProps>((props, ref) => {
  const {
    defaultValue = "",
    didMount,
    getOptions,
    className = "",
    onUpdate,
    options: initialOptions = [],
    row,
    column,
    ...rest
  } = props;

  const [options, setOptions] = React.useState<Option[]>(initialOptions);
  const selectRef = React.useRef<HTMLSelectElement>(null);

  React.useImperativeHandle(ref, () => ({
    getValue() {
      return selectRef.current?.value;
    }
  }));

  React.useEffect(() => {
    if (getOptions) {
      const result = getOptions(setOptions, { row, column });
      if (result) setOptions(result);
    }
  }, [getOptions, row, column]);

  React.useEffect(() => {
    if (selectRef.current) {
      selectRef.current.value = defaultValue as string;
      selectRef.current.focus();
    }
    if (didMount) didMount();
  }, []); // Run only once on mount

  const editorClass = cs(className, "form-control editor edit-select");

  return (
    <select
      {...rest}
      ref={selectRef}
      defaultValue={defaultValue}
      className={editorClass}
    >
      {options.map(({ label, value: val }: any) => (
        <option key={val} value={val}>
          {label}
        </option>
      ))}
    </select>
  );
});

export default DropDownEditor;
