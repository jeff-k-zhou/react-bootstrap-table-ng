/* eslint react/require-default-props: 0 */
/* eslint no-return-assign: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint class-methods-use-this: 0 */
import React, { forwardRef, useId, useImperativeHandle } from "react";
import { EQ, FILTER_TYPES, SelectFilterProps } from "../const";

function optionsEquals(currOpts: any, prevOpts: any) {
  if (Array.isArray(currOpts)) {
    if (currOpts.length === prevOpts.length) {
      for (let i = 0; i < currOpts.length; i += 1) {
        if (
          currOpts[i].value !== prevOpts[i].value ||
          currOpts[i].label !== prevOpts[i].label
        ) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  const keys = Object.keys(currOpts);
  for (let i = 0; i < keys.length; i += 1) {
    if (currOpts[keys[i]] !== prevOpts[keys[i]]) {
      return false;
    }
  }
  return Object.keys(currOpts).length === Object.keys(prevOpts).length;
}

function getOptionValue(options: any, key: any) {
  if (Array.isArray(options)) {
    const result = options
      .filter(({ label }: any) => label === key)
      .map(({ value }: any) => value);
    return result[0];
  }
  return options[key];
}

const SelectFilter = forwardRef<any, SelectFilterProps>((props, ref) => {
  const {
    id,
    style,
    className,
    defaultValue = "",
    onFilter,
    column,
    options: propOptions,
    comparator = EQ,
    withoutEmptyOption = false,
    caseSensitive = true,
    getFilter,
    filterState = {},
    placeholder,
    ...rest
  } = props;

  const generatedId = useId();
  const resolvedOptions = React.useMemo(() => {
    return typeof propOptions === "function"
      ? propOptions(column)
      : propOptions;
  }, [propOptions, column]);

  const getDefaultValue = React.useCallback(() => {
    if (filterState && typeof filterState.filterVal !== "undefined") {
      return filterState.filterVal;
    }
    return defaultValue;
  }, [filterState, defaultValue]);

  const [isSelected, setIsSelected] = React.useState(() => {
    const val = getOptionValue(resolvedOptions, getDefaultValue());
    return val !== undefined && val !== "";
  });

  const selectInputRef = React.useRef<HTMLSelectElement>(null);

  useImperativeHandle(ref, () => ({
    applyFilter: (val: any) => {
        setIsSelected(val !== "");
        if (selectInputRef.current) {
          selectInputRef.current.value = val;
        }
        if (onFilter) {
          (onFilter as any)(column, FILTER_TYPES.SELECT)(val);
        }
    },
    cleanFiltered: () => {
        setIsSelected(false);
        if (selectInputRef.current) {
          selectInputRef.current.value = "";
        }
        if (onFilter) {
          (onFilter as any)(column, FILTER_TYPES.SELECT)("");
        }
    }
  }));

  React.useEffect(() => {
    // export onFilter function to allow users to access
    if (getFilter) {
      getFilter((filterVal: any) => {
        setIsSelected(filterVal !== "");
        if (selectInputRef.current) {
          selectInputRef.current.value = filterVal;
        }

        if (onFilter) {
          (onFilter as any)(column, FILTER_TYPES.SELECT)(filterVal);
        }
      });
    }

    const value = selectInputRef.current?.value;
    if (onFilter && value && value !== "") {
      (onFilter as any)(column, FILTER_TYPES.SELECT, true)(value);
    }
  }, []);

  const prevDefaultValue = React.useRef(defaultValue);
  const prevOptions = React.useRef(resolvedOptions);

  React.useEffect(() => {
    let needFilter = false;
    if (defaultValue !== prevDefaultValue.current) {
      if (selectInputRef.current) {
        selectInputRef.current.value = defaultValue;
      }
      needFilter = true;
    } else if (!optionsEquals(resolvedOptions, prevOptions.current)) {
      needFilter = true;
    }

    if (needFilter) {
      const value = selectInputRef.current?.value;
      if (onFilter && typeof value !== 'undefined') {
        (onFilter as any)(column, FILTER_TYPES.SELECT)(value);
      }
    }
    prevDefaultValue.current = defaultValue;
    prevOptions.current = resolvedOptions;
  }, [defaultValue, resolvedOptions, column, onFilter]);

  const filterHandler = React.useCallback(
    (e: any) => {
      const { value } = e.target;
      setIsSelected(value !== "");
      if (onFilter) {
        (onFilter as any)(column, FILTER_TYPES.SELECT)(value);
      }
    },
    [column, onFilter]
  );

  const renderOptions = () => {
    const optionTags = [];
    const isValSelected = defaultValue !== undefined && defaultValue !== "";
    if (!withoutEmptyOption && !isValSelected) {
      optionTags.push(
        <option key="-1" value="" data-testid="select-filter-placeholder">
          {placeholder || `Select ${column.text}...`}
        </option>
      );
    }
    if (Array.isArray(resolvedOptions)) {
      resolvedOptions.forEach(({ value, label }: any) =>
        optionTags.push(
          <option key={value} value={value}>
            {label}
          </option>
        )
      );
    } else {
      Object.keys(resolvedOptions).forEach((key) =>
        optionTags.push(
          <option key={key} value={key}>
            {resolvedOptions[key]}
          </option>
        )
      );
    }
    return optionTags;
  };

  const selectClass = `filter select-filter form-control ${className} ${
    isSelected ? "" : "placeholder-selected"
  }`;
  const elmId = id || `select-filter-column-${column.dataField}-${generatedId}`;

  return (
    <label className="filter-label" htmlFor={elmId}>
      <span className="sr-only visually-hidden">Filter by {column.text}</span>
      <select
        {...rest}
        ref={selectInputRef}
        id={elmId}
        style={style}
        className={selectClass}
        onChange={filterHandler}
        onClick={(e) => e.stopPropagation()}
        defaultValue={getDefaultValue() || ""}
        data-testid="select-filter"
      >
        {renderOptions()}
      </select>
    </label>
  );
});

SelectFilter.displayName = "SelectFilter";

export default SelectFilter;
