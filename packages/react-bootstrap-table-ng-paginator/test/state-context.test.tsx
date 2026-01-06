/* eslint no-param-reassign: 0 */
import React from "react";
import { render } from "@testing-library/react";
import paginationFactory from "../index";
import Const from "../src/const";
import createStateContext from "../src/state-context";

const data: any[] = [];
for (let i = 0; i < 100; i += 1) {
  data.push({
    id: i,
    name: `itme name ${i}`,
  });
}

describe("PaginationStateContext", () => {
  let PaginationStateContext: any;

  const defaultPagination = { options: {}, createContext: jest.fn() };

  const MockComponent = () => null;
  const renderMockComponent = jest.fn((props) => <MockComponent {...props} />);

  const handleRemotePaginationChange = jest.fn();

  function renderContext(
    customPagination: any = defaultPagination,
    remoteEnabled: boolean = false
  ) {
    renderMockComponent.mockReset();
    handleRemotePaginationChange.mockReset();
    PaginationStateContext = createStateContext();
    const additionProps = {};
    return render(
      <PaginationStateContext.Provider
        pagination={paginationFactory(customPagination)}
        data={data}
        {...additionProps}
      >
        <PaginationStateContext.Consumer>
          {(paginationProps: any) => renderMockComponent(paginationProps)}
        </PaginationStateContext.Consumer>
      </PaginationStateContext.Provider>
    );
  }

  describe("default render", () => {
    const options: {
      totalSize: number;
      showTotal?: number;
      paginationTotalRenderer?: any;
    } = {
      totalSize: data.length,
    };

    beforeEach(() => {
      renderContext(options);
    });

    it("should have correct Provider property after calling createPaginationStateContext", () => {
      expect(PaginationStateContext.Provider).toBeDefined();
    });

    it("should have correct Consumer property after calling createPaginationStateContext", () => {
      expect(PaginationStateContext.Consumer).toBeDefined();
    });

    it("should get correct pagination props", () => {
      expect(renderMockComponent).toHaveBeenCalledTimes(1);
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.dataSize).toEqual(data.length);
      expect(call.paginationProps.page).toEqual(Const.PAGE_START_INDEX);
      expect(call.paginationProps.sizePerPage).toEqual(Const.SIZE_PER_PAGE_LIST[0]);
      expect(call.paginationProps.sizePerPageList).toEqual(Const.SIZE_PER_PAGE_LIST);
      expect(call.paginationProps.paginationSize).toEqual(Const.PAGINATION_SIZE);
      expect(call.paginationProps.showTotal).toEqual(options.showTotal);
      expect(call.paginationProps.hidePageListOnlyOnePage).toEqual(Const.HIDE_PAGE_LIST_ONLY_ONE_PAGE);
      expect(call.paginationProps.pageStartIndex).toEqual(Const.PAGE_START_INDEX);
      expect(call.paginationProps.withFirstAndLast).toEqual(Const.With_FIRST_AND_LAST);
      expect(call.paginationProps.alwaysShowAllBtns).toEqual(Const.SHOW_ALL_PAGE_BTNS);
      expect(call.paginationProps.firstPageText).toEqual(Const.FIRST_PAGE_TEXT);
      expect(call.paginationProps.prePageText).toEqual(Const.PRE_PAGE_TEXT);
      expect(call.paginationProps.nextPageText).toEqual(Const.NEXT_PAGE_TEXT);
      expect(call.paginationProps.lastPageText).toEqual(Const.LAST_PAGE_TEXT);
      expect(call.paginationProps.firstPageTitle).toEqual(Const.FIRST_PAGE_TITLE);
      expect(call.paginationProps.prePageTitle).toEqual(Const.PRE_PAGE_TITLE);
      expect(call.paginationProps.nextPageTitle).toEqual(Const.NEXT_PAGE_TITLE);
      expect(call.paginationProps.lastPageTitle).toEqual(Const.LAST_PAGE_TITLE);
      expect(call.paginationProps.hideSizePerPage).toEqual(Const.HIDE_SIZE_PER_PAGE);
      expect(call.paginationProps.paginationTotalRenderer).toEqual(options.paginationTotalRenderer);
    });
  });

  describe("handleChangePage", () => {
    it("should call onPageChange if defined", () => {
      const onPageChange = jest.fn();
      renderContext({
        ...defaultPagination,
        onPageChange,
      });
      // Simulate page change
      const call = renderMockComponent.mock.calls[0][0];
      call.paginationProps.onPageChange(3, 10);
      expect(onPageChange).toHaveBeenCalledWith(3, 10);
    });
  });

  describe("handleChangeSizePerPage", () => {
    it("should call onSizePerPageChange if defined", () => {
      const onSizePerPageChange = jest.fn();
      renderContext({
        ...defaultPagination,
        onSizePerPageChange,
      });
      // Simulate sizePerPage change
      const call = renderMockComponent.mock.calls[0][0];
      call.paginationProps.onSizePerPageChange(15, 2);
      expect(onSizePerPageChange).toHaveBeenCalledWith(15, 2);
    });
  });

  describe("when options.page is defined", () => {
    const page = 3;
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        page,
      });
    });

    it("should set correct currPage", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.page).toEqual(page);
    });
  });

  describe("when options.sizePerPage is defined", () => {
    const sizePerPage = Const.SIZE_PER_PAGE_LIST[2];
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        sizePerPage,
      });
    });

    it("should set correct currSizePerPage", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.sizePerPage).toEqual(sizePerPage);
    });
  });

  describe("when options.totalSize is defined", () => {
    const totalSize = 100;
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        totalSize,
      });
    });

    it("should set correct dataSize", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.dataSize).toEqual(totalSize);
    });
  });

  describe("when options.showTotal is defined", () => {
    const showTotal = true;
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        showTotal,
      });
    });

    it("should set correct showTotal", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.showTotal).toEqual(showTotal);
    });
  });

  describe("when options.pageStartIndex is defined", () => {
    const pageStartIndex = -1;
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        pageStartIndex,
      });
    });

    it("should set correct pageStartIndex", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.pageStartIndex).toEqual(pageStartIndex);
    });
  });

  describe("when options.sizePerPageList is defined", () => {
    const sizePerPageList = [10, 40];
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        sizePerPageList,
      });
    });

    it("should set correct sizePerPageList", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.sizePerPageList).toEqual(sizePerPageList);
    });
  });

  describe("when options.paginationSize is defined", () => {
    const paginationSize = 10;
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        paginationSize,
      });
    });

    it("should set correct paginationSize", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.paginationSize).toEqual(paginationSize);
    });
  });

  describe("when options.withFirstAndLast is defined", () => {
    const withFirstAndLast = false;
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        withFirstAndLast,
      });
    });

    it("should set correct withFirstAndLast", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.withFirstAndLast).toEqual(withFirstAndLast);
    });
  });

  describe("when options.alwaysShowAllBtns is defined", () => {
    const alwaysShowAllBtns = true;
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        alwaysShowAllBtns,
      });
    });

    it("should set correct alwaysShowAllBtns", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.alwaysShowAllBtns).toEqual(alwaysShowAllBtns);
    });
  });

  describe("when options.firstPageText is defined", () => {
    const firstPageText = "1st";
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        firstPageText,
      });
    });

    it("should set correct firstPageText", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.firstPageText).toEqual(firstPageText);
    });
  });

  describe("when options.prePageText is defined", () => {
    const prePageText = "PRE";
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        prePageText,
      });
    });

    it("should set correct prePageText", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.prePageText).toEqual(prePageText);
    });
  });

  describe("when options.nextPageText is defined", () => {
    const nextPageText = "NEXT";
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        nextPageText,
      });
    });

    it("should set correct nextPageText", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.nextPageText).toEqual(nextPageText);
    });
  });

  describe("when options.lastPageText is defined", () => {
    const lastPageText = "LAST";
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        lastPageText,
      });
    });

    it("should set correct lastPageText", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.lastPageText).toEqual(lastPageText);
    });
  });

  describe("when options.firstPageTitle is defined", () => {
    const firstPageTitle = "1st";
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        firstPageTitle,
      });
    });

    it("should set correct firstPageTitle", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.firstPageTitle).toEqual(firstPageTitle);
    });
  });

  describe("when options.prePageTitle is defined", () => {
    const prePageTitle = "PRE";
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        prePageTitle,
      });
    });

    it("should set correct prePageTitle", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.prePageTitle).toEqual(prePageTitle);
    });
  });

  describe("when options.nextPageTitle is defined", () => {
    const nextPageTitle = "NEXT";
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        nextPageTitle,
      });
    });

    it("should set correct nextPageTitle", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.nextPageTitle).toEqual(nextPageTitle);
    });
  });

  describe("when options.lastPageTitle is defined", () => {
    const lastPageTitle = "nth";
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        lastPageTitle,
      });
    });

    it("should set correct lastPageTitle", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.lastPageTitle).toEqual(lastPageTitle);
    });
  });

  describe("when options.hideSizePerPage is defined", () => {
    const hideSizePerPage = true;
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        hideSizePerPage,
      });
    });

    it("should set correct hideSizePerPage", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.hideSizePerPage).toEqual(hideSizePerPage);
    });
  });

  describe("when options.hidePageListOnlyOnePage is defined", () => {
    const hidePageListOnlyOnePage = true;
    beforeEach(() => {
      renderContext({
        ...defaultPagination,
        hidePageListOnlyOnePage,
      });
    });

    it("should set correct hidePageListOnlyOnePage", () => {
      const call = renderMockComponent.mock.calls[0][0];
      expect(call.paginationProps.hidePageListOnlyOnePage).toEqual(hidePageListOnlyOnePage);
    });
  });
});
