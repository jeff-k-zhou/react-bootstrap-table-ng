/* eslint react/require-default-props: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint no-return-assign: 0 */
/* eslint prefer-template: 0 */
import React, { forwardRef, useImperativeHandle } from "react";

import { DateFilterProps, FILTER_TYPES } from "../..";

const EQ = "=";
const NE = "!=";
const GT = ">";
const GE = ">=";
const LT = "<";
const LE = "<=";

const legalComparators = [EQ, NE, GT, GE, LT, LE];

function dateParser(d: any) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return `${date.getUTCFullYear()}-${("0" + (date.getUTCMonth() + 1)).slice(-2)}-${(
    "0" + date.getUTCDate()
  ).slice(-2)}`;
}

const DateFilter = forwardRef<any, DateFilterProps>((props, ref) => {
  const {
    id = null,
    placeholder,
    column,
    style,
    comparatorStyle,
    dateStyle,
    className = "",
    comparatorClassName = "",
    dateClassName = "",
    onFilter,
    getFilter,
    defaultValue = { date: undefined, comparator: "" },
    filterState = {},
    delay = 0,
    comparators: propComparators,
    withoutEmptyComparatorOption = false,
  } = props;

  const { dataField, text } = column;
  const comparators = React.useMemo(
    () => propComparators || legalComparators,
    [propComparators]
  );

  const dateFilterComparatorRef = React.useRef<HTMLSelectElement>(null);
  const inputDateRef = React.useRef<HTMLInputElement>(null);
  const timeoutRef = React.useRef<any>(null);

  const getDefaultComparator = React.useCallback(() => {
    if (filterState && filterState.filterVal) {
      return filterState.filterVal.comparator;
    }
    if (defaultValue && defaultValue.comparator) {
      return defaultValue.comparator;
    }
    return "";
  }, [filterState, defaultValue]);

  const getDefaultDate = React.useCallback(() => {
    if (filterState && filterState.filterVal && filterState.filterVal.date) {
      return dateParser(filterState.filterVal.date);
    }
    if (defaultValue && defaultValue.date) {
      return dateParser(defaultValue.date);
    }
    return "";
  }, [filterState, defaultValue]);

  const applyFilterInternal = React.useCallback(
    (value: any, comparator: any, isInitial?: any) => {
      const execute = () => {
        const date = value === "" ? null : new Date(value);
        // TODO
        // @ts-ignore
        onFilter(column, FILTER_TYPES.DATE, isInitial)({ date, comparator });
      };

      if (delay) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(execute, delay);
      } else {
        execute();
      }
    },
    [column, onFilter, delay]
  );

  useImperativeHandle(ref, () => ({
    applyFilter: (val: any) => {
        if (dateFilterComparatorRef.current) {
          dateFilterComparatorRef.current.value = val.comparator || "";
        }
        if (inputDateRef.current) {
          inputDateRef.current.value = val.date ? dateParser(val.date) : "";
        }
        applyFilterInternal(val.date, val.comparator);
    },
    cleanFiltered: () => {
        if (dateFilterComparatorRef.current) {
          dateFilterComparatorRef.current.value = "";
        }
        if (inputDateRef.current) {
          inputDateRef.current.value = "";
        }
        applyFilterInternal(null, "");
    }
  }));

  React.useEffect(() => {
    const comparator = dateFilterComparatorRef.current?.value;
    const date = inputDateRef.current?.value;
    if (comparator && date) {
      applyFilterInternal(date, comparator, true);
    }

    if (getFilter) {
      getFilter((filterVal: any) => {
        const nullableFilterVal = filterVal || { date: null, comparator: null };
        if (dateFilterComparatorRef.current) {
          dateFilterComparatorRef.current.value = nullableFilterVal.comparator;
        }
        if (inputDateRef.current) {
          inputDateRef.current.value = nullableFilterVal.date
            ? dateParser(nullableFilterVal.date)
            : "";
        }

        applyFilterInternal(nullableFilterVal.date, nullableFilterVal.comparator);
      });
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onChangeDate = (e: any) => {
    const comparator = dateFilterComparatorRef.current?.value;
    const filterValue = e.target.value;
    applyFilterInternal(filterValue, comparator);
  };

  const onChangeComparator = (e: any) => {
    const value = inputDateRef.current?.value;
    const comparator = e.target.value;
    applyFilterInternal(value, comparator);
  };

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

  const comparatorElmId = `date-filter-comparator-${dataField}${
    id ? `-${id}` : ""
  }`;
  const inputElmId = `date-filter-column-${dataField}${id ? `-${id}` : ""}`;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`filter date-filter ${className}`}
      style={style as any}
      data-testid="date-filter"
    >
      <label className="filter-label" htmlFor={comparatorElmId}>
        <span className="sr-only visually-hidden">Filter comparator</span>
        <select
          ref={dateFilterComparatorRef}
          id={comparatorElmId}
          style={comparatorStyle as any}
          className={`date-filter-comparator form-control ${comparatorClassName}`}
          onChange={onChangeComparator}
          defaultValue={getDefaultComparator()}
          data-testid="date-filter-comparator"
        >
          {getComparatorOptions()}
        </select>
      </label>
      <label htmlFor={inputElmId}>
        <span className="sr-only visually-hidden">Enter ${text}</span>
        <input
          ref={inputDateRef}
          id={inputElmId}
          className={`filter date-filter-input form-control ${dateClassName}`}
          style={dateStyle as any}
          type="date"
          onChange={onChangeDate}
          placeholder={placeholder || `Enter ${text}...`}
          defaultValue={getDefaultDate()}
          data-testid="date-filter-input"
        />
      </label>
    </div>
  );
});

DateFilter.displayName = "DateFilter";

export default DateFilter;
