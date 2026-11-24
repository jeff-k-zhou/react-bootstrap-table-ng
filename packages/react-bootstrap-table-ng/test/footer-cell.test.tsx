import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FooterCell from "../src/footer-cell";

describe("FooterCell", () => {
  it("renders with plain string footer and default attrs", () => {
    const column = {
      dataField: "id",
      text: "ID",
      footer: "Total",
    };

    render(
      <table>
        <tfoot>
          <tr>
            <FooterCell column={column} index={0} columnData={[1, 2, 3]} />
          </tr>
        </tfoot>
      </table>
    );

    const th = screen.getByRole("columnheader");
    expect(th).toHaveTextContent("Total");
    expect(th).toHaveAttribute("scope", "col");
  });

  it("handles footer as a function", () => {
    const footerFn = jest.fn((colData, col, idx) => `Sum: ${colData.length}`);
    const column = {
      dataField: "id",
      text: "ID",
      footer: footerFn,
    };

    render(
      <table>
        <tfoot>
          <tr>
            <FooterCell column={column} index={1} columnData={[10, 20]} />
          </tr>
        </tfoot>
      </table>
    );

    expect(screen.getByText("Sum: 2")).toBeInTheDocument();
    expect(footerFn).toHaveBeenCalledWith([10, 20], column, 1);
  });

  it("applies footerStyle as function and object", () => {
    const styleFn = jest.fn().mockReturnValue({ color: "red" });
    const colFunc = {
      dataField: "a",
      text: "A",
      footer: "A",
      footerStyle: styleFn,
    };
    const colObj = {
      dataField: "b",
      text: "B",
      footer: "B",
      footerStyle: { fontWeight: "bold" },
    };

    const { container } = render(
      <table>
        <tfoot>
          <tr>
            <FooterCell column={colFunc} index={0} />
            <FooterCell column={colObj} index={1} />
          </tr>
        </tfoot>
      </table>
    );

    const cells = container.querySelectorAll("th");
    expect(cells[0].style.color).toBe("red");
    expect(cells[1].style.fontWeight).toBe("bold");
    expect(styleFn).toHaveBeenCalled();
  });

  it("applies footerTitle as boolean and function", () => {
    const titleFn = jest.fn().mockReturnValue("custom-title");
    const colBool = {
      dataField: "a",
      text: "A",
      footer: "Hello",
      footerTitle: true,
    };
    const colFn = {
      dataField: "b",
      text: "B",
      footer: "World",
      footerTitle: titleFn,
    };

    const { container } = render(
      <table>
        <tfoot>
          <tr>
            <FooterCell column={colBool} index={0} />
            <FooterCell column={colFn} index={1} />
          </tr>
        </tfoot>
      </table>
    );

    const cells = container.querySelectorAll("th");
    expect(cells[0].getAttribute("title")).toBe("Hello");
    expect(cells[1].getAttribute("title")).toBe("custom-title");
    expect(titleFn).toHaveBeenCalled();
  });

  it("applies footerAlign as string and function", () => {
    const alignFn = jest.fn().mockReturnValue("right");
    const colStr = {
      dataField: "a",
      text: "A",
      footer: "A",
      footerAlign: "center",
    };
    const colFn = {
      dataField: "b",
      text: "B",
      footer: "B",
      footerAlign: alignFn,
    };

    const { container } = render(
      <table>
        <tfoot>
          <tr>
            <FooterCell column={colStr} index={0} />
            <FooterCell column={colFn} index={1} />
          </tr>
        </tfoot>
      </table>
    );

    const cells = container.querySelectorAll("th");
    expect(cells[0].style.textAlign).toBe("center");
    expect(cells[1].style.textAlign).toBe("right");
    expect(alignFn).toHaveBeenCalled();
  });

  it("applies footerClasses and footerAttrs as function and object", () => {
    const col = {
      dataField: "a",
      text: "A",
      footer: "A",
      footerClasses: (c: any, i: number) => `cls-${i}`,
      footerAttrs: (c: any, i: number) => ({ "data-test": `attr-${i}` }),
    };

    const { container } = render(
      <table>
        <tfoot>
          <tr>
            <FooterCell column={col} index={2} />
          </tr>
        </tfoot>
      </table>
    );

    const th = container.querySelector("th");
    expect(th?.className).toContain("cls-2");
    expect(th?.getAttribute("data-test")).toBe("attr-2");
  });

  it("calls footerFormatter and delegates footerEvents", () => {
    const onClick = jest.fn();
    const formatter = jest.fn().mockReturnValue(<span>Formatted</span>);
    const col = {
      dataField: "a",
      text: "A",
      footer: "Raw",
      footerFormatter: formatter,
      footerEvents: { onClick },
    };

    render(
      <table>
        <tfoot>
          <tr>
            <FooterCell column={col} index={0} />
          </tr>
        </tfoot>
      </table>
    );

    const th = screen.getByRole("columnheader");
    expect(screen.getByText("Formatted")).toBeInTheDocument();
    expect(formatter).toHaveBeenCalledWith(col, 0, { text: "Raw" });

    fireEvent.click(th);
    expect(onClick).toHaveBeenCalled();
  });

  it("handles missing footer, footer function with default empty columnData, and undefined index", () => {
    const footerFn = jest.fn((data, col, idx) => `items: ${data.length}, idx: ${idx}`);
    const classesFn = jest.fn((col, idx) => `cls-idx-${idx}`);
    const titleFn = jest.fn((col, idx) => `title-idx-${idx}`);
    const alignFn = jest.fn((col, idx) => "left");
    const styleFn = jest.fn(() => null);

    const col1 = {
      dataField: "a",
      text: "A",
      // footer not defined
      footerClasses: classesFn,
      footerTitle: titleFn,
      footerAlign: alignFn,
    };

    const col2 = {
      dataField: "b",
      text: "B",
      footer: footerFn,
    };

    const col3 = {
      dataField: "c",
      text: "C",
      footer: 12345 as any, // non-string non-function
      footerStyle: styleFn,
    };

    const { container } = render(
      <table>
        <tfoot>
          <tr>
            <FooterCell column={col1} />
            <FooterCell column={col2} />
            <FooterCell column={col3} index={0} />
          </tr>
        </tfoot>
      </table>
    );

    const cells = container.querySelectorAll("th");
    expect(cells[0].textContent).toBe("");
    expect(cells[0].className).toContain("cls-idx-0");
    expect(cells[0].getAttribute("title")).toBe("title-idx-0");
    expect(cells[0].style.textAlign).toBe("left");

    expect(cells[1].textContent).toBe("items: 0, idx: 0");
    expect(footerFn).toHaveBeenCalledWith([], col2, 0);

    expect(cells[2].textContent).toBe("");
    expect(styleFn).toHaveBeenCalled();
  });
});

