/* eslint react/prop-types: 0 */
/* eslint react/require-default-props: 0 */
/* eslint camelcase: 0 */
/* eslint react/no-unused-prop-types: 0 */

import React from "react";
import {
  CLICK_TO_CELL_EDIT,
  CellEditProviderProps,
  CellEditProviderState,
  DBCLICK_TO_CELL_EDIT,
} from "..";

export const CellEditContext = React.createContext<any>(null);

export default (
  _: any,
  dataOperator?: any,
  isRemoteCellEdit?: any,
  handleCellChange?: any
) => {
  const CellEditProvider: React.FC<CellEditProviderProps> = (props) => {
    const [state, setState] = React.useState<CellEditProviderState>({
      ridx: null,
      cidx: null,
      message: null,
    });

    // Handle remote error messages (equivalent to getDerivedStateFromProps)
    React.useEffect(() => {
      if (
        props.cellEdit &&
        _.isFunction(isRemoteCellEdit) &&
        isRemoteCellEdit()
      ) {
        if (props.cellEdit.options.errorMessage) {
          setState((prev) => ({
            ...prev,
            message: props.cellEdit.options.errorMessage,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            message: null,
          }));
        }
      }
    }, [props.cellEdit, isRemoteCellEdit]);

    const completeEditing = React.useCallback(() => {
      setState({
        ridx: null,
        cidx: null,
        message: null,
      });
    }, []);

    const doUpdate = React.useCallback((row: any, column: any, newValue: any) => {
      const { keyField, cellEdit, data } = props;
      const { afterSaveCell } = cellEdit.options;
      const rowId = _.get(row, keyField);
      const oldValue = _.get(row, column.dataField);
      if (isRemoteCellEdit()) {
        handleCellChange(rowId, column.dataField, newValue);
      } else {
        dataOperator.editCell(
          data,
          keyField,
          rowId,
          column.dataField,
          newValue
        );
        if (_.isFunction(afterSaveCell)) {
          afterSaveCell(oldValue, newValue, row, column);
        }
        completeEditing();
      }
    }, [props, completeEditing, dataOperator]);

    const escapeEditing = React.useCallback(() => {
      setState((prev) => ({
        ...prev,
        ridx: null,
        cidx: null,
      }));
    }, []);

    const handleCellUpdate = React.useCallback((row: any, column: any, newValue: any) => {
      const newValueWithType = dataOperator.typeConvert(column.type, newValue);
      const { cellEdit } = props;
      const { beforeSaveCell } = cellEdit.options;
      const oldValue = _.get(row, column.dataField);
      const beforeSaveCellDone = (result = true) => {
        if (result) {
          doUpdate(row, column, newValueWithType);
        } else {
          escapeEditing();
        }
      };
      if (_.isFunction(beforeSaveCell)) {
        const result = beforeSaveCell(
          oldValue,
          newValueWithType,
          row,
          column,
          beforeSaveCellDone
        );
        if (_.isObject(result) && result.async) {
          return;
        }
      }
      doUpdate(row, column, newValueWithType);
    }, [props, dataOperator, doUpdate, escapeEditing]);

    const startEditing = React.useCallback((ridx: any, cidx: any) => {
      const editing = () => {
        setState((prev) => ({
          ...prev,
          ridx,
          cidx,
        }));
      };

      const { selectRow } = props;
      if (!selectRow || selectRow.clickToEdit || !selectRow.clickToSelect) {
        editing();
      }
    }, [props]);

    const contextValue = React.useMemo(() => {
      const {
        cellEdit: {
          options: { nonEditableRows, errorMessage, ...optionsRest },
          // @ts-ignore
          ridx: propRidx,
          // @ts-ignore
          cidx: propCidx,
          ...cellEditRest
        },
      } = props;

      return {
        ...optionsRest,
        ...cellEditRest,
        ridx: state.ridx !== null ? state.ridx : (propRidx ?? null),
        cidx: state.cidx !== null ? state.cidx : (propCidx ?? null),
        message: state.message,
        nonEditableRows: _.isDefined(nonEditableRows) ? nonEditableRows() : [],
        atstart: startEditing,
        onEscape: escapeEditing,
        onUpdate: handleCellUpdate,
      };
    }, [props, state, startEditing, escapeEditing, handleCellUpdate]);

    return (
      <CellEditContext.Provider value={contextValue}>
        {props.children}
      </CellEditContext.Provider>
    );
  };
  return {
    Provider: CellEditProvider,
  };
};

export const Consumer = CellEditContext.Consumer;
