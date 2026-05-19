/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint react/require-default-props: 0 */
/* eslint no-return-assign: 0 */
import React, { forwardRef, useImperativeHandle } from "react";
import {
  EQ,
  NE,
  GT,
  GE,
  LT,
  LE,
  FILTER_DELAY,
  FILTER_TYPES,
  NumberFilterProps,
} from "../const";

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

  const getComparatorOptions = () => {
    const optionTags = [];
    if (!withoutEmptyComparatorOption) {
      optionTags.push(<option key="-1" value="" />);
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

  const [state, setState] = React.useState(() => {
    if (filterState && filterState.filterVal) {
      return {
        number: filterState.filterVal.number ?? "",
        comparator: filterState.filterVal.comparator ?? ""
      };
    }
    return {
      number: defaultValue?.number ?? "",
      comparator: defaultValue?.comparator ?? ""
    };
  });

  const [isSelected, setIsSelected] = React.useState(() => {
    const num = state.number;
    let selected = num !== undefined && num !== null && num !== "";
    if (options && selected) {
      selected = (options as number[]).indexOf(num as number) > -1;
    }
    return selected;
  });

  const timeoutRef = React.useRef<any>(null);

  useImperativeHandle(ref, () => ({
    applyFilter: (val: any) => {
      setState({
        number: val.number ?? "",
        comparator: val.comparator ?? ""
      });
      if (onFilter) {
        (onFilter as any)(column, FILTER_TYPES.NUMBER)(val);
      }
    }
  }));

  // Sync with external updates (e.g. filter clearing, remote updates)
  const lastPropsVal = React.useRef(state);
  React.useEffect(() => {
    let nextVal = null;
    if (filterState && typeof filterState.filterVal !== "undefined") {
      nextVal = {
        number: filterState.filterVal.number ?? "",
        comparator: filterState.filterVal.comparator ?? ""
      };
    } else if (defaultValue) {
      // Fallback to defaultValue ONLY if filterState is explicitly cleared/missing
      // but we shouldn't really do this if it was cleared by user.
      // However, usually FilterContext removes the key.
    }

    if (nextVal && (nextVal.number !== lastPropsVal.current.number || nextVal.comparator !== lastPropsVal.current.comparator)) {
      lastPropsVal.current = nextVal;
      setState(nextVal);
      setIsSelected(nextVal.number !== "");
    }
  }, [filterState]);

  React.useEffect(() => {
    const { number, comparator } = state;
    if (onFilter && comparator && number) {
      const val = number === "" ? "" : String(number);
      (onFilter as any)(column, FILTER_TYPES.NUMBER, true)({ number: val, comparator });
    }

    if (getFilter) {
      getFilter((filterVal: any) => {
        const next = {
          number: filterVal.number ?? "",
          comparator: filterVal.comparator ?? ""
        };
        setState(next);
        setIsSelected(next.number !== "");
        if (onFilter) {
          (onFilter as any)(column, FILTER_TYPES.NUMBER)(next);
        }
      });
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const applyFiltering = React.useCallback((number: any, comparator: any) => {
    if (onFilter) {
      const val = number === "" ? "" : String(number);
      (onFilter as any)(column, FILTER_TYPES.NUMBER)({ number: val, comparator });
    }
  }, [column, onFilter]);

  const onChangeNumber = React.useCallback(
    (e: any) => {
      const v = e.target.value;
      const { comparator } = state;
      setState(prev => ({ ...prev, number: v }));
      
      if (comparator === "") return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        applyFiltering(v, comparator);
      }, delay);
    },
    [state.comparator, applyFiltering, delay]
  );

  const onChangeNumberSet = React.useCallback(
    (e: any) => {
      const { value } = e.target;
      const { comparator } = state;
      setIsSelected(value !== "");
      setState(prev => ({ ...prev, number: value }));
      applyFiltering(value, comparator);
    },
    [state.comparator, applyFiltering]
  );

  const onChangeComparator = React.useCallback(
    (e: any) => {
      const comparator = e.target.value;
      const { number } = state;
      setState(prev => ({ ...prev, comparator }));
      applyFiltering(number, comparator);
    },
    [state.number, applyFiltering]
  );

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
    <fieldset
      className={`filter number-filter ${className}`}
      style={style as any}
      data-testid="number-filter"
      onClick={(e) => e.stopPropagation()}
    >
      <legend className="sr-only visually-hidden">Filter by {column.text}</legend>
      {/* WCAG 3.3.2 — each sub-control has its own <label htmlFor> in addition to the group legend */}
      <label htmlFor={comparatorElmId} className="filter-label">
        <span className="sr-only visually-hidden">Comparison operator for {column.text}</span>
        <select
          style={comparatorStyle as any}
          id={comparatorElmId}
          className={`number-filter-comparator form-control ${comparatorClassName}`}
          onChange={onChangeComparator}
          value={state.comparator}
          data-testid="number-filter-comparator"
          aria-label={`Comparison operator for ${column.text} filter`}
        >
          {getComparatorOptions()}
        </select>
      </label>
      {options ? (
        <label htmlFor={inputElmId} className="filter-label">
          <span className="sr-only visually-hidden">Number value for {column.text}</span>
          <select
            id={inputElmId}
            style={numberStyle as any}
            className={selectClass}
            onChange={onChangeNumberSet}
            value={state.number}
            data-testid="number-filter-select"
            aria-label={`Select ${column.text}`}
          >
            {getNumberOptions()}
          </select>
        </label>
      ) : (
        <label htmlFor={inputElmId} className="filter-label">
          <span className="sr-only visually-hidden">Number value for {column.text}</span>
          <input
            id={inputElmId}
            type="number"
            style={numberStyle as any}
            className={`number-filter-input form-control ${numberClassName}`}
            placeholder={placeholder || `Enter ${column.text}...`}
            onChange={onChangeNumber}
            value={state.number}
            data-testid="number-filter-input"
            aria-label={`Enter ${column.text}`}
          />
        </label>
      )}
      <span aria-live="polite" className="sr-only visually-hidden">
        {state.number ? `Filter applied: ${state.comparator} ${state.number}` : "Filter cleared"}
      </span>
    </fieldset>
  );
});

NumberFilter.displayName = "NumberFilter";

export default NumberFilter;
