import createElement from "../../createElement";

export function jsx(type: any, props: any, key?: any) {
  if (typeof type === "function") {
    const result = type(props ?? {});
    if (!result)
      throw new Error(`Component ${type.name} did not return a VElement`);
    return result;
  }

  const { children, ...attrs } = props ?? {};

  const childNodes = (
    children === undefined
      ? []
      : Array.isArray(children)
      ? children
      : [children]
  ).filter(Boolean);

  return createElement(type, attrs, childNodes);
}

export { jsx as jsxs, jsx as Fragment, jsx as jsxDEV };
