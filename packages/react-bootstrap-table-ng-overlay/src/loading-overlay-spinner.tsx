import { css } from "@emotion/css";
import React from "react";
import { LoadingOverlayStyles } from "./loading-overlay";

interface SpinnerProps {
  getStyles: (key: keyof LoadingOverlayStyles, providedState?: string) => any;
  cx: (className: string, styleName: string) => string;
}

const Spinner: React.FC<SpinnerProps> = ({ getStyles, cx }) => (
  <div className={cx("spinner", css(getStyles("spinner")))}>
    <svg viewBox="25 25 50 50">
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
    </svg>
  </div>
);

export default Spinner;
