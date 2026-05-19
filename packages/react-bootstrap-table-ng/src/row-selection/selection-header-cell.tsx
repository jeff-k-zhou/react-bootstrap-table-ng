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
    aria-label="Select all rows"
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
    // Placeholder <th> for single-select: occupies column space to match body
    return (
      <th scope="col" data-row-selection>
        <span className="sr-only visually-hidden">Selection column</span>
      </th>
    );
  }

  const handleCheckBoxClick = (e: React.MouseEvent<HTMLTableHeaderCellElement>) => {
    const isUnSelect =
      checkedStatus === CHECKBOX_STATUS_CHECKED ||
      checkedStatus === CHECKBOX_STATUS_INDETERMINATE;

    onAllRowsSelect!(e, isUnSelect);
  };

  // Allow keyboard activation of select-all (WCAG 2.1.1)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableHeaderCellElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const isUnSelect =
        checkedStatus === CHECKBOX_STATUS_CHECKED ||
        checkedStatus === CHECKBOX_STATUS_INDETERMINATE;
      onAllRowsSelect!(e as any, isUnSelect);
    }
  };

  const checked = checkedStatus === CHECKBOX_STATUS_CHECKED;
  const indeterminate = checkedStatus === CHECKBOX_STATUS_INDETERMINATE;

  const attrs: React.HTMLAttributes<HTMLTableHeaderCellElement> = {};
  if (selectionHeaderRenderer || mode === ROW_SELECT_MULTIPLE) {
    attrs.onClick = handleCheckBoxClick;
    attrs.onKeyDown = handleKeyDown;
    attrs.tabIndex = 0;
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
    <th
      className="selection-cell-header"
      scope="col"
      aria-label="Select all rows"
      data-row-selection
      {...attrs as any}
    >
      <span className="sr-only visually-hidden">Selection Column</span>
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
