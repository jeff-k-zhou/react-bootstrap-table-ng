import React, { Component, createRef } from "react";

interface ColumnResizerProps {
  onColumnResize: (width: number) => void;
  className?: string;
}

class ColumnResizer extends Component<ColumnResizerProps> {
  resizer = createRef<HTMLDivElement>();

  onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const parent = this.resizer.current?.parentElement;
    if (!parent) return;

    const startWidth = parent.offsetWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      this.props.onColumnResize(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  render() {
    const { className } = this.props;
    return (
      <div
        ref={this.resizer}
        className={`react-bootstrap-table-column-resizer ${className || ""}`}
        onMouseDown={this.onMouseDown}
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
  }
}

export default ColumnResizer;
