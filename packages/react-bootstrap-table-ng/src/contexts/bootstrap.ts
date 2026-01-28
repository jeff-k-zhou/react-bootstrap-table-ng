import React from "react";

interface BootstrapContextValue {
  bootstrap4: boolean;
}

const defaultBootstrapContext = { bootstrap4: true };

export const BootstrapContext = React.createContext<BootstrapContextValue>(
  defaultBootstrapContext
);
