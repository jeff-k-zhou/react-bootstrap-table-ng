
import React from "react";

import PageButton from "./page-button";

interface PaginationListProps {
  pages: Array<{
    page: React.ReactNode | number | string;
    active?: boolean;
    disabled?: boolean;
    title?: string;
  }>;
  onPageChange: (page: any) => void;
  pageButtonRenderer?: (props: any) => React.ReactElement | null;
}

const PaginatonList = (props: PaginationListProps) => (
  <ul className="pagination react-bootstrap-table-page-btns-ul">
    {props.pages.map((pageProps: any) => {
      if (props.pageButtonRenderer) {
        const element = props.pageButtonRenderer({
          ...pageProps,
          onPageChange: props.onPageChange,
        });
        return element ? React.cloneElement(element, { key: pageProps.page }) : null;
      }
      return (
        <PageButton
          key={pageProps.page}
          {...pageProps}
          onPageChange={props.onPageChange}
        />
      );
    })}
  </ul>
);


export default PaginatonList;
