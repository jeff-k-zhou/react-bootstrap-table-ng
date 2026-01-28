import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { stub } from "sinon";

import { SORT_ASC, SORT_DESC } from "..";
import HeaderCell from "../src/header-cell";
import SortCaret from "../src/sort/caret";
import SortSymbol from "../src/sort/symbol";

describe("HeaderCell", () => {
  const index = 1;

  describe("simplest header cell", () => {
    const column = {
      dataField: "id",
      text: "ID",
    };

    it("should render successfully", () => {
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell column={column} index={index} />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      expect(th).toBeInTheDocument();
      expect(th.textContent).toEqual(column.text);
    });

    it("should not have default style", () => {
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell column={column} index={index} />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      expect(th.getAttribute("style")).toBeNull();
    });
  });

  describe("when column.headerTitle prop is defined", () => {
    let column: any;
    beforeEach(() => {
      column = {
        dataField: "id",
        text: "ID",
      };
    });

    describe("when headerTitle is boolean", () => {
      it("should render title as column.text as default", () => {
        column.headerTitle = true;
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th.title).toBe(column.text);
      });
    });

    describe("when headerTitle is custom function", () => {
      const customTitle = "test_title";
      let titleCallBack: any;

      it("should render title correctly by custom title function", () => {
        titleCallBack = stub().withArgs(column).returns(customTitle);
        column.headerTitle = titleCallBack;
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th.title).toBe(customTitle);
        expect(titleCallBack.callCount).toBe(1);
        expect(titleCallBack.calledWith(column)).toBe(true);
      });
    });
  });

  describe("when column.headerAlign prop is defined", () => {
    let column: any;
    beforeEach(() => {
      column = {
        dataField: "id",
        text: "ID",
      };
    });

    describe("when headerAlign is string", () => {
      it("should render style.textAlign correctly", () => {
        column.headerAlign = "center";
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th).toHaveStyle({ "text-align": column.headerAlign });
      });
    });

    describe("when headerAlign is custom function", () => {
      const customAlign = "center";
      let alignCallBack: any;

      it("should render style.textAlign correctly by custom headerAlign function", () => {
        alignCallBack = stub().withArgs(column, index).returns(customAlign);
        column.headerAlign = alignCallBack;
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th).toHaveStyle({ "text-align": customAlign });
        expect(alignCallBack.callCount).toBe(1);
        expect(alignCallBack.calledWith(column, index)).toBe(true);
      });
    });
  });

  describe("when column.headerFormatter prop is defined", () => {
    const column = {
      dataField: "id",
      text: "ID",
      headerFormatter: stub,
    };
    const formatterResult = <h3>{column.text}</h3>;
    const formatter = stub().withArgs(column, index).returns(formatterResult);
    column.headerFormatter = formatter;

    afterEach(() => {
      formatter.reset();
    });

    it("should render successfully", () => {
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell column={column} index={index} />
            </tr>
          </thead>
        </table>
      );
      expect(screen.getByRole("columnheader").querySelector("h3")).toBeTruthy();
    });

    it("should call custom headerFormatter correctly", () => {
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell column={column} index={index} />
            </tr>
          </thead>
        </table>
      );
      expect(formatter.callCount).toBe(1);
      expect(
        formatter.calledWith(column, index, {
          sortElement: undefined,
          filterElement: undefined,
        })
      ).toBe(true);
    });
  });

  describe("when column.headerEvents prop is defined", () => {
    let column: any;

    it("should attach DOM event successfully", () => {
      const onClickStub = stub();
      column = {
        dataField: "id",
        text: "ID",
        headerEvents: {
          onClick: onClickStub,
        },
      };
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell column={column} index={index} />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      fireEvent.click(th);
      expect(onClickStub.callCount).toBe(1);
    });
  });

  describe("when column.headerStyle prop is defined", () => {
    let column: any;

    beforeEach(() => {
      column = {
        dataField: "id",
        text: "ID",
      };
    });

    describe("when headerStyle is an object", () => {
      it("should render successfully", () => {
        column.headerStyle = { backgroundColor: "red" };
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th).toHaveStyle("background-color: rgb(255, 0, 0)");
      });
    });

    describe("when headerStyle is a function", () => {
      const returnStyle = { backgroundColor: "red" };
      let styleCallBack: any;

      it("should render successfully", () => {
        styleCallBack = stub().withArgs(column, index).returns(returnStyle);
        column.headerStyle = styleCallBack;
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th).toHaveStyle("background-color: rgb(255, 0, 0)");
        expect(styleCallBack.callCount).toBe(1);
        expect(styleCallBack.calledWith(column, index)).toBe(true);
      });
    });
  });

  describe("when column.headerClasses prop is defined", () => {
    let column: any;

    beforeEach(() => {
      column = {
        dataField: "id",
        text: "ID",
      };
    });

    describe("when headerClasses is a string", () => {
      it("should render successfully", () => {
        column.headerClasses = "td-test-class";
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th).toHaveClass("td-test-class");
      });
    });

    describe("when headerClasses is a function", () => {
      const returnClasses = "td-test-class";
      let classesCallBack: any;

      it("should render successfully", () => {
        classesCallBack = stub().withArgs(column, index).returns(returnClasses);
        column.headerClasses = classesCallBack;
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th).toHaveClass(returnClasses);
        expect(classesCallBack.callCount).toBe(1);
        expect(classesCallBack.calledWith(column, index)).toBe(true);
      });
    });

    describe("when column.headerAttrs prop is defined", () => {
      it("should render column.headerAttrs correctly", () => {
        column.headerAttrs = {
          "data-test": "test",
          title: "title",
          className: "attrs-class",
          style: { backgroundColor: "attrs-style-test" },
        };
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th).toHaveAttribute("data-test", "test");
        expect(th.title).toBe("title");
        expect(th).toHaveClass("attrs-class");
        expect(th).toHaveStyle("background-color: rgba(0, 0, 0, 0)");
      });

      it("title should be overwritten by headerTitle", () => {
        column.headerAttrs = { title: "title" };
        column.headerTitle = true;
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th.title).toBe(column.text);
      });

      it("class should be overwritten by headerClasses", () => {
        column.headerClasses = "td-test-class";
        column.headerAttrs = { className: "attrs-class" };
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th).toHaveClass("td-test-class");
      });

      it("style should be overwritten by headerStyle", () => {
        column.headerStyle = { backgroundColor: "red" };
        column.headerAttrs = { style: { backgroundColor: "attrs-style-test" } };
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th).toHaveStyle("background-color: rgb(255, 0, 0)");
      });

      it("style.textAlign should be overwritten by headerAlign", () => {
        column.headerAlign = "center";
        column.headerAttrs = { style: { textAlign: "right" } };
        render(
          <table>
            <thead>
              <tr>
                <HeaderCell column={column} index={index} />
              </tr>
            </thead>
          </table>
        );
        const th = screen.getByRole("columnheader");
        expect(th).toHaveStyle({ "text-align": "center" });
      });
    });

    it("should not have aria-label", () => {
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell column={column} index={index} />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      expect(th).not.toHaveAttribute("aria-label");
    });
  });

  describe("when column.sort is enabled", () => {
    let column: any;
    let onSortCallBack: any;

    beforeEach(() => {
      column = {
        dataField: "id",
        text: "ID",
        sort: true,
      };
      onSortCallBack = stub().withArgs(column);
    });

    it("should have sortable class on header cell", () => {
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell column={column} index={index} onSort={onSortCallBack} />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      expect(th).toHaveClass("sortable");
    });

    it("should have onClick event on header cell", () => {
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell column={column} index={index} onSort={onSortCallBack} />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      fireEvent.click(th);
      expect(onSortCallBack.callCount).toBe(1);
    });

    it("should have onKeyUp event on header cell", () => {
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell column={column} index={index} onSort={onSortCallBack} />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      fireEvent.keyUp(th, { key: "Enter" });
      expect(onSortCallBack.callCount).toBe(1);
    });

    it("should not trigger onSort callback when keyup key is not Enter on header cell", () => {
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell column={column} index={index} onSort={onSortCallBack} />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      fireEvent.keyUp(th, { key: "test-key" });
      expect(onSortCallBack.callCount).toBe(0);
    });

    it("should have aria-label", () => {
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell column={column} index={index} onSort={onSortCallBack} />
            </tr>
          </thead>
        </table>
      );
      const th = screen.getByRole("columnheader");
      expect(th).toHaveAttribute("aria-label", "ID sortable");
    });

    describe("and sorting prop is true", () => {
      [SORT_ASC, SORT_DESC].forEach((order) => {
        it(`should describe sort order in aria-label for ${order}`, () => {
          render(
            <table>
              <thead>
                <tr>
                  <HeaderCell
                    column={column}
                    index={index}
                    sortOrder={order}
                    sorting
                    onSort={onSortCallBack}
                  />
                </tr>
              </thead>
            </table>
          );
          const th = screen.getByRole("columnheader");
          expect(th).toHaveAttribute("aria-label", `ID sort ${order}`);
        });

        it(`should render SortCaret correctly for ${order}`, () => {
          render(
            <table>
              <thead>
                <tr>
                  <HeaderCell
                    column={column}
                    index={index}
                    sortOrder={order}
                    sorting
                    onSort={onSortCallBack}
                  />
                </tr>
              </thead>
            </table>
          );
          const th = screen.getByRole("columnheader");
          expect(th.querySelector("[data-testid='sort-caret']")).toBeTruthy();
        });
      });
    });
  });

  describe("when column.filter is defined", () => {
    const onFilter = jest.fn();
    const filterProps = { a: 123 };
    const Filter = () => <div>test</div>;
    let column: any;

    beforeEach(() => {
      onFilter.mockClear();
      column = {
        dataField: "id",
        text: "ID",
        filter: {
          props: filterProps,
          Filter,
        },
      };
    });

    it("should render successfully", () => {
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell
                column={column}
                index={index}
                onFilter={onFilter}
                currFilters={{}}
                filterPosition="inline"
              />
            </tr>
          </thead>
        </table>
      );
      expect(screen.getByRole("columnheader")).toBeInTheDocument();
      expect(screen.getByText("test")).toBeInTheDocument();
    });
  });

  describe("when column.filter and column.filterRenderer is defined", () => {
    const onExternalFilter = jest.fn();
    const filterProps = { a: 123 };
    const Filter = () => <div>test</div>;
    const filterRenderer = jest.fn().mockReturnValue(<Filter />);
    let column: any;

    beforeEach(() => {
      onExternalFilter.mockClear();
      filterRenderer.mockClear();
      column = {
        dataField: "id",
        text: "ID",
        filter: {
          props: filterProps,
        },
        filterRenderer,
      };
    });

    it("should render successfully", () => {
      render(
        <table>
          <thead>
            <tr>
              <HeaderCell
                column={column}
                index={index}
                filterPosition="inline"
                onExternalFilter={onExternalFilter}
              />
            </tr>
          </thead>
        </table>
      );
      expect(screen.getByRole("columnheader")).toBeInTheDocument();
      expect(screen.getByText("test")).toBeInTheDocument();
      expect(filterRenderer).toHaveBeenCalledTimes(1);
    });
  });
});
