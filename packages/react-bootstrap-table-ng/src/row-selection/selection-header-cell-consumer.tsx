import React from "react";
import {
  createSelectionContext,
  SelectionContextValue,
} from "../contexts/selection-context";

interface Props extends SelectionContextValue { }

const SelectionContext = createSelectionContext();

const withSelectionContext =
  (Component: React.ComponentType<Props>) => (props: any) => (
    <SelectionContext.Consumer>
      {(selectRow) => <Component {...props} {...selectRow} />}
    </SelectionContext.Consumer>
  );

export default withSelectionContext;
