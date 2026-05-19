import React from "react";
import _ from "../utils";

export interface RowProps {
  clickToEdit?: string;
  dbclickToEdit?: string;
  editable?: boolean;
  editingRowIdx?: number | null;
  editingColIdx?: number;
  EditingCellComponent?: any;
  tabIndexStart?: number;
  tabIndexCell?: boolean;
  rowIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  attrs?: Record<string, any>;
  columns?: any[];
  row?: Record<string, any>;
  selectRow?: any;
  selected?: boolean;
  selectable?: boolean;
  expandRow?: any;
  expanded?: boolean;
  expandable?: boolean;
  cellExpandable?: boolean;
  visibleColumnSize?: number;
  keyField?: string;
  value?: any;
  id?: string;
  expansionRowId?: string;
}

export default function RowShouldUpdater<P extends RowProps>(
  BaseComponent: React.ComponentType<P>
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    return React.createElement(BaseComponent as any, {
      ...props,
      ref,
    });
  });

  WrappedComponent.displayName = `RowShouldUpdater(${
    BaseComponent.displayName || BaseComponent.name || "Component"
  })`;

  return WrappedComponent;
}

export const shouldUpdateByCellEditing = (prevProps: RowProps, nextProps: RowProps) => {
  if (!(prevProps.clickToEdit || prevProps.dbclickToEdit)) return false;
  return (
    nextProps.editingRowIdx === nextProps.rowIndex ||
    (prevProps.editingRowIdx === nextProps.rowIndex &&
      nextProps.editingRowIdx === null) ||
    prevProps.editingRowIdx === nextProps.rowIndex
  );
};

export const shouldUpdatedBySelfProps = (prevProps: RowProps, nextProps: RowProps) => {
  return (
    prevProps.className !== nextProps.className ||
    !_.isEqual(prevProps.style, nextProps.style) ||
    !_.isEqual(prevProps.attrs, nextProps.attrs)
  );
};

export const shouldUpdateByColumnsForSimpleCheck = (prevProps: RowProps, nextProps: RowProps) => {
  if (prevProps.columns!.length !== nextProps.columns!.length) {
    return true;
  }
  for (let i = 0; i < prevProps.columns!.length; i += 1) {
    if (!_.isEqual(prevProps.columns![i], nextProps.columns![i])) {
      return true;
    }
  }
  return false;
};

export const shouldUpdatedByNormalProps = (prevProps: RowProps, nextProps: RowProps) => {
  return (
    prevProps.rowIndex !== nextProps.rowIndex ||
    prevProps.editable !== nextProps.editable ||
    prevProps.expanded !== nextProps.expanded ||
    prevProps.expandable !== nextProps.expandable ||
    prevProps.cellExpandable !== nextProps.cellExpandable ||
    !_.isEqual(prevProps.row, nextProps.row) ||
    (prevProps.columns?.length !== nextProps.columns?.length)
  );
};

export const shouldUpdateChild = (prevProps: RowProps, nextProps: RowProps) => {
  return (
    shouldUpdateByCellEditing(prevProps, nextProps) ||
    shouldUpdatedByNormalProps(prevProps, nextProps) ||
    !_.isEqual(prevProps.expandRow, nextProps.expandRow) ||
    !_.isEqual(prevProps.selectRow, nextProps.selectRow)
  );
};

export const shouldRowContentUpdate = (prevProps: RowProps, nextProps: RowProps) => {
  return (
    shouldUpdateChild(prevProps, nextProps) ||
    shouldUpdateByColumnsForSimpleCheck(prevProps, nextProps)
  );
};
