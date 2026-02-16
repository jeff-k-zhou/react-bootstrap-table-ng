import React from "react";
import { ClearSearchButtonProps } from "../..";

const ClearButton = ({
  onClear,
  text = "Clear",
  className = "",
}: ClearSearchButtonProps): React.ReactElement | null => (
  <button className={`btn btn-default btn-secondary ${className}`} onClick={onClear}>
    {text}
  </button>
);


export default ClearButton;
