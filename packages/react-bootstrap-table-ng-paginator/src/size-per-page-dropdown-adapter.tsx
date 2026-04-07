/* eslint react/prop-types: 0 */
import React, { useState, useCallback } from "react";
import { usePagination } from "./hooks/usePagination";
import SizePerPageDropDown from "./size-per-page-dropdown";

const sizePerPageDropdownAdapter = (WrappedComponent: any) => {
  return (props: any) => {
    const {
      tableId,
      bootstrap4,
      bootstrap5,
      sizePerPageList,
      currSizePerPage,
      hideSizePerPage,
      sizePerPageRenderer,
      sizePerPageOptionRenderer,
      onSizePerPageChange,
      // Default values for usePagination
      currPage = 1,
      dataSize = 0,
      pageStartIndex = 1,
      paginationSize = 5,
      withFirstAndLast = true,
      alwaysShowAllBtns = false,
      firstPageText = "<<",
      prePageText = "<",
      nextPageText = ">",
      lastPageText = ">>",
      onPageChange = () => {},
    } = props;

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const { getSizePerPageStatus, handleChangeSizePerPage } = usePagination({
      currPage,
      currSizePerPage,
      dataSize,
      pageStartIndex,
      paginationSize,
      withFirstAndLast,
      alwaysShowAllBtns,
      firstPageText,
      prePageText,
      nextPageText,
      lastPageText,
      sizePerPageList,
      onPageChange,
      onSizePerPageChange,
    });

    const toggleDropDown = useCallback(() => {
      setDropdownOpen((prev) => !prev);
    }, []);

    const closeDropDown = useCallback(() => {
      setDropdownOpen(false);
    }, []);

    const handleSizePerPageChange = useCallback(
      (sizePerPage: any) => {
        handleChangeSizePerPage(sizePerPage);
        closeDropDown();
      },
      [handleChangeSizePerPage, closeDropDown]
    );

    if (sizePerPageList.length > 1 && !hideSizePerPage) {
      const options = getSizePerPageStatus();
      if (sizePerPageRenderer) {
        return sizePerPageRenderer({
          options,
          currSizePerPage: `${currSizePerPage}`,
          onSizePerPageChange: handleSizePerPageChange,
        });
      }
      return (
        <WrappedComponent
          {...props}
          currSizePerPage={`${currSizePerPage}`}
          options={options}
          optionRenderer={sizePerPageOptionRenderer}
          onSizePerPageChange={handleSizePerPageChange}
          onClick={toggleDropDown}
          onBlur={closeDropDown}
          open={dropdownOpen}
          tableId={tableId}
          bootstrap4={bootstrap4}
          bootstrap5={bootstrap5}
        />
      );
    }
    return null;
  };
};

export const SizePerPageDropdownWithAdapter =
  sizePerPageDropdownAdapter(SizePerPageDropDown);
export default sizePerPageDropdownAdapter;
