
import React from "react";

interface SizePerPageOptionProps {
  text: string;
  page: number;
  onSizePerPageChange: (page: number) => void;
  bootstrap4?: boolean;
  bootstrap5?: boolean;
}

const SizePerPageOption = ({
  text,
  page,
  onSizePerPageChange,
  bootstrap4 = false,
  bootstrap5 = false,
}: SizePerPageOptionProps) => {
  const handleSelect = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    onSizePerPageChange(page);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSizePerPageChange(page);
    }
  };

  if (bootstrap4 || bootstrap5) {
    return (
      <a
        href="#"
        tabIndex={0}
        role="option"
        aria-selected={false}
        className="dropdown-item"
        data-page={page}
        onMouseDown={handleSelect as React.MouseEventHandler}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.preventDefault()}
      >
        {text}
      </a>
    );
  }

  return (
    <li key={text} role="presentation" className="dropdown-item">
      <a
        href="#"
        tabIndex={0}
        role="option"
        aria-selected={false}
        data-page={page}
        onMouseDown={handleSelect as React.MouseEventHandler}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.preventDefault()}
      >
        {text}
      </a>
    </li>
  );
};


export default SizePerPageOption;
