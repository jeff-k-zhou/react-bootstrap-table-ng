import cs from "classnames";
import React, { useId, useEffect } from "react";

import { BootstrapTableProps, ColumnDescription } from "./types";

import { FILTERS_POSITION_INLINE, ROW_SELECT_DISABLED } from "./const";
import Body from "./body";
import Caption from "./caption";
import Filters from "./filters";
import Footer from "./footer";
import Header from "./header";
import _ from "./utils";
import { useTableLogic } from "./hooks/useTableLogic";

const DEFAULT_SELECT_ROW = {
  mode: ROW_SELECT_DISABLED,
  selected: [],
  hideSelectColumn: true,
};

const DEFAULT_EXPAND_ROW = {
  renderer: undefined,
  expanded: [],
  nonExpandable: [],
};

const DEFAULT_CELL_EDIT = {
  mode: null,
  nonEditableRows: [],
};

const BootstrapTable = React.forwardRef<any, BootstrapTableProps>((props, ref) => {
  const generatedId = useId();
  const {
    loading,
    overlay,
    columns,
    keyField,
    tabIndexCell,
    id,
    classes,
    tableAriaLabel,
    bootstrap4 = false,
    bootstrap5 = false,
    striped = false,
    hover = false,
    bordered = true,
    condensed = false,
    noDataIndication = null,
    caption,
    rowStyle,
    rowClasses,
    wrapperClasses,
    rowEvents,
    selectRow = DEFAULT_SELECT_ROW,
    expandRow = DEFAULT_EXPAND_ROW,
    cellEdit = DEFAULT_CELL_EDIT,
    filterPosition = FILTERS_POSITION_INLINE,
    onDataSizeChange,
    pagination,
    data,
    headerClasses,
    headerWrapperClasses,
    sortField,
    sortOrder,
    onSort,
    sort,
    onFilter,
    currFilters,
    onExternalFilter,
    columnResize,
    bodyClasses,
    footerClasses,
    cellExpandable = true,
    rowIdPrefix,
  } = props;

  const { validateProps, isEmpty, visibleRows, getVisibleColumnSize } =
    useTableLogic(props);

  React.useImperativeHandle(ref, () => ({
    getData: () => data,
    props: { data },
  }));

  useEffect(() => {
    validateProps();
  }, [validateProps]);

  useEffect(() => {
    if (onDataSizeChange && !pagination) {
      onDataSizeChange({ dataSize: data.length });
    }
  }, [data.length, onDataSizeChange, pagination]);

  const renderTable = () => {
    const tableWrapperClass = cs("react-bootstrap-table", wrapperClasses);

    const tableClass = cs(
      "table",
      {
        "table-striped": striped,
        "table-hover": hover,
        "table-bordered": bordered,
        [bootstrap4 || bootstrap5 ? "table-sm" : "table-condensed"]: condensed,
      },
      classes
    );

    const hasFilters = columns.some(
      (col: ColumnDescription) => col.filter || col.filterRenderer
    );

    const hasFooter =
      _.filter(columns, (col: ColumnDescription) => _.has(col, "footer")).length > 0;

    const tableCaption = caption && (
      <Caption bootstrap4={bootstrap4} bootstrap5={bootstrap5}>
        {caption}
      </Caption>
    );

    const tableId = id || generatedId;

    const tableStatus = (
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          border: 0,
        }}
      >
        {sortField ? `Sorted by ${columns.find((c: any) => c.dataField === sortField)?.text || sortField} ${sortOrder === "asc" ? "ascending" : "descending"}. ` : ""}
        {`${visibleRows.length} rows found.`}
      </div>
    );

    return (
      <div className={tableWrapperClass}>
        {tableStatus}
        <table
          id={tableId}
          className={tableClass}
          aria-label={tableAriaLabel || (typeof caption === "string" ? caption : undefined)}
        >
          {tableCaption}
          <Header
            columns={columns}
            className={headerClasses}
            wrapperClasses={headerWrapperClasses}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={onSort}
            globalSortCaret={sort && sort.sortCaret}
            onFilter={onFilter}
            currFilters={currFilters}
            onExternalFilter={onExternalFilter}
            selectRow={selectRow}
            expandRow={expandRow}
            filterPosition={filterPosition}
            columnResize={columnResize}
          />
          {hasFilters && filterPosition !== FILTERS_POSITION_INLINE && (
            <Filters
              columns={columns}
              className={props.filtersClasses}
              onSort={onSort}
              onFilter={onFilter}
              currFilters={currFilters}
              filterPosition={filterPosition}
              onExternalFilter={onExternalFilter}
              selectRow={selectRow}
              expandRow={expandRow}
            />
          )}
          <Body
            className={bodyClasses}
            data={visibleRows}
            cellExpandable={cellExpandable}
            keyField={keyField}
            tabIndexCell={tabIndexCell}
            columns={columns}
            isEmpty={isEmpty}
            visibleColumnSize={getVisibleColumnSize()}
            noDataIndication={noDataIndication ?? undefined}
            cellEdit={cellEdit}
            selectRow={selectRow}
            expandRow={expandRow}
            rowStyle={rowStyle}
            rowClasses={rowClasses}
            rowEvents={rowEvents}
            tableId={tableId}
            rowIdPrefix={rowIdPrefix}
          />
          {hasFooter && (
            <Footer
              data={visibleRows}
              columns={columns}
              selectRow={selectRow}
              expandRow={expandRow}
              className={footerClasses}
            />
          )}
        </table>
      </div>
    );
  };

  // Memoize the overlay component class (stable identity across re-renders).
  // overlay is a curried factory: overlay(loading) => ReactComponent.
  // We call it with `false` just to get the component class, then control
  // active state via the `active` prop so the component is never remounted.
  const OverlayComponent = React.useMemo(() => {
    if (overlay) {
      return overlay(false);
    }
    return null;
  }, [overlay]);

  if (OverlayComponent) {
    return <OverlayComponent active={loading}>{renderTable()}</OverlayComponent>;
  }

  return renderTable();
});

export default BootstrapTable;
