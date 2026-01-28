/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

import TextEditor from "../src/text-editor";

describe("TextEditor", () => {
  const value = "test";

  it("should render TextEditor correctly", () => {
    render(<TextEditor defaultValue={value} onUpdate={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("form-control editor edit-text");
  });

  describe("when className prop defined", () => {
    const className = "test-class";

    it("should render correct custom classname", () => {
      render(
        <TextEditor
          defaultValue={value}
          className={className}
          onUpdate={() => {}}
        />
      );
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass(className);
    });
  });
});
