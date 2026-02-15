import React, { FC } from "react";
import { BootstrapContext } from "../contexts/bootstrap";

const SortSymbol: FC = () => (
  <BootstrapContext.Consumer>
    {({ bootstrap4, bootstrap5 }) => {
      if (bootstrap4 || bootstrap5) {
        return <span className={`order-${bootstrap5 ? "5" : "4"}`} />;
      }
      return (
        <span className="order">
          <span className="dropdown">
            <span className="caret" />
          </span>
          <span className="dropup">
            <span className="caret" />
          </span>
        </span>
      );
    }}
  </BootstrapContext.Consumer>
);

export default SortSymbol;
