import React, { Component } from "react";
import pageResolver from "../src/page-resolver";

// Helper to extend a component for testing
const extendTo = (Base: any) =>
  class MockComponent extends Base {
    constructor(props: any) {
      super(props);
      // @ts-ignore
      this.state = this.initialState();
    }
    // Add a fallback for missing methods in tests
    backToPrevPage(...args: any[]) {
      // @ts-ignore
      return super.backToPrevPage ? super.backToPrevPage(...args) : undefined;
    }
    calculateFromTo(...args: any[]) {
      // @ts-ignore
      return super.calculateFromTo ? super.calculateFromTo(...args) : undefined;
    }
    render() {
      return null;
    }
  };

describe("PageResolver", () => {
  const ExtendBase = pageResolver(Component);
  const MockComponent = extendTo(ExtendBase);

  const createMockProps = () => ({
    dataSize: 100,
    sizePerPageList: [
      { text: "10", value: 20 },
      { text: "30", value: 50 },
    ],
    currPage: 1,
    currSizePerPage: 10,
    pageStartIndex: 1,
    paginationSize: 5,
    withFirstAndLast: true,
    firstPageText: "<<",
    prePageText: "<",
    nextPageText: ">",
    lastPageText: ">>",
    alwaysShowAllBtns: false,
  });

  let instance: any;

  beforeEach(() => {
    // Always create a new instance for each test
    const props = createMockProps();
    instance = new MockComponent(props);
  });

  describe("initialize", () => {
    it("should creating initial state correctly", () => {
      expect(instance.state.totalPages).toBeDefined();
      expect(instance.state.totalPages).toEqual(instance.calculateTotalPage());
      expect(instance.state.lastPage).toBeDefined();
      expect(instance.state.lastPage).toEqual(
        instance.calculateLastPage(instance.state.totalPages)
      );
    });
  });

  describe("backToPrevPage", () => {
    it("should getting previous page correctly", () => {
      const props = createMockProps();
      props.currPage = 2;
      const inst = new MockComponent(props);
      expect(inst.backToPrevPage()).toEqual(props.currPage - 1);
    });

    it("should always getting page which must eq props.pageStartIndex", () => {
      const props = createMockProps();
      props.currPage = props.pageStartIndex;
      const inst = new MockComponent(props);
      expect(inst.backToPrevPage()).toEqual(props.pageStartIndex);
    });
  });

  describe("calculateFromTo", () => {
    it("should return correct array with from and to value", () => {
      expect(instance.calculateFromTo()).toEqual([1, instance.props.currSizePerPage]);
    });

    it("should return correct array with from and to value if data is empty", () => {
      const props = createMockProps();
      props.dataSize = 87;
      props.currPage = 9;
      const inst = new MockComponent(props);
      expect(inst.calculateFromTo()).toEqual([81, props.dataSize]);
    });

    it("should return correct array with from and to value if current page is last page", () => {
      const props = createMockProps();
      props.dataSize = 0;
      const inst = new MockComponent(props);
      expect(inst.calculateFromTo()).toEqual([0, 0]);
    });
  });

  describe("calculateTotalPage", () => {
    it("should getting total pages correctly by default props.currSizePerPage", () => {
      expect(instance.calculateTotalPage()).toEqual(10);
    });

    it("should getting total pages correctly by sizePerPage argument", () => {
      expect(instance.calculateTotalPage(25)).toEqual(4);
    });
  });

  describe("calculateLastPage", () => {
    it("should getting last page correctly", () => {
      expect(instance.calculateLastPage(instance.state.totalPages)).toEqual(10);
    });
  });

  describe("calculatePages", () => {
    it("should getting pages list correctly by totalPages and lastPage", () => {
      expect(
        instance.calculatePages(instance.state.totalPages, instance.state.lastPage)
      ).toEqual([
        instance.props.prePageText,
        1,
        2,
        3,
        4,
        5,
        instance.props.nextPageText,
        instance.props.lastPageText,
      ]);
      expect(instance.calculatePages(4, 4)).toEqual([
        instance.props.prePageText,
        1,
        2,
        3,
        4,
        instance.props.nextPageText,
      ]);
    });

    it("should getting pages list correctly by props.currPage", () => {
      const props = createMockProps();
      const { firstPageText, prePageText, nextPageText, lastPageText } = props;
      const currPages = Array.from(Array(10).keys());
      currPages.forEach((currPage) => {
        props.currPage = currPage + 1;
        const inst = new MockComponent(props);
        const pageList = inst.calculatePages(inst.state.totalPages, inst.state.lastPage);

        if (props.currPage < 4) {
          expect(pageList).toEqual([
            prePageText,
            1,
            2,
            3,
            4,
            5,
            nextPageText,
            lastPageText,
          ]);
        } else if (props.currPage > 7) {
          expect(pageList).toEqual([
            firstPageText,
            prePageText,
            6,
            7,
            8,
            9,
            10,
            nextPageText,
          ]);
        } else if (props.currPage === 4) {
          expect(pageList).toEqual([
            firstPageText,
            prePageText,
            2,
            3,
            4,
            5,
            6,
            nextPageText,
            lastPageText,
          ]);
        } else if (props.currPage === 5) {
          expect(pageList).toEqual([
            firstPageText,
            prePageText,
            3,
            4,
            5,
            6,
            7,
            nextPageText,
            lastPageText,
          ]);
        } else if (props.currPage === 6) {
          expect(pageList).toEqual([
            firstPageText,
            prePageText,
            4,
            5,
            6,
            7,
            8,
            nextPageText,
            lastPageText,
          ]);
        } else {
          expect(pageList).toEqual([
            firstPageText,
            prePageText,
            5,
            6,
            7,
            8,
            9,
            nextPageText,
            lastPageText,
          ]);
        }
      });
    });

    it("the quantity of pages is calculated by props.paginationSize", () => {
      const props = createMockProps();
      const indicators = [
        props.firstPageText,
        props.prePageText,
        props.lastPageText,
        props.nextPageText,
      ];
      [1, 3, 5, 8, 10].forEach((paginationSize) => {
        props.paginationSize = paginationSize;
        const inst = new MockComponent(props);
        const pageList = inst.calculatePages(inst.state.totalPages, inst.state.lastPage);
        const result = pageList.filter((p: any) => indicators.indexOf(p) === -1);
        expect(result.length).toEqual(props.paginationSize);
      });
    });

    it("should getting pages list which contain last page indication when last page is not visible", () => {
      const props = createMockProps();
      [1, 2, 3, 4, 5, 6, 7].forEach((currPage) => {
        props.currPage = currPage;
        const inst = new MockComponent(props);
        const pageList = inst.calculatePages(inst.state.totalPages, inst.state.lastPage);
        expect(pageList.indexOf(props.lastPageText) > -1).toBeTruthy();
      });
    });

    it("should getting pages list which contain first page indication when first page is not visible", () => {
      const props = createMockProps();
      [10, 9, 8, 7, 6, 5, 4].forEach((currPage) => {
        props.currPage = currPage;
        const inst = new MockComponent(props);
        const pageList = inst.calculatePages(inst.state.totalPages, inst.state.lastPage);
        expect(pageList.indexOf(props.firstPageText) > -1).toBeTruthy();
      });
    });

    it("should not contain first and last page indication always when withFirstAndLast is false", () => {
      const props = createMockProps();
      const currPages = Array.from(Array(10).keys());
      currPages.forEach((currPage) => {
        props.currPage = currPage + 1;
        props.withFirstAndLast = false;
        const inst = new MockComponent(props);
        const pageList = inst.calculatePages(inst.state.totalPages, inst.state.lastPage);
        expect(pageList.indexOf(props.lastPageText) > -1).toBeFalsy();
        expect(pageList.indexOf(props.firstPageText) > -1).toBeFalsy();
      });
    });

    it("should getting last page correctly when pageStartIndex is negative number", () => {
      const props = createMockProps();
      props.pageStartIndex = -2;
      props.currPage = -2;
      const inst = new MockComponent(props);
      const pageList = inst.calculatePages(inst.state.totalPages, inst.state.lastPage);
      expect(pageList).toEqual([
        props.prePageText,
        -2,
        -1,
        0,
        1,
        2,
        props.nextPageText,
        props.lastPageText,
      ]);
    });

    it("should always having next and previous page indication when alwaysShowAllBtns is true", () => {
      const props = createMockProps();
      props.alwaysShowAllBtns = true;
      props.currPage = 1;
      props.dataSize = 11;
      const inst = new MockComponent(props);
      const pageList = inst.calculatePages(inst.state.totalPages, inst.state.lastPage);
      expect(pageList.indexOf(props.nextPageText) > -1).toBeTruthy();
      expect(pageList.indexOf(props.prePageText) > -1).toBeTruthy();
    });

    it("should getting empty array when state.totalPages is zero", () => {
      const props = createMockProps();
      props.dataSize = 0;
      const inst = new MockComponent(props);
      const pageList = inst.calculatePages(inst.state.totalPages, inst.state.lastPage);
      expect(pageList).toEqual([]);
    });
  });

  describe("calculatePageStatus", () => {
    it("should returning correct format for page status", () => {
      const pageList = instance.calculatePages(instance.state.totalPages, instance.state.lastPage);
      const pageStatus = instance.calculatePageStatus(pageList, instance.state.lastPage);
      pageStatus.forEach((p: any) => {
        expect(Object.prototype.hasOwnProperty.call(p, "page")).toBeTruthy();
        expect(Object.prototype.hasOwnProperty.call(p, "active")).toBeTruthy();
        expect(Object.prototype.hasOwnProperty.call(p, "disabled")).toBeTruthy();
        expect(Object.prototype.hasOwnProperty.call(p, "title")).toBeTruthy();
      });
    });

    it("should mark active status as true when it is props.currPage", () => {
      const pageList = instance.calculatePages(instance.state.totalPages, instance.state.lastPage);
      const pageStatus = instance.calculatePageStatus(pageList, instance.state.lastPage);
      expect(pageStatus.find((p: any) => p.page === instance.props.currPage).active).toBeTruthy();
    });

    it("only have one page's active status is true", () => {
      const pageList = instance.calculatePages(instance.state.totalPages, instance.state.lastPage);
      const pageStatus = instance.calculatePageStatus(pageList, instance.state.lastPage);
      expect(pageStatus.filter((p: any) => p.page === instance.props.currPage).length).toEqual(1);
    });

    it("should filter out previous page indication when alwaysShowAllBtns is false and currPage is on first page", () => {
      const props = createMockProps();
      const inst = new MockComponent(props);
      const pageList = inst.calculatePages(inst.state.totalPages, inst.state.lastPage);
      const pageStatus = inst.calculatePageStatus(pageList, inst.state.lastPage);
      expect(pageStatus.find((p: any) => p.page === props.prePageText)).not.toBeDefined();
    });

    it("should filter out next page indication when alwaysShowAllBtns is false and currPage is on last page", () => {
      const props = createMockProps();
      props.currPage = 10;
      const inst = new MockComponent(props);
      const pageList = inst.calculatePages(inst.state.totalPages, inst.state.lastPage);
      const pageStatus = inst.calculatePageStatus(pageList, inst.state.lastPage);
      expect(pageStatus.find((p: any) => p.page === props.nextPageText)).not.toBeDefined();
    });
  });

  describe("calculateSizePerPageStatus", () => {
    it("should getting correctly sizePerPage status when sizePerPageList is a number array", () => {
      const result = instance.calculateSizePerPageStatus();
      expect(result.length).toEqual(instance.props.sizePerPageList.length);
      result.forEach((sizePerPage: any, i: number) => {
        expect(sizePerPage.text).toEqual(`${instance.props.sizePerPageList[i].text}`);
        expect(sizePerPage.page).toEqual(instance.props.sizePerPageList[i].value);
      });
    });

    it("should getting correctly sizePerPage status when sizePerPageList is an object array", () => {
      const props = createMockProps();
      props.sizePerPageList = [
        {
          text: "ten",
          value: 10,
        },
        {
          text: "thirty",
          value: 30,
        },
      ];
      const inst = new MockComponent(props);
      const result = inst.calculateSizePerPageStatus();
      expect(result.length).toEqual(props.sizePerPageList.length);
      result.forEach((sizePerPage: any, i: number) => {
        expect(sizePerPage.text).toEqual(props.sizePerPageList[i].text);
        expect(sizePerPage.page).toEqual(props.sizePerPageList[i].value);
      });
    });
  });
});
