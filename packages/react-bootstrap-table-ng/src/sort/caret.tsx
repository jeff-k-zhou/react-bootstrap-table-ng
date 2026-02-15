import cs from "classnames";
import React from "react";
import { SORT_ASC } from "../const";
import { BootstrapContext } from "../contexts/bootstrap";

interface SortCaretProps {
  order: string;
}

const SortCaret: React.FC<SortCaretProps> = ({ order }) => {
  const orderClass = cs("react-bootstrap-table-sort-order", {
    dropup: order === SORT_ASC,
  });

  return (
    <BootstrapContext.Consumer>
      {({ bootstrap4, bootstrap5 }) => {
        if (bootstrap4 || bootstrap5) {
          return (
            <span
              className={`caret-${bootstrap5 ? "5" : "4"}-${order}`}
              data-testid="sort-caret"
            />
          );
        }
        return (
          <span className={orderClass} data-testid="sort-caret">
            <span className="caret" />
          </span>
        );
      }}
    </BootstrapContext.Consumer>
  );
};

export default SortCaret;
