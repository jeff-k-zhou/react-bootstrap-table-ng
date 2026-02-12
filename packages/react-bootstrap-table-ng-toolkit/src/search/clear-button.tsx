import React from "react";
import { ClearSearchButtonProps } from "../..";

const ClearButton = ({
  onClear,
  text = "Clear",
  className = "",
}: ClearSearchButtonProps): React.ReactElement | null => (
  <button className={`btn btn-default ${className}`} onClick={onClear}>
    {text}
  </button>
);



// ClearButton.defaultProps = {
//   text: "Clear",
//   className: "",
// };

export default ClearButton;
