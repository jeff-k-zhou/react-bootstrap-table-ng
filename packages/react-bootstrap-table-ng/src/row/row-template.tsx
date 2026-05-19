import React from "react";

import { SelectRowProps } from "../types";
import { INDICATOR_POSITION_LEFT } from "../const";

export interface ExpandRow {
  showExpandColumn?: boolean;
  expandColumnPosition?: string;
  nonExpandable?: any[];
}

interface RowTemplateProps {
  renderContent: () => any;
  cellEl: string;
  selectRow?: SelectRowProps<any> | undefined;
  expandRow?: ExpandRow;
  [key: string]: any; // For any other props you might have
}

const RowTemplate: React.FC<RowTemplateProps> = (props) => {
  const { renderContent, selectRow, expandRow, cellEl, ...rest } = props;

  const isRenderFunctionColumnInLeft = (
    position: string = INDICATOR_POSITION_LEFT
  ): boolean => position === INDICATOR_POSITION_LEFT;

  const childrens = renderContent() || [];

  if (selectRow && selectRow.hideSelectColumn !== true) {
    if (isRenderFunctionColumnInLeft(selectRow.selectColumnPosition)) {
      childrens.unshift(React.createElement(cellEl, { key: "selection" }, React.createElement("span", { className: "sr-only visually-hidden" }, "Selection column")));
    } else {
      childrens.push(React.createElement(cellEl, { key: "selection" }, React.createElement("span", { className: "sr-only visually-hidden" }, "Selection column")));
    }
  }

  if (expandRow && expandRow.showExpandColumn) {
    if (isRenderFunctionColumnInLeft(expandRow.expandColumnPosition)) {
      childrens.unshift(React.createElement(cellEl, { key: "expansion" }, React.createElement("span", { className: "sr-only visually-hidden" }, "Expand row column")));
    } else {
      childrens.push(React.createElement(cellEl, { key: "expansion" }, React.createElement("span", { className: "sr-only visually-hidden" }, "Expand row column")));
    }
  }

  return <tr {...rest}>{childrens}</tr>;
};

export default RowTemplate;
