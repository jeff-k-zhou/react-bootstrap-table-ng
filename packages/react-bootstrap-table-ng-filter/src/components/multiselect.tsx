/* eslint react/require-default-props: 0 */
/* eslint no-return-assign: 0 */
/* eslint no-param-reassign: 0 */
/* eslint react/no-unused-prop-types: 0 */
import React, { forwardRef, useId, useImperativeHandle } from "react";
import {
  EQ,
  FILTER_TYPES,
  MultiSelectFilterOptions,
  MultiSelectFilterProps,
} from "../..";

function optionsEquals(currOpts: any, prevOpts: any) {
  const keys = Object.keys(currOpts);
  for (let i = 0; i < keys.length; i += 1) {
    if (currOpts[keys[i]] !== prevOpts[keys[i]]) {
      return false;
    }
  }
  return Object.keys(currOpts).length === Object.keys(prevOpts).length;
}

const getSelections = (container: any) => {
  if (container && container.selectedOptions) {
    return Array.from(container.selectedOptions).map((item: any) => item.value);
  }
  if (container && Array.isArray(container.value)) {
    return container.value;
  }
  const selections = [];
  const totalLen = container && container.options ? container.options.length : 0;
  for (let i = 0; i < totalLen; i += 1) {
    const option = container.options[i];
    if (option && option.selected) selections.push(option.value);
  }
  return selections;
};

const MultiSelectFilter = forwardRef<any, MultiSelectFilterProps>((props, ref) => {
  const {
    id = null,
    style,
    className = "",
    filterState = {},
    defaultValue = [],
    onFilter,
    column,
    options,
    comparator = EQ,
    withoutEmptyOption = false,
    caseSensitive = true,
    getFilter,
    placeholder,
    ...rest
  } = props;

  const generatedId = useId();

  const getDefaultValue = React.useCallback(() => {
    if (filterState && typeof filterState.filterVal !== "undefined") {
      return filterState.filterVal;
    }
    return defaultValue;
  }, [filterState, defaultValue]);

  const [isSelected, setIsSelected] = React.useState(() => {
    return (
      (defaultValue ?? []).map(
        (item: string) => (options as MultiSelectFilterOptions)[item]
      ).length > 0
    );
  });

  const [selectedOptions, setSelectedOptions] = React.useState(getDefaultValue);

  const selectRef = React.useRef<HTMLSelectElement>(null);

  const applyFilterInternal = React.useCallback(
    (value: any) => {
      let filterValue = value;
      if (filterValue.length === 1 && filterValue[0] === "") {
        filterValue = [];
      }
      setIsSelected(filterValue.length > 0);
      // TODO
      // @ts-ignore
      onFilter(column, FILTER_TYPES.MULTISELECT)(filterValue);
    },
    [column, onFilter]
  );

  useImperativeHandle(ref, () => ({
    applyFilter: (val: any) => {
        setIsSelected(val && val.length > 0);
        setSelectedOptions(val || []);
        applyFilterInternal(val || []);
    },
    cleanFiltered: () => {
        setIsSelected(false);
        setSelectedOptions([]);
        applyFilterInternal([]);
    }
  }));

  React.useEffect(() => {
    // export onFilter function to allow users to access
    if (getFilter) {
      getFilter((filterVal: any) => {
        if (selectRef.current) {
          selectRef.current.value = filterVal;
        }
        applyFilterInternal(filterVal);
        setSelectedOptions(filterVal);
      });
    }

    const value = getSelections(selectRef.current);
    if (value && value.length > 0 && !(value.length === 1 && value[0] === "")) {
      applyFilterInternal(value);
    }
  }, []);

  const prevDefaultValue = React.useRef(defaultValue);
  const prevOptions = React.useRef(options);

  React.useEffect(() => {
    let needFilter = false;
    if (JSON.stringify(defaultValue) !== JSON.stringify(prevDefaultValue.current)) {
      needFilter = true;
    } else if (!optionsEquals(options, prevOptions.current)) {
      needFilter = true;
    }
    if (needFilter) {
      applyFilterInternal(getSelections(selectRef.current));
    }
    prevDefaultValue.current = defaultValue;
    prevOptions.current = options;
  }, [defaultValue, options, applyFilterInternal]);

  const filterHandler = React.useCallback(
    (e: any) => {
      const value = getSelections(e.target);
      setSelectedOptions(value);
      applyFilterInternal(value);
    },
    [applyFilterInternal]
  );

  const getOptionsTags = () => {
    const optionTags = [];
    const isValSelected = defaultValue && defaultValue.length > 0;
    if (!withoutEmptyOption && !isValSelected) {
      optionTags.push(
        <option key="-1" value="" data-testid="multiselect-placeholder">
          {placeholder || `Select ${column.text}...`}
        </option>
      );
    }
    Object.keys(options).forEach((key) =>
      optionTags.push(
        <option key={key} value={key}>
          {(options as MultiSelectFilterOptions)[key]}
        </option>
      )
    );
    return optionTags;
  };

  const selectClass = `filter select-filter form-control ${className} ${
    isSelected ? "" : "placeholder-selected"
  }`;
  const elmId = id || `multiselect-filter-column-${column.dataField}-${generatedId}`;

  return (
    <label className="filter-label" htmlFor={elmId}>
      <span className="sr-only visually-hidden">Filter by {column.text}</span>
      <select
        {...rest}
        ref={selectRef}
        id={elmId}
        multiple
        style={style}
        className={selectClass}
        onChange={filterHandler}
        onClick={(e) => e.stopPropagation()}
        value={selectedOptions}
        data-testid="multiselect-filter"
      >
        {getOptionsTags()}
      </select>
    </label>
  );
});

MultiSelectFilter.displayName = "MultiSelectFilter";

export default MultiSelectFilter;
