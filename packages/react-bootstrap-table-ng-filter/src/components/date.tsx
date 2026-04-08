/* eslint react/require-default-props: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint no-return-assign: 0 */
/* eslint prefer-template: 0 */
import React, { forwardRef, useImperativeHandle } from "react";

import {
  EQ,
  NE,
  GT,
  GE,
  LT,
  LE,
  DateFilterProps,
  FILTER_TYPES,
} from "../const";

const legalComparators = [EQ, NE, GT, GE, LT, LE];

function dateParser(d: any) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return `${date.getUTCFullYear().toString().padStart(4, "0")}-${(
    "0" +
    (date.getUTCMonth() + 1)
  ).slice(-2)}-${("0" + date.getUTCDate()).slice(-2)}`;
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

  const [state, setState] = React.useState(() => {
    if (filterState && filterState.filterVal) {
      return {
        date: filterState.filterVal.date ? dateParser(filterState.filterVal.date) : "",
        comparator: filterState.filterVal.comparator ?? ""
      };
    }
    return {
      date: defaultValue?.date ? dateParser(defaultValue.date) : "",
      comparator: defaultValue?.comparator ?? ""
    };
  });

  const timeoutRef = React.useRef<any>(null);
  const inputRef = React.useRef<any>(null);

  const applyFilterInternal = React.useCallback(
    (dateVal: any, comparator: any, isInitial?: any) => {
      const execute = () => {
        let date = null;
        if (dateVal) {
          const [year, month, day] = dateVal.split("-").map(Number);
          date = new Date(0);
          date.setUTCFullYear(year, month - 1, day);
          date.setUTCHours(0, 0, 0, 0);
        }
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
      const dateStr = val.date ? dateParser(val.date) : "";
      setState({
        date: dateStr,
        comparator: val.comparator ?? ""
      });
      if (inputRef.current) inputRef.current.value = dateStr;
      applyFilterInternal(dateStr, val.comparator);
    },
    cleanFiltered: () => {
      setState({ date: "", comparator: "" });
      if (inputRef.current) inputRef.current.value = "";
      applyFilterInternal("", "");
    }
  }));

  const lastPropsVal = React.useRef(state);
  React.useEffect(() => {
    let nextVal = null;
    if (filterState && typeof filterState.filterVal !== "undefined") {
      nextVal = {
        date: filterState.filterVal.date ? dateParser(filterState.filterVal.date) : "",
        comparator: filterState.filterVal.comparator ?? ""
      };
    }

    if (nextVal && (nextVal.date !== lastPropsVal.current.date || nextVal.comparator !== lastPropsVal.current.comparator)) {
      lastPropsVal.current = nextVal;
      setState(nextVal);
      if (inputRef.current && inputRef.current.value !== nextVal.date) {
        inputRef.current.value = nextVal.date;
      }
    }
  }, [filterState]);

  React.useEffect(() => {
    const { date, comparator } = state;
    if (comparator && date) {
      applyFilterInternal(date, comparator, true);
    }

    if (getFilter) {
      getFilter((filterVal: any) => {
        const nullableFilterVal = filterVal || { date: null, comparator: null };
        const dateStr = nullableFilterVal.date ? dateParser(nullableFilterVal.date) : "";
        const next = {
          date: dateStr,
          comparator: nullableFilterVal.comparator ?? ""
        };
        setState(next);
        if (inputRef.current) inputRef.current.value = dateStr;
        applyFilterInternal(dateStr, next.comparator);
      });
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onChangeDate = (e: any) => {
    const { comparator } = state;
    const dateVal = e.target.value;
    setState(prev => ({ ...prev, date: dateVal }));
    applyFilterInternal(dateVal, comparator);
  };

  const onChangeComparator = (e: any) => {
    const { date } = state;
    const comparator = e.target.value;
    setState(prev => ({ ...prev, comparator }));
    applyFilterInternal(date, comparator);
  };

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
      <select
        id={comparatorElmId}
        style={comparatorStyle as any}
        className={`date-filter-comparator form-control ${comparatorClassName}`}
        onChange={onChangeComparator}
        value={state.comparator}
        data-testid="date-filter-comparator"
        aria-label="Filter comparator"
      >
        {getComparatorOptions()}
      </select>
      <input
        ref={inputRef}
        id={inputElmId}
        className={`filter date-filter-input form-control ${dateClassName}`}
        style={dateStyle as any}
        type="date"
        onChange={onChangeDate}
        placeholder={placeholder || `Enter ${text}...`}
        defaultValue={state.date}
        data-testid="date-filter-input"
        aria-label={`Enter ${text}`}
      />
    </div>
  );
});

DateFilter.displayName = "DateFilter";

export default DateFilter;
