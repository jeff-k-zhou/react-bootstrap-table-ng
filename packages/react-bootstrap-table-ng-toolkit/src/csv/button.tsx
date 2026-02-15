import React from "react";

import { ExportCSVButtonProps } from "../..";

const exportCSVButtonDefaultProps = {
  className: "",
  style: {},
};

const ExportCSVButton = (
  props: ExportCSVButtonProps
): React.ReactElement | null => {
  const { onExport, children, className, ...rest } = { ...exportCSVButtonDefaultProps, ...props };

  return (
    <button
      type="button"
      className={`react-bs-table-csv-btn btn btn-default btn-secondary ${className}`}
      onClick={() => onExport()}
      {...rest}
    >
      {children}
    </button>
  );
};



export default ExportCSVButton;
