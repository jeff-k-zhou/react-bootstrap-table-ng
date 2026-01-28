import React from "react";
import { render } from "@testing-library/react";
import paginationListAdapter from "../src/pagination-list-adapter";

const MockComponent = () => null;

const PaginationListAdapter = paginationListAdapter(MockComponent);

describe("paginationListAdapter", () => {
  const props = {
    totalPages: 10,
    lastPage: 10,
    pageButtonRenderer: jest.fn(),
    onPageChange: jest.fn(),
  };

  describe("render", () => {
    it("should render successfully", () => {
      // Render the adapter and check that MockComponent is rendered with correct props
      const { container } = render(<PaginationListAdapter {...props} />);
      // Since MockComponent renders null, we can't query the DOM, so we check via a spy
      // Instead, we can wrap MockComponent to capture props
      let receivedProps: any = null;
      const SpyComponent = (p: any) => {
        receivedProps = p;
        return null;
      };
      const AdapterWithSpy = paginationListAdapter(SpyComponent);
      render(<AdapterWithSpy {...props} />);
      expect(receivedProps).toBeDefined();
      expect(receivedProps.pages).toBeDefined();
      expect(receivedProps.pageButtonRenderer).toBeDefined();
      expect(receivedProps.onPageChange).toBeDefined();
    });
  });
});
