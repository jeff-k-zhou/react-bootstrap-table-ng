
import React, { Component } from "react";

import { FILTER_TYPES, TextFilterProps } from "../..";

interface TextFilterState {
  value: string;
}

class TextFilter extends Component<TextFilterProps, TextFilterState> {
  input: { value: any } | any;
  timeout: any;
  constructor(props: TextFilterProps) {
    super(props);
    this.filter = this.filter.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.timeout = null;
    this.input = {};
    function getDefaultValue() {
      if (
        props.filterState &&
        typeof props.filterState.filterVal !== "undefined"
      ) {
        return props.filterState.filterVal;
      }
      return props.defaultValue ?? "";
    }
    this.state = {
      value: getDefaultValue(),
    };
  }

  componentDidMount() {
    const { onFilter, getFilter, column } = this.props;
    const defaultValue = this.input.value;

    if (defaultValue) {
      // TODO
      // @ts-ignore
      onFilter(this.props.column, FILTER_TYPES.TEXT, true)(defaultValue);
    }

    // export onFilter function to allow users to access
    if (getFilter) {
      getFilter((filterVal: any) => {
        this.setState(() => ({ value: filterVal }));
        // TODO
        // @ts-ignore
        onFilter(column, FILTER_TYPES.TEXT)(filterVal);
      });
    }
  }

  componentWillUnmount() {
    this.cleanTimer();
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      const nextValue = this.props.defaultValue ?? "";
      this.setState({ value: nextValue }, () => {
        // TODO
        // @ts-ignore
        this.props.onFilter(this.props.column, FILTER_TYPES.TEXT)(nextValue);
      });
    }
  }

  filter(e: any) {
    e.stopPropagation();
    this.cleanTimer();
    const filterValue = e.target.value;
    this.setState(() => ({ value: filterValue }));
    this.timeout = setTimeout(() => {
      // TODO
      // @ts-ignore
      this.props.onFilter(this.props.column, FILTER_TYPES.TEXT)(filterValue);
    }, this.props.delay);
  }

  cleanTimer() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  cleanFiltered() {
    const value = this.props.defaultValue ?? "";
    this.setState(() => ({ value }));
    // TODO
    // @ts-ignore
    this.props.onFilter(this.props.column, FILTER_TYPES.TEXT)(value);
  }

  applyFilter(filterText: any) {
    const value = filterText ?? "";
    this.setState(() => ({ value }));
    // TODO
    // @ts-ignore
    this.props.onFilter(this.props.column, FILTER_TYPES.TEXT)(value);
  }

  handleClick(e: any) {
    e.stopPropagation();
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  render() {
    const {
      id = null,
      placeholder,
      column: { dataField, text },
      style,
      className,
      onFilter,
      caseSensitive = false,
      defaultValue = "",
      getFilter,
      filterState = {},
      ...rest
    } = this.props;

    const elmId = `text-filter-column-${dataField}${id ? `-${id}` : ""}`;

    return (
      <label className="filter-label" htmlFor={elmId}>
        <span className="sr-only">Filter by {text}</span>
        <input
          {...rest}
          ref={(n) => { this.input = n; }}
          type="text"
          id={elmId}
          className={`filter text-filter form-control ${className}`}
          style={style}
          onChange={this.filter}
          onClick={this.handleClick}
          placeholder={placeholder || `Enter ${text}...`}
          value={this.state.value}
          data-testid="text-filter"
        />
      </label>
    );
  }

  static defaultProps = {
    delay: 500,
    filterState: {},
    defaultValue: "",
    caseSensitive: false,
    id: null,
  };
}

export default TextFilter;
