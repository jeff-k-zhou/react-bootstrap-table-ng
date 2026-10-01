/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import LoadingOverlay from "../src/loading-overlay";
import Spinner from "../src/loading-overlay-spinner";
import STYLES from "../src/loading-overlay-styles";

describe("LoadingOverlay extra coverage", () => {
  it("renders overlay with role=button and ariaLabel from text node (Dismiss fallback)", () => {
    const onClick = jest.fn();
    // text is a React node (not a string) and ariaLabel is not provided
    // -> falls into the `"Dismiss loading overlay"` fallback
    render(
      <LoadingOverlay active onClick={onClick} text={<span>Loading...</span>}>
        <div>content</div>
      </LoadingOverlay>
    );
    const overlay = screen.getByTestId("overlay");
    expect(overlay).toHaveAttribute("role", "button");
    expect(overlay).toHaveAttribute("aria-label", "Dismiss loading overlay");
  });

  it("renders without onClick (no role=button on overlay)", () => {
    render(
      <LoadingOverlay active text="Loading" spinner>
        <div>content</div>
      </LoadingOverlay>
    );
    const overlay = screen.getByTestId("overlay");
    expect(overlay).not.toHaveAttribute("role");
  });

  it("getCx handles false/undefined names (renders empty string class)", () => {
    // Renders with active=false – one of the getCx names will be false (active && 'wrapper--active')
    const { container } = render(
      <LoadingOverlay active={false}>
        <div>content</div>
      </LoadingOverlay>
    );
    const wrapper = container.querySelector("[data-testid=wrapper]")!;
    // When active=false, classNamePrefix + false = empty string
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).not.toHaveClass("_loading_overlay_wrapper--active");
  });

  it("handles overlay onKeyDown with no onClick (does nothing)", () => {
    // No onClick provided – onKeyDown handler should silently no-op
    render(
      <LoadingOverlay active text="Loading">
        <div>content</div>
      </LoadingOverlay>
    );
    const overlay = screen.getByTestId("overlay");
    // No error should be thrown
    fireEvent.keyDown(overlay, { key: "Enter" });
    fireEvent.keyDown(overlay, { key: " " });
  });

  it("status region shows Loading text when active and text is a ReactNode", () => {
    render(
      <LoadingOverlay active text={<em>Processing</em>} spinner>
        <div>content</div>
      </LoadingOverlay>
    );
    // When text is not a string, status region shows "Loading"
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Loading");
  });

  it("status region is empty when not active", () => {
    render(
      <LoadingOverlay active={false} text="Loading">
        <div>content</div>
      </LoadingOverlay>
    );
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("");
  });

  it("executes CSSTransition addEndListener callback", () => {
    const rtg = require("react-transition-group");
    const Orig = rtg.CSSTransition;
    const spy = jest.spyOn(rtg, "CSSTransition").mockImplementation((props: any) => {
      if (typeof props.addEndListener === "function") {
        props.addEndListener(() => {});
      }
      return <Orig {...props} />;
    });

    render(
      <LoadingOverlay active text="Loading">
        <div>content</div>
      </LoadingOverlay>
    );

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});


