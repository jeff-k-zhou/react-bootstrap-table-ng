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

  it("handles autoSelectText, didMount, ref.getValue and default props", () => {
    const didMount = jest.fn();
    const ref = React.createRef<any>();
    render(
      <TextEditor
        ref={ref}
        autoSelectText={true}
        didMount={didMount}
        onUpdate={() => {}}
      />
    );
    expect(didMount).toHaveBeenCalledTimes(1);
    expect(ref.current?.getValue()).toBe("");
  });

  it("handles when inputRef.current is null during mount", () => {
    const fakeRef = {
      get current() { return null; },
      set current(_) {}
    };
    const spy = jest.spyOn(React, "useRef").mockReturnValueOnce(fakeRef as any);
    render(<TextEditor onUpdate={() => {}} />);
    spy.mockRestore();
  });
});


