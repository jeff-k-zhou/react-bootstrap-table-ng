/* eslint react/prop-types: 0 */
/* eslint react/require-default-props: 0 */
/* eslint no-lonely-if: 0 */
/* eslint camelcase: 0 */
import EventEmitter from "events";
import React from "react";
import Const from "./const";

import { PaginationProviderProps } from "..";
import { alignPage } from "./page";

import { usePaginationState } from "./hooks/usePaginationState";

const StateContext = React.createContext<any>(null);
export { StateContext };

const StateProvider: React.FC<PaginationProviderProps> = (props) => {
  const { pagination, children } = props;
  const {
    dataChangeListener,
    remoteEmitterRef,
    getPaginationProps,
  } = usePaginationState(props);

  const paginationProps = getPaginationProps();
  const paginationValue = React.useMemo(() => ({
    ...pagination,
    options: paginationProps,
  }), [pagination, paginationProps]);

  return (
    <StateContext.Provider
      value={{
        paginationProps,
        paginationTableProps: {
          pagination: paginationValue,
          setPaginationRemoteEmitter: (emitter: any) => {
            remoteEmitterRef.current = emitter;
          },
          dataChangeListener,
        },
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default () => ({
  Provider: StateProvider,
  Consumer: StateContext.Consumer,
});
