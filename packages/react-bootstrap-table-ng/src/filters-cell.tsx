import React from "react";
import _ from "./utils";

interface FilterProps {
  props: Record<string, any>;
  Filter: React.ComponentType<any>;
}

interface FiltersCellProps {
  index: number;
  column: {
    filterRenderer?: (filterHandler: Function, column: any) => React.ReactNode;
    filter?: FilterProps;
    headerAlign?: string | Function;
    dataField: string;
    text?: string;
  };
  currFilters?: Record<string, any>;
  onFilter?: (filterData: Record<string, any>) => React.ReactNode;
  onExternalFilter?: (column: any, filterType: string) => (value: any) => Function;
  cellEl?: string;
}

const FiltersCell: React.FC<FiltersCellProps> = (props) => {
  const { index, column, currFilters, onExternalFilter = () => {}, onFilter = () => {}, cellEl = "th" } = props;
  const { filter, text } = column;

  let filterElm: React.ReactNode;
  const cellAttrs: React.HTMLAttributes<HTMLTableHeaderCellElement> = {};
  const cellStyle: React.CSSProperties = {};

  cellAttrs.style = cellStyle;

  if (column.headerAlign) {
    cellStyle.textAlign = _.isFunction(column.headerAlign)
      ? column.headerAlign(column, index)
      : column.headerAlign;
  }

  if (column.filterRenderer) {
    const onCustomFilter = onExternalFilter(column, filter?.props.type || "");
    filterElm = column.filterRenderer(onCustomFilter!, column);
  } else if (filter) {
    filterElm = (
      <filter.Filter
        {...filter.props}
        filterState={currFilters![column.dataField]}
        onFilter={onFilter}
        column={column}
      />
    );
  }

  // Ensure discernible text for <th> (WCAG 1.3.1 / 4.1.2)
  const discernibleText = (
    <span className="sr-only visually-hidden">
      {`Filter for ${text || column.dataField}`}
    </span>
  );

  return React.createElement(cellEl, cellAttrs, [discernibleText, filterElm]);
};

export default FiltersCell;
