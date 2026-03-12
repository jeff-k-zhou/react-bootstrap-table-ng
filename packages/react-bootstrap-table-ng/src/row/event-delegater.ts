import React from "react";
import { ROW_SELECT_DISABLED } from "../const";
import _ from "../utils";

const events: string[] = [
  "onClick",
  "onDoubleClick",
  "onMouseEnter",
  "onMouseLeave",
  "onContextMenu",
  "onAuxClick",
];

export interface RowEventDelegaterProps {
  row: any;
  selected?: boolean;
  keyField?: string;
  selectable?: boolean;
  expandable?: boolean;
  rowIndex: number;
  expanded?: boolean;
  expandRow?: any;
  selectRow?: any;
  DELAY_FOR_DBCLICK?: number;
}

export const useRowEventDelegater = (props: RowEventDelegaterProps) => {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const clickNum = React.useRef(0);

  const createClickEventHandler = React.useCallback(
    (cb: (e: any, row: any, rowIndex: number) => void) => {
      return (e: any) => {
        const {
          row,
          selected,
          keyField,
          selectable,
          expandable,
          rowIndex,
          expanded,
          expandRow,
          selectRow,
          DELAY_FOR_DBCLICK,
        } = propsRef.current;

        const clickFn = () => {
          if (cb) {
            cb(e, row, rowIndex);
          }

          const key = _.get(row, keyField!);

          if (expandRow && expandable && !expandRow.expandByColumnOnly) {
            if (
              (selectRow?.mode !== ROW_SELECT_DISABLED && selectRow?.clickToExpand) ||
              selectRow?.mode === ROW_SELECT_DISABLED
            ) {
              expandRow.onRowExpand(key, !expanded, rowIndex, e);
            }
          }

          if (selectRow?.clickToSelect && selectable) {
            selectRow.onRowSelect(key, !selected, rowIndex, e);
          }
        };

        if (DELAY_FOR_DBCLICK) {
          clickNum.current += 1;
          _.debounce(() => {
            if (clickNum.current === 1) {
              clickFn();
            }
            clickNum.current = 0;
          }, DELAY_FOR_DBCLICK)();
        } else {
          clickFn();
        }
      };
    },
    []
  );

  const createDefaultEventHandler = React.useCallback(
    (cb: (e: any, row: any, rowIndex: number) => void) => {
      return (e: any) => {
        const { row, rowIndex } = propsRef.current;
        cb(e, row, rowIndex);
      };
    },
    []
  );

  const delegate = React.useCallback(
    (attrs: Record<string, any> = {}) => {
      const newAttrs: Record<string, any> = { ...attrs };
      Object.keys(attrs).forEach((attr) => {
        if (_.includes(events, attr)) {
          newAttrs[attr] = createDefaultEventHandler(attrs[attr]);
        }
      });
      return newAttrs;
    },
    [createDefaultEventHandler]
  );

  return { delegate, createClickEventHandler };
};

// Legacy HOC modernized as a functional wrapper
export const RowEventDelegater = <P extends object>(
  BaseComponent: React.ComponentType<P & ReturnType<typeof useRowEventDelegater>>
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const delegater = useRowEventDelegater(props as any);
    return React.createElement(BaseComponent as any, {
      ...(props as any),
      ref,
      ...delegater,
    });
  });

  WrappedComponent.displayName = `RowEventDelegater(${
    BaseComponent.displayName || BaseComponent.name || "Component"
  })`;

  return WrappedComponent;
};
