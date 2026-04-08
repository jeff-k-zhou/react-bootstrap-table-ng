import React, { Component, MouseEvent } from "react";
import { ROW_SELECT_SINGLE } from "../const";
import _ from "../utils";
import { BootstrapContext } from "../contexts/bootstrap";

interface SelectionCellProps {
  mode?: string;
  rowKey: any;
  selected: boolean;
  onRowSelect?: (
    rowKey: any,
    checked: boolean,
    rowIndex: number,
    e: MouseEvent
  ) => void;
  disabled?: boolean;
  rowIndex?: number;
  tabIndex?: number;
  clickToSelect?: boolean;
  selectionRenderer?: (args: {
    mode: string;
    checked: boolean;
    disabled?: boolean;
    rowindex?: number;
    rowkey: any;
  }) => React.ReactNode;
  selectColumnStyle?:
  | React.CSSProperties
  | ((args: {
    checked: boolean;
    disabled?: boolean;
    rowindex?: number;
    rowkey: any;
  }) => React.CSSProperties);
}

const SelectionCell: React.FC<SelectionCellProps> = React.memo((props) => {
  const {
    rowKey,
    mode: inputType,
    selected,
    onRowSelect,
    disabled,
    tabIndex = -1,
    rowIndex = -1,
    selectionRenderer,
    selectColumnStyle,
  } = props;
  const { bootstrap4, bootstrap5 } = React.useContext(BootstrapContext);

  const handleClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
    e.stopPropagation();
    if (disabled) return;

    const checked = inputType === ROW_SELECT_SINGLE ? true : !selected;
    onRowSelect!(rowKey, checked, rowIndex, e);
  };

  const attrs: React.HTMLAttributes<HTMLTableCellElement> = {};
  if (tabIndex !== -1) attrs.tabIndex = tabIndex;

  attrs.style = (_.isFunction(selectColumnStyle)
    ? selectColumnStyle({
      checked: selected,
      disabled,
      rowindex: rowIndex,
      rowkey: rowKey,
    })
    : selectColumnStyle) as any;

  return (
    <td className="selection-cell" onClick={handleClick} data-testid="selection-cell" {...attrs as any}>
      {selectionRenderer ? (
        selectionRenderer({
          mode: inputType!,
          checked: selected,
          disabled: disabled ?? false,
          rowindex: rowIndex,
          rowkey: rowKey,
        })
      ) : (
        <input
          type={inputType}
          checked={selected}
          disabled={disabled ?? false}
          className={
            bootstrap5
              ? "selection-input-5"
              : bootstrap4
              ? "selection-input-4"
              : ""
          }
          onChange={() => { }}
        />
      )}
    </td>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.rowIndex === nextProps.rowIndex &&
    prevProps.selected === nextProps.selected &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.rowKey === nextProps.rowKey &&
    prevProps.tabIndex === nextProps.tabIndex &&
    prevProps.onRowSelect === nextProps.onRowSelect &&
    prevProps.selectionRenderer === nextProps.selectionRenderer &&
    prevProps.selectColumnStyle === nextProps.selectColumnStyle
  );
});

export default SelectionCell;
