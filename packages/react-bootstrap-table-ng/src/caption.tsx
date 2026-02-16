import React, { FC, ReactNode } from "react";

interface CaptionProps {
  bootstrap4?: boolean;
  bootstrap5?: boolean;
  children?: React.ReactNode;
}

const Caption: React.FC<CaptionProps> = (props) => {
  if (!props.children) return null;

  if (props.bootstrap4 || props.bootstrap5) {
    return <caption style={ { captionSide: "top" } }>{props.children}</caption>;
  }

  return <caption>{props.children}</caption>;
};

export default Caption;
