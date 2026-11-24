import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingOverlay from "../src/loading-overlay";
import Spinner from "../src/loading-overlay-spinner";

describe("LoadingOverlay Component", () => {
  it("renders with default spinner when active=true and spinner=true", () => {
    render(
      <LoadingOverlay active spinner text="Please wait">
        <div>Child content</div>
      </LoadingOverlay>
    );

    expect(screen.getByTestId("wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("overlay")).toBeInTheDocument();
    expect(screen.getAllByText("Please wait").length).toBeGreaterThan(0);
    expect(screen.getByTitle("Loading")).toBeInTheDocument();
  });

  it("renders custom spinner element", () => {
    render(
      <LoadingOverlay active spinner={<span data-testid="custom-spin">Spinning</span>}>
        <div>Child content</div>
      </LoadingOverlay>
    );

    expect(screen.getByTestId("custom-spin")).toBeInTheDocument();
  });

  it("handles onClick and onKeyDown (Enter and Space) on overlay", () => {
    const onClick = jest.fn();
    render(
      <LoadingOverlay active onClick={onClick} ariaLabel="Dismiss">
        <div>Content</div>
      </LoadingOverlay>
    );

    const overlay = screen.getByTestId("overlay");
    expect(overlay).toHaveAttribute("role", "button");

    fireEvent.click(overlay);
    expect(onClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(overlay, { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(overlay, { key: " " });
    expect(onClick).toHaveBeenCalledTimes(3);

    // Other key should not call onClick
    fireEvent.keyDown(overlay, { key: "Tab" });
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("supports styles as function and object", () => {
    const customWrapperStyle = jest.fn().mockReturnValue({ opacity: 0.8 });
    render(
      <LoadingOverlay
        active
        styles={{
          wrapper: customWrapperStyle,
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
        }}
      >
        <div>Content</div>
      </LoadingOverlay>
    );

    expect(customWrapperStyle).toHaveBeenCalled();
  });

  it("exposes wrapper via forwardRef", () => {
    const ref = React.createRef<any>();
    render(
      <LoadingOverlay ref={ref} active>
        <div>Content</div>
      </LoadingOverlay>
    );

    expect(ref.current?.wrapper).toBeDefined();
  });
});

describe("Spinner Component", () => {
  it("renders svg spinner with getStyles and cx", () => {
    const getStyles = jest.fn().mockReturnValue({ width: "50px" });
    const cx = jest.fn((...args: any[]) => args.join(" "));
    render(<Spinner getStyles={getStyles} cx={cx} />);

    expect(screen.getByTitle("Loading")).toBeInTheDocument();
    expect(getStyles).toHaveBeenCalledWith("spinner");
  });

  it("tests STYLES directly", () => {
    const STYLES = require("../src/loading-overlay-styles").default;
    expect(STYLES.overlay("entering", { fadeSpeed: 100 }).opacity).toBe(1);
    expect(STYLES.overlay("entered", { fadeSpeed: 100 }).opacity).toBe(1);
    expect(STYLES.overlay("exiting", { fadeSpeed: 100 }).opacity).toBe(0);
    expect(STYLES.overlay("exited", { fadeSpeed: 100 }).opacity).toBe(0);
    expect(STYLES.content()).toBeDefined();
    expect(STYLES.wrapper({})).toBeDefined();
    expect(STYLES.spinner()).toBeDefined();
  });
});
