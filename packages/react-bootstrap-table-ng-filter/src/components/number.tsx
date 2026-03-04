/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint react/require-default-props: 0 */
/* eslint no-return-assign: 0 */
import React, { forwardRef, useImperativeHandle } from "react";
import { FILTER_DELAY, FILTER_TYPES, NumberFilterProps } from "../..";

const EQ = "=";
const NE = "!=";
const GT = ">";
const GE = ">=";
const LT = "<";
const LE = "<=";

const legalComparators = [EQ, NE, GT, GE, LT, LE];

const NumberFilter = forwardRef<any, NumberFilterProps>((props, ref) => {
  const {
    id = null,
    column,
    options,
    style,
    className = "",
    numberStyle,
    numberClassName = "",
    comparatorStyle,
    comparatorClassName = "",
    placeholder,
    onFilter,
    getFilter,
    defaultValue = { number: "" as any, comparator: "" },
    filterState = {},
    delay = FILTER_DELAY,
    comparators: propComparators,
    withoutEmptyComparatorOption = false,
    withoutEmptyNumberOption = false,
    ...rest
  } = props;

  const comparators = React.useMemo(
    () => propComparators || legalComparators,
    [propComparators]
  );

  const getDefaultComparator = React.useCallback(() => {
    if (filterState && filterState.filterVal) {
      return filterState.filterVal.comparator;
    }
    if (defaultValue && defaultValue.comparator) {
      return defaultValue.comparator;
    }
    return "";
  }, [filterState, defaultValue]);

  const getDefaultValue = React.useCallback(() => {
    if (filterState && filterState.filterVal) {
      return filterState.filterVal.number;
    }
    if (defaultValue && defaultValue.number) {
      return defaultValue.number;
    }
    return "";
  }, [filterState, defaultValue]);

  const [isSelected, setIsSelected] = React.useState(() => {
    let selected =
      defaultValue !== undefined && defaultValue.number !== undefined && defaultValue.number !== "";
    if (options && selected) {
      selected = (options as number[]).indexOf(defaultValue.number as number) > -1;
    }
    return selected;
  });

  const numberFilterRef = React.useRef<any>(null);
  const comparatorFilterRef = React.useRef<any>(null);
  const timeoutRef = React.useRef<any>(null);

  useImperativeHandle(ref, () => ({
    applyFilter: (val: any) => {
        if (comparatorFilterRef.current) {
          comparatorFilterRef.current.value = val.comparator || "";
        }
        if (numberFilterRef.current) {
          numberFilterRef.current.value = val.number || "";
        }
        if (onFilter) {
          (onFilter as any)(column, FILTER_TYPES.NUMBER)(val);
        }
    }
  }));

  React.useEffect(() => {
    const comparator =
      comparatorFilterRef.current?.value === ""
        ? EQ
        : comparatorFilterRef.current?.value;
    const number = numberFilterRef.current?.value;
    if (onFilter && comparator && number) {
      (onFilter as any)(column, FILTER_TYPES.NUMBER, true)({ number, comparator });
    }

    // export onFilter function to allow users to access
    if (getFilter) {
      getFilter((filterVal: any) => {
        setIsSelected(filterVal !== "");
        if (comparatorFilterRef.current) {
          comparatorFilterRef.current.value = filterVal.comparator;
        }
        if (numberFilterRef.current) {
          numberFilterRef.current.value = filterVal.number;
        }

        const fn = filterVal.number;
        const fc = filterVal.comparator;
        if (onFilter) {
          (onFilter as any)(column, FILTER_TYPES.NUMBER)({ number: fn, comparator: fc });
        }
      });
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const onChangeNumber = React.useCallback(
    (e: any) => {
      const comparator = comparatorFilterRef.current?.value;
      if (comparator === "") {
        return;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      const v = e.target.value;
      timeoutRef.current = setTimeout(() => {
        if (onFilter) {
          (onFilter as any)(column, FILTER_TYPES.NUMBER)({ number: v, comparator });
        }
      }, delay);
    },
    [column, onFilter, delay]
  );

  const onChangeNumberSet = React.useCallback(
    (e: any) => {
      const comparator = comparatorFilterRef.current?.value;
      const { value } = e.target;
      setIsSelected(value !== "");
      if (onFilter) {
        (onFilter as any)(column, FILTER_TYPES.NUMBER)({ number: value, comparator });
      }
    },
    [column, onFilter]
  );

  const onChangeComparator = React.useCallback(
    (e: any) => {
      const value = numberFilterRef.current?.value;
      const comparator = e.target.value;
      if (onFilter) {
        (onFilter as any)(column, FILTER_TYPES.NUMBER)({ number: value, comparator });
      }
    },
    [column, onFilter]
  );

  const getComparatorOptions = () => {
    const optionTags = [];
    if (!withoutEmptyComparatorOption) {
      optionTags.push(<option key="-1" />);
    }
    for (let i = 0; i < comparators.length; i += 1) {
      optionTags.push(
        <option key={i} value={comparators[i]}>
          {comparators[i]}
        </option>
      );
    }
    return optionTags;
  };

  const getNumberOptions = () => {
    const optionTags = [];
    if (!withoutEmptyNumberOption) {
      optionTags.push(
        <option key="-1" value="">
          {placeholder || `Select ${column.text}...`}
        </option>
      );
    }
    const numberOptions = options as number[];
    for (let i = 0; i < numberOptions.length; i += 1) {
      optionTags.push(
        <option key={i} value={numberOptions[i]}>
          {numberOptions[i]}
        </option>
      );
    }
    return optionTags;
  };

  const selectClass = `
    select-filter
    number-filter-input
    form-control
    ${numberClassName}
    ${!isSelected ? "placeholder-selected" : ""}
  `;

  const comparatorElmId = `number-filter-comparator-${column.dataField}${
    id ? `-${id}` : ""
  }`;
  const inputElmId = `number-filter-column-${column.dataField}${
    id ? `-${id}` : ""
  }`;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`filter number-filter ${className}`}
      style={style as any}
      data-testid="number-filter"
    >
      <label className="filter-label" htmlFor={comparatorElmId}>
        <span className="sr-only visually-hidden">Filter comparator</span>
        <select
          ref={comparatorFilterRef}
          style={comparatorStyle as any}
          id={comparatorElmId}
          className={`number-filter-comparator form-control ${comparatorClassName}`}
          onChange={onChangeComparator}
          defaultValue={getDefaultComparator()}
          data-testid="number-filter-comparator"
        >
          {getComparatorOptions()}
        </select>
      </label>
      {options ? (
        <label className="filter-label" htmlFor={inputElmId}>
          <span className="sr-only visually-hidden">{`Select ${column.text}`}</span>
          <select
            ref={numberFilterRef}
            id={inputElmId}
            style={numberStyle as any}
            className={selectClass}
            onChange={onChangeNumberSet}
            defaultValue={getDefaultValue()}
            data-testid="number-filter-select"
          >
            {getNumberOptions()}
          </select>
        </label>
      ) : (
        <label htmlFor={inputElmId}>
          <span className="sr-only visually-hidden">{`Enter ${column.text}`}</span>
          <input
            ref={numberFilterRef}
            id={inputElmId}
            type="number"
            style={numberStyle as any}
            className={`number-filter-input form-control ${numberClassName}`}
            placeholder={placeholder || `Enter ${column.text}...`}
            onChange={onChangeNumber}
            defaultValue={getDefaultValue()}
            data-testid="number-filter-input"
          />
        </label>
      )}
    </div>
  );
});

NumberFilter.displayName = "NumberFilter";

export default NumberFilter;
