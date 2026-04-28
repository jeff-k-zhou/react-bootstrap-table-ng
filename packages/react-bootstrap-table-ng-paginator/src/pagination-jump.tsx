/* eslint react/require-default-props: 0 */
import React, { useCallback, useEffect, useRef, useState } from "react";

interface PaginationJumpProps {
  /** The currently active page number */
  currPage: number;
  /** The first page number (pageStartIndex) */
  firstPage: number;
  /** The last page number */
  lastPage: number;
  /** Callback when the user commits a valid page selection */
  onPageChange: (page: number) => void;
  /** Unique table id used to namespace the datalist id */
  tableId?: string;
}

const PaginationJump: React.FC<PaginationJumpProps> = ({
  currPage,
  firstPage,
  lastPage,
  onPageChange,
  tableId = "table",
}) => {
  const [inputValue, setInputValue] = useState<string>(`${currPage}`);
  const inputRef = useRef<HTMLInputElement>(null);
  const datalistId = `${tableId}-page-jump-list`;

  // Keep input in sync when the external page changes (e.g. prev/next buttons)
  useEffect(() => {
    setInputValue(`${currPage}`);
  }, [currPage]);

  const commit = useCallback(
    (raw: string) => {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= firstPage && parsed <= lastPage) {
        if (parsed !== currPage) {
          onPageChange(parsed);
        }
        setInputValue(`${parsed}`);
      } else {
        // revert to current page on invalid input
        setInputValue(`${currPage}`);
      }
    },
    [currPage, firstPage, lastPage, onPageChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commit((e.target as HTMLInputElement).value);
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setInputValue(`${currPage}`);
      inputRef.current?.blur();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    commit(e.target.value);
  };

  // Build the option list once
  const options: React.ReactNode[] = [];
  for (let p = firstPage; p <= lastPage; p++) {
    options.push(<option key={p} value={p} />);
  }

  return (
    <div className="react-bootstrap-table-page-jump-wrapper">
      <label
        className="react-bootstrap-table-page-jump-label"
        htmlFor={datalistId + "-input"}
      >
        Page:
      </label>
      <input
        id={datalistId + "-input"}
        ref={inputRef}
        type="number"
        className="react-bootstrap-table-page-jump-input form-control"
        list={datalistId}
        value={inputValue}
        min={firstPage}
        max={lastPage}
        aria-label={`Jump to page, current page ${currPage}, range ${firstPage} to ${lastPage}`}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <datalist id={datalistId}>{options}</datalist>
      <span className="react-bootstrap-table-page-jump-total">
        / {lastPage}
      </span>
    </div>
  );
};

export default PaginationJump;
