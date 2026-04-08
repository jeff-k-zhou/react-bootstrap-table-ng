import React, { useContext } from "react";
import { StateContext } from "./state-context";

export default (WrappedComponent: any) => {
  const StandaloneAdapter = (props: any) => {
    const context = useContext(StateContext);
    const paginationProps = context ? context.paginationProps : {};

    const { page, sizePerPage, ...rest } = props;

    return (
      <WrappedComponent
        {...paginationProps}
        {...rest}
        currPage={page ?? paginationProps.page}
        currSizePerPage={sizePerPage ?? paginationProps.sizePerPage}
      />
    );
  };
  return StandaloneAdapter;
};
