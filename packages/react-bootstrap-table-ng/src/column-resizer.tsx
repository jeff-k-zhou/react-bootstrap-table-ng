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
      role="separator"
      tabIndex={0}
      aria-label="Resize column. Use left and right arrow keys to adjust width."
      aria-orientation="vertical"
      aria-valuenow={100}
      aria-valuemin={10}
      aria-valuemax={10000}
      className={`react-bootstrap-table-column-resizer ${className || ""}`}
      onMouseDown={onMouseDown}
      onKeyDown={(e) => {
        const parent = resizer.current?.parentElement;
        if (!parent) return;
        const step = 8;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          onColumnResize(parent.offsetWidth + step);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          onColumnResize(Math.max(step, parent.offsetWidth - step));
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
