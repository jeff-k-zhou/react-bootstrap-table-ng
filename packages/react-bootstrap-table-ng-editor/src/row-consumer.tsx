/* eslint react/prop-types: 0 */
import React from "react";
import {
  CLICK_TO_CELL_EDIT,
  DBCLICK_TO_CELL_EDIT,
  DELAY_FOR_DBCLICK,
} from "..";
import { CellEditContext } from "./context";

const RowConsumer = ({ Component, selectRowEnabled, props, cellEdit }: any) => {
  const key = props.value;
  const editableRow = !(
    cellEdit.nonEditableRows.length > 0 &&
    cellEdit.nonEditableRows.indexOf(key) > -1
  );

  const attrs: { DELAY_FOR_DBCLICK?: number | string } = {};

  if (selectRowEnabled && cellEdit.mode === DBCLICK_TO_CELL_EDIT) {
    attrs.DELAY_FOR_DBCLICK = DELAY_FOR_DBCLICK;
  }

  return (
    <Component
      {...props}
      {...attrs}
      editingRowIdx={cellEdit.ridx}
      editingColIdx={cellEdit.cidx}
      isEditable={editableRow}
      atstart={cellEdit.atstart}
      clickToEdit={cellEdit.mode === CLICK_TO_CELL_EDIT}
      dbclickToEdit={cellEdit.mode === DBCLICK_TO_CELL_EDIT}
    />
  );
};

export default (Component: any, selectRowEnabled: any) => {
  const WithCellEditingRowConsumer = (props: any) => {
    const cellEdit = React.useContext(CellEditContext);
    return (
      <RowConsumer
        Component={Component}
        selectRowEnabled={selectRowEnabled}
        props={props}
        cellEdit={cellEdit}
      />
    );
  };

  WithCellEditingRowConsumer.displayName = "WithCellEditingRowConsumer";
  return WithCellEditingRowConsumer;
};
