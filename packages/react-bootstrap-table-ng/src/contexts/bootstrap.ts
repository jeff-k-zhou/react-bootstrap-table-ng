import React from "react";

interface BootstrapContextValue {
  bootstrap4?: boolean;
  bootstrap5?: boolean;
}

const defaultBootstrapContext = { bootstrap4: false, bootstrap5: false };

export const BootstrapContext = React.createContext<BootstrapContextValue>(
  defaultBootstrapContext
);
