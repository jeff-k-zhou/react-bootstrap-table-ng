import React from "react";
import { render } from "@testing-library/react";
import paginationTotalAdapter from "../src/pagination-total-adapter";

const MockComponent = () => null;

const PaginationTotalAdapter = paginationTotalAdapter(MockComponent);

describe("paginationTotalAdapter", () => {
  const props = {
    dataSize: 20,
    currPage: 1,
    currSizePerPage: 10,
    paginationTotalRenderer: jest.fn(),
  };

  describe("render", () => {
    it("should render successfully", () => {
      let receivedProps: any = null;
      const SpyComponent = (p: any) => {
        receivedProps = p;
        return null;
      };
      const AdapterWithSpy = paginationTotalAdapter(SpyComponent);
      render(<AdapterWithSpy {...props} />);
      expect(receivedProps).toBeDefined();
      expect(receivedProps.from).toBeDefined();
      expect(receivedProps.to).toBeDefined();
      expect(receivedProps.dataSize).toEqual(props.dataSize);
      expect(receivedProps.paginationTotalRenderer).toEqual(props.paginationTotalRenderer);
    });

    it("should execute default onPageChange callback when triggered from usePagination", () => {
      const usePagMod = require("../src/hooks/usePagination");
      const spy = jest.spyOn(usePagMod, "usePagination").mockImplementation((p: any) => {
        if (typeof p.onPageChange === "function") {
          p.onPageChange(2, 10);
        }
        return { fromTo: [1, 10] } as any;
      });

      const SpyComponent = () => null;
      const Adapter = paginationTotalAdapter(SpyComponent);
      render(<Adapter currPage={1} currSizePerPage={10} dataSize={20} pageStartIndex={1} />);

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});

