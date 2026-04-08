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
    onPageChange(page);
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
      <a href="#" onClick={handleClick} className="page-link">
        {page}
      </a>
    </li>
  );
});



export default PageButton;
