import React from "react";
import { render } from "@testing-library/react";
import standaloneAdapter from "../src/standalone-adapter";

const MockStandalone = (props: any) => {
  // Expose props for assertions
  return <div data-testid="mock-standalone" {...props} />;
};

const MockStandaloneWithAdapter = standaloneAdapter(MockStandalone);

describe("standaloneAdapter", () => {
  const props = {
    page: 2,
    sizePerPage: 10,
    name1: "A",
    name2: "B",
  };

  describe("render", () => {
    let rendered: ReturnType<typeof render>;
    let standalone: HTMLElement;

    beforeEach(() => {
      rendered = render(<MockStandaloneWithAdapter {...props} />);
      standalone = rendered.getByTestId("mock-standalone");
    });

    it("should render successfully", () => {
      expect(standalone).toBeInTheDocument();
    });

    it("should convert props.page as currPage to child component", () => {
      expect(standalone.getAttribute("currpage")).toEqual(props.page.toString());
    });

    it("should convert props.sizePerPage as currSizePerPage to child component", () => {
      expect(standalone.getAttribute("currsizeperpage")).toEqual(props.sizePerPage.toString());
    });

    it("should just pass remain props to child component", () => {
      // The rest props should be present as attributes
      expect(standalone.getAttribute("name1")).toEqual(props.name1);
      expect(standalone.getAttribute("name2")).toEqual(props.name2);
    });
  });
});
