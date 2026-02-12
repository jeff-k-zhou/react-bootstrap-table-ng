
import React from "react";

interface SizePerPageOptionProps {
  text: string;
  page: number;
  onSizePerPageChange: (page: number) => void;
  bootstrap4?: boolean;
}

const SizePerPageOption = ({
  text,
  page,
  onSizePerPageChange,
  bootstrap4 = false,
}: SizePerPageOptionProps) =>
  bootstrap4 ? (
    <a
      href="#"
      tabIndex={-1}
      role="menuitem"
      className="dropdown-item"
      data-page={page}
      onMouseDown={(e) => {
        e.preventDefault();
        onSizePerPageChange(page);
      }}
    >
      {text}
    </a>
  ) : (
    <li key={text} role="presentation" className="dropdown-item">
      <a
        href="#"
        tabIndex={-1}
        role="menuitem"
        data-page={page}
        onMouseDown={(e) => {
          e.preventDefault();
          onSizePerPageChange(page);
        }}
      >
        {text}
      </a>
    </li>
  );

SizePerPageOption.defaultProps = {
  bootstrap4: false,
};

export default SizePerPageOption;
