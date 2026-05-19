import React, { forwardRef, useImperativeHandle } from "react";
import { FILTER_TYPES, TextFilterProps } from "../const";

const TextFilter = forwardRef<any, TextFilterProps>((props, ref) => {
  const {
    id = null,
    placeholder,
    column,
    style,
    className,
    onFilter,
    caseSensitive = false,
    defaultValue = "",
    getFilter,
    filterState = {},
    delay = 500,
    onClick,
    ...rest
  } = props;

  const { dataField, text } = column;

  const [value, setValue] = React.useState(() => {
    if (filterState && typeof filterState.filterVal !== "undefined") {
      return filterState.filterVal;
    }
    return defaultValue ?? "";
  });

  const inputRef = React.useRef<HTMLInputElement>(null);
  const timeoutRef = React.useRef<any>(null);

  const cleanTimer = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    applyFilter: (val: any) => {
      setValue(val);
      if (onFilter) {
        (onFilter as any)(column, FILTER_TYPES.TEXT)(val);
      }
    },
    cleanFiltered: () => {
      setValue("");
      if (onFilter) {
        (onFilter as any)(column, FILTER_TYPES.TEXT)("");
      }
    }
  }));

  React.useEffect(() => {
    return () => cleanTimer();
  }, [cleanTimer]);

  React.useEffect(() => {
    const initialValue = inputRef.current?.value;

    if (onFilter && initialValue) {
      (onFilter as any)(column, FILTER_TYPES.TEXT, true)(initialValue);
    }

    // export onFilter function to allow users to access
    if (getFilter) {
      getFilter((filterVal: any) => {
        setValue(filterVal);
        if (onFilter) {
          (onFilter as any)(column, FILTER_TYPES.TEXT)(filterVal);
        }
      });
    }
  }, []);


  // Track the last filterVal we received from the parent so we can detect
  // genuine external changes vs. stale re-renders with the old value.
  const lastRemoteVal = React.useRef<string>(
    filterState && typeof filterState.filterVal !== "undefined"
      ? filterState.filterVal
      : defaultValue ?? ""
  );

  React.useEffect(() => {
    // Only sync when the parent explicitly provides a new filterVal.
    // When the filter is cleared, FilterContext removes the key entirely
    // (filterState becomes undefined), so we must NOT fall back to defaultValue
    // here — that would revert the input back to "8" after the user clears it.
    if (!filterState || typeof filterState.filterVal === "undefined") return;

    const remoteVal = filterState.filterVal;
    if (remoteVal !== lastRemoteVal.current) {
      lastRemoteVal.current = remoteVal;
      setValue(remoteVal);
    }
  }, [filterState]);

  const lastDefaultValue = React.useRef(defaultValue);
  React.useEffect(() => {
    if (defaultValue !== lastDefaultValue.current) {
      lastDefaultValue.current = defaultValue;
      setValue(defaultValue ?? "");
      if (onFilter) {
        (onFilter as any)(column, FILTER_TYPES.TEXT)(defaultValue);
      }
    }
  }, [defaultValue, column, onFilter]);

  const filterHandler = React.useCallback(
    (e: any) => {
      e.stopPropagation();
      cleanTimer();
      const filterValue = e.target.value;
      // Track the user-typed value as the "last remote" so that if the parent
      // re-renders with the old remote value, we don't clobber what the user typed.
      lastRemoteVal.current = filterValue;
      setValue(filterValue);
      timeoutRef.current = setTimeout(() => {
        if (onFilter) {
          (onFilter as any)(column, FILTER_TYPES.TEXT)(filterValue);
        }
      }, delay);
    },
    [cleanTimer, column, onFilter, delay]
  );

  const handleClick = React.useCallback(
    (e: any) => {
      e.stopPropagation();
      if (onClick) {
        onClick(e);
      }
    },
    [onClick]
  );

  const elmId = `text-filter-column-${dataField}${id ? `-${id}` : ""}`;

  return (
    <label className="filter-label" htmlFor={elmId}>
      <span className="sr-only visually-hidden">Filter by {text}:</span>
      <input
        {...rest}
        ref={inputRef}
        type="text"
        id={elmId}
        className={`filter text-filter form-control ${className}`}
        style={style}
        onChange={filterHandler}
        onClick={handleClick}
        placeholder={placeholder || `Enter ${text}...`}
        value={value}
        data-testid="text-filter"
      />
      <span aria-live="polite" className="sr-only visually-hidden">
        {value ? `Filter applied: ${value}` : "Filter cleared"}
      </span>
    </label>
  );
});

TextFilter.displayName = "TextFilter";

export default TextFilter;
