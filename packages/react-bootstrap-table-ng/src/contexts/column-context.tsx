import React, { ReactNode } from "react";

interface ColumnProviderProps {
  data: any;
  columns: any[];
  toggles?: { [dataField: string]: boolean };
  onColumnResize?: (dataField: string, width: number) => void;
  children: ReactNode;
}

interface ColumnContextValue {
  columns: any[];
  toggles?: { [dataField: string]: boolean };
  onColumnResize?: (dataField: string, width: number) => void;
}

const defaultColumnContext = { columns: [], toggles: undefined };
const ColumnContext =
  React.createContext<ColumnContextValue>(defaultColumnContext);

const ColumnProvider: React.FC<ColumnProviderProps> = ({
  columns,
  toggles,
  onColumnResize,
  children,
}) => {
  let toggleColumns;

  if (toggles) {
    toggleColumns = columns.filter((column) => toggles[column.dataField]);
  } else {
    toggleColumns = columns.filter((column) => !column.hidden);
  }
  return (
    <ColumnContext.Provider value={{ columns: toggleColumns, onColumnResize }}>
      {children}
    </ColumnContext.Provider>
  );
};

export default () => ({
  Provider: ColumnProvider,
  Consumer: ColumnContext.Consumer,
});
