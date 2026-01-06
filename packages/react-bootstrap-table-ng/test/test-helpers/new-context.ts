import { render } from "@testing-library/react";

export const shallowWithContext = (Element: any, context: any = {}) => {
  // If Element is a function that expects context, call it with context
  const elementToRender = typeof Element === "function" ? Element(context) : Element;
  return render(elementToRender);
};
