import cs from "classnames";

import React from "react";
import SizePerPageOption from "./size-per-page-option";

const sizePerPageDefaultClass = "react-bs-table-sizePerPage-dropdown";

const sizePerPageDropDownDefaultProps = {
  open: false,
  hidden: false,
  btnContextual: "btn-default btn-secondary",
  variation: "dropdown",
  className: "",
  optionRenderer: null,
  bootstrap4: false,
  bootstrap5: false,
  tableId: null,
};

interface SizePerPageDropDownProps {
  currSizePerPage: string | number;
  options: Array<{
    text: string;
    page: number;
  }>;
  onClick: (e: React.MouseEvent) => void;
  onBlur: (e: React.FocusEvent) => void;
  onSizePerPageChange: (sizePerPage: number) => void;
  bootstrap4?: boolean;
  bootstrap5?: boolean;
  tableId?: string;
  open?: boolean;
  hidden?: boolean;
  btnContextual?: string;
  variation?: "dropdown" | "dropup";
  className?: string;
  optionRenderer?: (props: any) => React.ReactElement | null;
}

const SizePerPageDropDown = (props: SizePerPageDropDownProps) => {
  const {
    open,
    tableId,
    hidden,
    onClick,
    onBlur,
    options,
    className,
    variation,
    bootstrap4,
    bootstrap5,
    btnContextual,
    optionRenderer,
    currSizePerPage,
    onSizePerPageChange,
  } = { ...sizePerPageDropDownDefaultProps, ...props };

  const openClass = open ? "open show" : "";
  const dropdownClasses = cs(
    openClass,
    sizePerPageDefaultClass,
    variation,
    className
  );

  const id = tableId ? `${tableId}-pageDropDown` : "pageDropDown";

  return (
    <span
      style={{ visibility: hidden ? "hidden" : "visible" }}
      className={dropdownClasses}
      data-testid="size-per-page-dropdown"
    >
      <button
        id={id}
        type="button"
        className={`btn ${btnContextual} dropdown-toggle`}
        data-toggle={bootstrap5 ? undefined : "dropdown"}
        data-bs-toggle={bootstrap5 ? "dropdown" : undefined}
        aria-expanded={open}
        onClick={onClick}
        onBlur={onBlur}
      >
        {currSizePerPage}{" "}
        {bootstrap4 || bootstrap5 ? null : (
          <span>
            <span className="caret" />
          </span>
        )}
      </button>
      <ul
        className={`dropdown-menu ${openClass}`}
        role="menu"
        aria-labelledby={id}
      >
        {options.map((option: any) => {
          if (optionRenderer) {
            return optionRenderer({
              ...option,
              onSizePerPageChange,
            });
          }
          return (
            <SizePerPageOption
              {...option}
              key={option.text}
              bootstrap4={bootstrap4}
              bootstrap5={bootstrap5}
              onSizePerPageChange={onSizePerPageChange}
            />
          );
        })}
      </ul>
    </span>
  );
};



export default SizePerPageDropDown;
