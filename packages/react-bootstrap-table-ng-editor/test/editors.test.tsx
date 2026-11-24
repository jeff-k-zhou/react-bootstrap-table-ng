import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CheckBoxEditor from "../src/checkbox-editor";
import DropDownEditor from "../src/dropdown-editor";
import TextAreaEditor from "../src/textarea-editor";
import DateEditor from "../src/date-editor";

describe("CheckBoxEditor", () => {
  it("renders with default props", () => {
    const ref = React.createRef<any>();
    render(<CheckBoxEditor ref={ref} />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.checked).toBe(false);
    expect(ref.current?.getValue()).toBe("off");
  });

  it("handles checked default value and custom on:off value", () => {
    const ref = React.createRef<any>();
    render(
      <CheckBoxEditor
        ref={ref}
        defaultValue="yes"
        value="yes:no"
        className="custom-chk"
      />
    );
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input.checked).toBe(true);
    expect(input.className).toContain("custom-chk");
    expect(ref.current?.getValue()).toBe("yes");
  });

  it("handles change event and calls onChange and didMount", () => {
    const didMount = jest.fn();
    const onChange = jest.fn();
    const ref = React.createRef<any>();
    render(
      <CheckBoxEditor
        ref={ref}
        didMount={didMount}
        onChange={onChange}
      />
    );
    expect(didMount).toHaveBeenCalled();

    const input = screen.getByRole("checkbox") as HTMLInputElement;
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalled();
    expect(input.checked).toBe(true);
    expect(ref.current?.getValue()).toBe("on");
  });

  it("handles click when onChange is not provided", () => {
    render(<CheckBoxEditor defaultValue={undefined} />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    fireEvent.click(input);
    expect(input.checked).toBe(true);
  });

  it("handles null defaultValue to test nullish coalescing fallback", () => {
    render(<CheckBoxEditor defaultValue={null as any} />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input.checked).toBe(false);
  });
});

describe("DropDownEditor", () => {
  const options = [
    { label: "Option A", value: "A" },
    { label: "Option B", value: "B" },
  ];

  it("renders options and defaultValue", () => {
    const ref = React.createRef<any>();
    const didMount = jest.fn();
    render(
      <DropDownEditor
        ref={ref}
        row={{ id: 1 }}
        column={{ dataField: "opt" }}
        defaultValue="B"
        options={options}
        didMount={didMount}
        className="custom-drop"
      />
    );
    expect(didMount).toHaveBeenCalled();
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("B");
    expect(select.className).toContain("custom-drop");
    expect(ref.current?.getValue()).toBe("B");
  });

  it("supports getOptions returning options synchronously", () => {
    const getOptions = jest.fn().mockReturnValue([
      { label: "Sync 1", value: "S1" },
    ]);
    render(
      <DropDownEditor
        row={{ id: 1 }}
        column={{ dataField: "opt" }}
        getOptions={getOptions}
      />
    );
    expect(getOptions).toHaveBeenCalled();
    expect(screen.getByText("Sync 1")).toBeInTheDocument();
  });

  it("supports getOptions via setOptions callback", () => {
    const getOptions = jest.fn((setOptions) => {
      setOptions([{ label: "Async 1", value: "A1" }]);
    });
    render(
      <DropDownEditor
        row={{ id: 1 }}
        column={{ dataField: "opt" }}
        getOptions={getOptions}
      />
    );
    expect(getOptions).toHaveBeenCalled();
    expect(screen.getByText("Async 1")).toBeInTheDocument();
  });

  it("handles null ref during mount", () => {
    const fakeRef = {
      get current() { return null; },
      set current(_) {}
    };
    const spy = jest.spyOn(React, "useRef").mockReturnValueOnce(fakeRef as any);
    render(
      <DropDownEditor
        row={{ id: 1 }}
        column={{ dataField: "opt" }}
      />
    );
    spy.mockRestore();
  });
});

describe("TextAreaEditor", () => {
  it("renders with defaultValue and calls didMount and autoSelectText", () => {
    const ref = React.createRef<any>();
    const didMount = jest.fn();
    const onKeyDown = jest.fn();
    render(
      <TextAreaEditor
        ref={ref}
        defaultValue="hello"
        didMount={didMount}
        autoSelectText={true}
        onKeyDown={onKeyDown}
        className="custom-txt"
      />
    );
    expect(didMount).toHaveBeenCalled();
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.value).toBe("hello");
    expect(textarea.className).toContain("custom-txt");
    expect(ref.current?.getValue()).toBe("hello");

    // Enter without shift does not trigger onKeyDown
    fireEvent.keyDown(textarea, { keyCode: 13, shiftKey: false });
    expect(onKeyDown).not.toHaveBeenCalled();

    // Enter with shift triggers onKeyDown
    fireEvent.keyDown(textarea, { keyCode: 13, shiftKey: true });
    expect(onKeyDown).toHaveBeenCalledTimes(1);

    // Other key triggers onKeyDown
    fireEvent.keyDown(textarea, { keyCode: 65 });
    expect(onKeyDown).toHaveBeenCalledTimes(2);
  });

  it("renders with default props and handles keydown without onKeyDown prop", () => {
    render(<TextAreaEditor />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.value).toBe("");
    fireEvent.keyDown(textarea, { keyCode: 65 });
  });

  it("handles null ref during mount", () => {
    const fakeRef = {
      get current() { return null; },
      set current(_) {}
    };
    const spy = jest.spyOn(React, "useRef").mockReturnValueOnce(fakeRef as any);
    render(<TextAreaEditor />);
    spy.mockRestore();
  });
});

describe("DateEditor", () => {
  it("renders date input with defaultValue and calls didMount", () => {
    const ref = React.createRef<any>();
    const didMount = jest.fn();
    const { container } = render(
      <DateEditor
        ref={ref}
        defaultValue="2026-05-15"
        didMount={didMount}
        className="custom-date"
      />
    );
    expect(didMount).toHaveBeenCalled();
    const input = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.className).toContain("custom-date");
    expect(ref.current?.getValue()).toBeDefined();
  });

  it("renders date input with default props", () => {
    const ref = React.createRef<any>();
    const { container } = render(<DateEditor ref={ref} />);
    const input = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(ref.current?.getValue()).toBe("");
  });

  it("handles null ref during mount", () => {
    const fakeRef = {
      get current() { return null; },
      set current(_) {}
    };
    const spy = jest.spyOn(React, "useRef").mockReturnValueOnce(fakeRef as any);
    render(<DateEditor />);
    spy.mockRestore();
  });
});

