import React, { Component, ReactNode } from "react";
import {
  CHECKBOX_STATUS_CHECKED,
  CHECKBOX_STATUS_INDETERMINATE,
  ROW_SELECT_MULTIPLE,
  ROW_SELECT_SINGLE,
} from "../const";
import _ from "../utils";
import { BootstrapContext } from "../contexts/bootstrap";

interface CheckBoxProps {
  className?: string;
  checked: boolean;
  indeterminate: boolean;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
  className,
  checked,
  indeterminate,
}) => (
  <input
    type="checkbox"
    checked={checked}
    className={className}
    ref={(input) => {
      if (input) {
        input.indeterminate = indeterminate;
      }
    }}
    onChange={() => { }}
  />
);

interface SelectionHeaderCellProps {
  mode?: string;
  checkedStatus?: string;
  onAllRowsSelect?: (
    e: React.MouseEvent<HTMLTableHeaderCellElement>,
    isUnSelect: boolean
  ) => void;
  hideSelectAll?: boolean;
  selectionHeaderRenderer?: (args: {
    mode?: string;
    checked: boolean;
    indeterminate: boolean;
  }) => ReactNode;
  headerColumnStyle?:
  | React.CSSProperties
  | ((checkedStatus: string) => React.CSSProperties);
}

const SelectionHeaderCell: React.FC<SelectionHeaderCellProps> = React.memo((props) => {
  const {
    mode,
    checkedStatus,
    selectionHeaderRenderer,
    onAllRowsSelect,
    hideSelectAll,
    headerColumnStyle,
  } = props;
  const { bootstrap4, bootstrap5 } = React.useContext(BootstrapContext);

  if (hideSelectAll) {
    return <th data-row-selection />;
  }

  const handleCheckBoxClick = (e: React.MouseEvent<HTMLTableHeaderCellElement>) => {
    const isUnSelect =
      checkedStatus === CHECKBOX_STATUS_CHECKED ||
      checkedStatus === CHECKBOX_STATUS_INDETERMINATE;

    onAllRowsSelect!(e, isUnSelect);
  };

  const checked = checkedStatus === CHECKBOX_STATUS_CHECKED;
  const indeterminate = checkedStatus === CHECKBOX_STATUS_INDETERMINATE;

  const attrs: React.HTMLAttributes<HTMLTableHeaderCellElement> = {};
  if (selectionHeaderRenderer || mode === ROW_SELECT_MULTIPLE) {
    attrs.onClick = handleCheckBoxClick;
  }

  attrs.style = (_.isFunction(headerColumnStyle)
    ? headerColumnStyle(checkedStatus!)
    : headerColumnStyle) as any;

  let content: React.ReactNode | undefined;
  if (selectionHeaderRenderer) {
    content = selectionHeaderRenderer({
      mode,
      checked,
      indeterminate,
    });
  } else if (mode === ROW_SELECT_MULTIPLE) {
    content = (
      <CheckBox
        {...props}
        checked={checked}
        className={
          bootstrap5
            ? "selection-input-5"
            : bootstrap4
            ? "selection-input-4"
            : ""
        }
        indeterminate={indeterminate}
      />
    );
  }

  return (
    <th className="selection-cell-header" data-row-selection {...attrs as any}>
      {content}
    </th>
  );
}, (prevProps, nextProps) => {
  if (prevProps.mode === ROW_SELECT_SINGLE) return true;
  return (
    prevProps.mode === nextProps.mode &&
    prevProps.checkedStatus === nextProps.checkedStatus &&
    prevProps.onAllRowsSelect === nextProps.onAllRowsSelect &&
    prevProps.hideSelectAll === nextProps.hideSelectAll &&
    prevProps.selectionHeaderRenderer === nextProps.selectionHeaderRenderer &&
    prevProps.headerColumnStyle === nextProps.headerColumnStyle
  );
});

export default SelectionHeaderCell;
