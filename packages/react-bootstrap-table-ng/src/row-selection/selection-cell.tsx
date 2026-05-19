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

  const rowLabel = `Select row ${rowIndex + 1}`;

  const style = (_.isFunction(selectColumnStyle)
    ? selectColumnStyle({
      checked: selected,
      disabled,
      rowindex: rowIndex,
      rowkey: rowKey,
    })
    : selectColumnStyle) as any;

  const handleSelection = (e: any) => {
    if (disabled) return;
    e.stopPropagation();
    const checked = inputType === ROW_SELECT_SINGLE ? true : !selected;
    onRowSelect!(rowKey, checked, rowIndex, e);
  };

  return (
    <td
      className="selection-cell"
      data-testid="selection-cell"
      style={style}
    >
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
          aria-label={rowLabel}
          tabIndex={tabIndex !== -1 ? tabIndex : 0}
          className={
            bootstrap5
              ? "selection-input-5"
              : bootstrap4
                ? "selection-input-4"
                : ""
          }
          onClick={handleSelection}
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
