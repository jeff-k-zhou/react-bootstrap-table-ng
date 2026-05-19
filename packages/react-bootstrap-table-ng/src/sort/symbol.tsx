import React, { FC } from "react";
import { BootstrapContext } from "../contexts/bootstrap";

const SortSymbol: FC = () => (
  <BootstrapContext.Consumer>
    {({ bootstrap4, bootstrap5 }) => {
      if (bootstrap4 || bootstrap5) {
        return <span className={`order-${bootstrap5 ? "5" : "4"}`} aria-hidden="true" />;
      }
      return (
        <span className="order" aria-hidden="true">
          <span className="dropdown" aria-hidden="true">
            <span className="caret" aria-hidden="true" />
          </span>
          <span className="dropup" aria-hidden="true">
            <span className="caret" aria-hidden="true" />
          </span>
        </span>
      );
    }}
  </BootstrapContext.Consumer>
);

export default SortSymbol;
