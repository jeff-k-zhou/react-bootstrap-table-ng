import React, { useCallback, useRef } from "react";
import _ from "./utils";

const events: string[] = [
  "onClick",
  "onDoubleClick",
  "onMouseEnter",
  "onMouseLeave",
  "onContextMenu",
  "onAuxClick",
];

export interface CellEventDelegaterProps {
  column: any;
  columnIndex?: number;
  index: number;
}

export const useCellEventDelegater = (props: CellEventDelegaterProps) => {
  const propsRef = useRef(props);
  propsRef.current = props;

  const createDefaultEventHandler = useCallback(
    (cb: (e: any, column: any, columnIndex: number) => void) => {
      return (e: any) => {
        const { column, columnIndex, index } = propsRef.current;
        cb(e, column, typeof columnIndex !== "undefined" ? columnIndex : index);
      };
    },
    []
  );

  const delegate = useCallback(
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

  return delegate;
};

// Legacy HOC modernized as a functional wrapper
export const CellEventDelegater = <P extends object>(
  BaseComponent: React.ComponentType<P & { delegate: ReturnType<typeof useCellEventDelegater> }>
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const delegate = useCellEventDelegater(props as any);
    return React.createElement(BaseComponent as any, {
      ...(props as any),
      ref,
      delegate,
    });
  });

  WrappedComponent.displayName = `CellEventDelegater(${
    BaseComponent.displayName || BaseComponent.name || "Component"
  })`;

  return WrappedComponent;
};
