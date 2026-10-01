import React from "react";
import { render, screen } from "@testing-library/react";
import Caption from "../src/caption";

describe("Caption", () => {
  it("returns null when no children are provided", () => {
    const { container } = render(<table><Caption /></table>);
    expect(container.querySelector("caption")).not.toBeInTheDocument();
  });

  it("renders standard caption when no bootstrap flag is set", () => {
    render(
      <table>
        <Caption>Test Caption</Caption>
      </table>
    );
    const caption = screen.getByText("Test Caption");
    expect(caption.tagName.toLowerCase()).toBe("caption");
    expect(caption.style.captionSide).toBe("");
  });

  it("renders caption with captionSide top when bootstrap4 is true", () => {
    render(
      <table>
        <Caption bootstrap4>Bootstrap 4 Caption</Caption>
      </table>
    );
    const caption = screen.getByText("Bootstrap 4 Caption");
    expect(caption.style.captionSide).toBe("top");
  });

  it("renders caption with captionSide top when bootstrap5 is true", () => {
    render(
      <table>
        <Caption bootstrap5>Bootstrap 5 Caption</Caption>
      </table>
    );
    const caption = screen.getByText("Bootstrap 5 Caption");
    expect(caption.style.captionSide).toBe("top");
  });
});
