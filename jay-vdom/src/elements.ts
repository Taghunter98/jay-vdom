import createElement from "./createElement";
import type { GenericAttributes, Img, VAttrs, VElement, VNode } from "./types";

type Values = Array<VNode | GenericAttributes>;

/** Type guard: is this value a VNode (string or VElement)? */
function isVNode(x: any): x is VNode {
  return (
    typeof x === "string" || (x && typeof x === "object" && "tagName" in x)
  );
}

/** Heuristic: is this object an attributes object (not a VNode, not an array, not a primitive)? */
function isAttrs(x: any): x is GenericAttributes {
  if (x == null) return false;
  if (typeof x === "string" || typeof x === "number" || typeof x === "boolean")
    return false;
  if (Array.isArray(x)) return false;
  if (isVNode(x)) return false;
  return typeof x === "object";
}

function buildGenericElement(
  tagName: string,
  elements: Array<VNode | GenericAttributes>
) {
  const attr = isAttrs(elements[0]) ? (elements[0] as VAttrs) : undefined;
  return createElement(
    tagName,
    attr,
    attr ? (elements.slice(1) as VNode[]) : (elements as VNode[])
  );
}

/**
 * # HTML div Element
 *
 * Element is used to encase other HTML elements.
 *
 * ## Example
 *
 * ```ts
 * div(
 *   { id: "my-div" },
 *   h1("Hello World!"),
 *   p("This is some text")
 * )
 * ```
 *
 * @param attributes
 * @param children
 * @returns
 */
export function div(...elements: Values): VElement {
  return buildGenericElement("div", elements);
}

export function button(...elements: Values): VElement {
  return buildGenericElement("button", elements);
}

export function img(...elements: Array<VNode | Img>): VElement {
  return buildGenericElement("img", elements);
}

export function p(...elements: Values): VElement {
  return buildGenericElement("p", elements);
}

export function h1(...elements: Values): VElement {
  return buildGenericElement("h1", elements);
}

export function h2(...elements: Values): VElement {
  return buildGenericElement("h2", elements);
}

export function h3(...elements: Values): VElement {
  return buildGenericElement("h3", elements);
}

export function h4(...elements: Values): VElement {
  return buildGenericElement("h4", elements);
}
