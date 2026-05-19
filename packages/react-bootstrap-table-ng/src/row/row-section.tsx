import React, { FC } from "react";

type RowSectionProps = {
  content?: React.ReactNode;
  colSpan?: number;
};

const RowSection: FC<RowSectionProps> = ({ content = null, colSpan = 1 }) => (
  <tr>
    <td
      colSpan={colSpan}
      className="react-bs-table-no-data"
      aria-live="polite"
      aria-atomic="true"
    >
      {content}
    </td>
  </tr>
);

export default RowSection;
