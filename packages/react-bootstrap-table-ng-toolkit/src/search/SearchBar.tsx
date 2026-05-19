import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { SearchBarProps } from "../..";

const handleDebounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate?: boolean
) => {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = undefined;

      if (!immediate) {
        func.apply(this, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait || 0);

    if (callNow) {
      func.apply(this, args);
    }
  };
};

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const {
    className = "",
    style = {},
    placeholder = "Search",
    tableId = "0",
    srText = "Search this table",
    searchText: defaultSearchText = "",
    delay = 250,
    onSearch,
  } = props as any;

  const [value, setValue] = useState(defaultSearchText ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const previousDefaultSearchText = useRef(defaultSearchText);

  const debouncedSearch = useMemo(
    () =>
      handleDebounce((val: string) => {
        if (onSearch) {
          onSearch(val);
        }
      }, delay),
    [onSearch, delay]
  );

  const onChangeValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  }, [debouncedSearch]);

  useEffect(() => {
    if (defaultSearchText !== previousDefaultSearchText.current) {
      setValue(defaultSearchText || "");
      previousDefaultSearchText.current = defaultSearchText;
    }
  }, [defaultSearchText]);

  return (
    <div className="search-label-container">
      <label htmlFor={`search-bar-${tableId}`} className="search-label" id={`search-bar-${tableId}-label`}>
        {srText}
      </label>
      <input
        ref={inputRef}
        id={`search-bar-${tableId}`}
        type="text"
        style={style as any}
        aria-labelledby={`search-bar-${tableId}-label`}
        onChange={onChangeValue}
        className={`form-control ${className}`}
        value={value}
        placeholder={placeholder}
      />
      <span aria-live="polite" className="sr-only visually-hidden">
        {value ? `Search applied for: ${value}` : "Search cleared"}
      </span>
    </div>
  );
};

export default SearchBar;
