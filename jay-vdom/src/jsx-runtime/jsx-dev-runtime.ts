import createElement from "../createElement";

/**
 * # JSX factory function.
 *
 * Factory for building JSX objects as createElement Jay-VDOM
 * elements.
 *
 * 'key': any removed for now
 */
export function jsx(type: any, props: any): any {
  if (typeof type === "function") {
    return type(props);
  }

  const { children, ...attrs } = props ?? {};
  const childNodes =
    children === undefined
      ? []
      : Array.isArray(children)
      ? children
      : [children];

  return createElement(type, attrs, childNodes);
}

export { jsx as jsxDEV, jsx as jsxs, jsx as Fragment };
