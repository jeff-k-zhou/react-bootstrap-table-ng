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
  });
});
