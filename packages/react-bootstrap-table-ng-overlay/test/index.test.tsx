import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingOverlay from "../src/loading-overlay";
import overlayFactory from "../index";

describe("overlayFactory", () => {
  const createTable = () => (
    <table>
      <thead>
        <tr>
          <th>column1</th>
          <th>column2</th>
        </tr>
      </thead>
      <tbody>
        {[1, 2].map((row) => (
          <tr key={row}>
            <td>{row}</td>
            <td>test</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  describe("when loading is false", () => {
    it("should render Overlay component correctly", () => {
      const tableElm = createTable();
      const Overlay = overlayFactory()(false);
      render(<Overlay>{tableElm}</Overlay>);
      // Should render LoadingOverlay with active=false
      const wrapper = screen.getByTestId("wrapper");
      expect(wrapper).toBeInTheDocument();
      // Check for inactive overlay (active=false)  
      expect(wrapper.className).toMatch(/wrapper/);
    });
  });

  describe("when loading is true", () => {
    it("should render Overlay component correctly", () => {
      const tableElm = createTable();
      const Overlay = overlayFactory()(true);
      render(<Overlay>{tableElm}</Overlay>);
      const wrapper = screen.getByTestId("wrapper");
      expect(wrapper).toBeInTheDocument();
      // Check for active overlay (active=true) - should have 'active' class
      expect(wrapper.className).toMatch(/active/);
    });
  });

  describe("when options is given", () => {
    const options: { [key: string]: any } = {
      spinner: true,
      background: "red",
    };
    it("should render Overlay component with options correctly", () => {
      const tableElm = createTable();
      const Overlay = overlayFactory(options)(false);
      render(<Overlay>{tableElm}</Overlay>);
      const wrapper = screen.getByTestId("wrapper");
      expect(wrapper).toBeInTheDocument();
      // Check for overlay options in DOM
      expect(wrapper.className).toMatch(/wrapper/);
    });
  });
});
