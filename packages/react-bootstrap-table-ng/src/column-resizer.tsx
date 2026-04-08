import React, { Component, createRef } from "react";

interface ColumnResizerProps {
  onColumnResize: (width: number) => void;
  className?: string;
}

const ColumnResizer: React.FC<ColumnResizerProps> = (props) => {
  const { onColumnResize, className } = props;
  const resizer = React.useRef<HTMLDivElement>(null);

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const parent = resizer.current?.parentElement;
    if (!parent) return;

    const startWidth = parent.offsetWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      onColumnResize(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [onColumnResize]);

  return (
    <div
      ref={resizer}
      role="button"
      tabIndex={0}
      aria-label="Resize column"
      className={`react-bootstrap-table-column-resizer ${className || ""}`}
      onMouseDown={onMouseDown}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
        }
      }}
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "10px",
        cursor: "col-resize",
        zIndex: 1,
      }}
    />
  );
};

export default ColumnResizer;
