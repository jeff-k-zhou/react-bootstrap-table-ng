import cs from "classnames";
import React from "react";
import { CSSTransition } from "react-transition-group";

interface ExpandRowProps {
  children?: React.ReactNode;
  expanded?: boolean;
  onClosed?: () => void;
  className?: string;
  colSpan: number;
  id?: string;
}

const ExpandRow: React.FC<ExpandRowProps> = (props) => {
  const {
    children,
    expanded = false,
    onClosed,
    className = "",
    colSpan,
    id,
    ...rest
  } = props;
  const nodeRef = React.useRef(null);

  return (
    <tr id={id}>
      <td className={cs("reset-expansion-style", className)} colSpan={colSpan} {...rest}>
        <CSSTransition
          appear
          in={expanded}
          timeout={400}
          classNames="row-expand-slide"
          onExited={onClosed}
          nodeRef={nodeRef}
        >
          <div ref={nodeRef}>
            <div className="row-expansion-style">{children}</div>
          </div>
        </CSSTransition>
      </td>
    </tr>
  );
};

export default ExpandRow;
