/* eslint react/require-default-props: 0 */
import cs from "classnames";
import React, { Component } from "react";

interface PageButtonProps {
  onPageChange: (page: any) => void;
  page: React.ReactNode | number | string;
  active: boolean;
  disabled: boolean;
  className?: string;
  title?: string;
}

const PageButton: React.FC<PageButtonProps> = React.memo((props) => {
  const { page, title, active, disabled, className, onPageChange } = props;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!disabled) {
      onPageChange(page);
    }
  };

  const classes = cs(
    {
      active,
      disabled,
      "page-item": true,
    },
    className
  );

  return (
    <li className={classes} title={title}>
      <a
        href="#"
        className="page-link"
        onClick={handleClick}
        aria-label={title}
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled ? "true" : undefined}
        /* WCAG 2.1.1 — disabled items must be removed from tab order */
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
          }
        }}
      >
        {page}
      </a>
    </li>
  );
});



export default PageButton;
