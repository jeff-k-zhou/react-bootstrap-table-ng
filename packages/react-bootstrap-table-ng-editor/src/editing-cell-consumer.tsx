import React from "react";
import _ from "react-bootstrap-table-ng/src/utils";
import { CellEditContext } from "./context";
import createEditingCell from "./editing-cell";

const EditingCellConsumer = ({ cellEdit, EditingCell, ...props }: any) => {
  const content = _.get(props.row, props.column.dataField);
  let editCellstyle = props.column.editCellStyle || {};
  let editCellclasses = props.column.editCellClasses;
  if (_.isFunction(props.column.editCellStyle)) {
    editCellstyle = props.column.editCellStyle(
      content,
      props.row,
      props.rowIndex,
      props.columnIndex
    );
  }
  if (_.isFunction(props.column.editCellClasses)) {
    editCellclasses = props.column.editCellClasses(
      content,
      props.row,
      props.rowIndex,
      props.columnIndex
    );
  }

  return (
    <EditingCell
      {...props}
      className={editCellclasses}
      style={editCellstyle}
      {...cellEdit}
    />
  );
};

export default (_: any, onStartEdit?: any) => {
  const EditingCell = createEditingCell(_, onStartEdit);

  return (props: any) => {
    const cellEdit = React.useContext(CellEditContext);
    return <EditingCellConsumer {...props} cellEdit={cellEdit} EditingCell={EditingCell} />;
  };
};
