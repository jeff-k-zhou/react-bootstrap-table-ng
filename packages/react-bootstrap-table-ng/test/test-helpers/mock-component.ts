export const extendTo = (Base: any) => {
  const MockComponent = (props: any) => null;
  MockComponent.displayName = `MockComponent(${
    Base.displayName || Base.name || "Component"
  })`;
  return MockComponent;
};
