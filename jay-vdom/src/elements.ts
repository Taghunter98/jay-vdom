import createElement from "./createElement";
import type {
  GenericAttributes,
  Img,
  Input,
  VAttrs,
  VElement,
  VNode,
} from "./types";

export type Values = Array<VNode | GenericAttributes>;

/**
 * # isVNode
 *
 * Function asserts whether a given element is a `VNode` element.
 *
 * @param node VDOM node.
 * @returns Status flag.
 */
function isVNode(node: any): node is VNode {
  return (
    typeof node === "string" ||
    (node && typeof node === "object" && "tagName" in node)
  );
}

/**
 * # isAttrs
 *
 * Function asserts whether a given element is a `VAttrs` element.
 *
 * @param node VDOM node.
 * @returns Status flag.
 */
function isAttrs(node: any): node is GenericAttributes {
  if (node == null) return false;
  if (
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "boolean"
  )
    return false;
  if (Array.isArray(node)) return false;
  if (isVNode(node)) return false;
  return typeof node === "object";
}

/**
 * # buildGenericElement
 *
 * Function creates a generic HTML element, with optional attributes as the
 * first parameter.
 *
 * @param tagName Element name.
 * @param elements Array of VNodes with optional attributes.
 * @returns VElement.
 */
function buildGenericElement(
  tagName: string,
  elements: Array<VNode | GenericAttributes>
): VElement {
  const attr = isAttrs(elements[0]) ? (elements[0] as VAttrs) : undefined;
  return createElement(
    tagName,
    attr,
    attr ? (elements.slice(1) as VNode[]) : (elements as VNode[])
  );
}

/**
 * # Link
 *
 * A Jay-VDOM element that builds a link with a given key.
 *
 * Use with a `Router` to create an SPA.
 *
 * ## Example
 *
 * ```ts
 * Router(
 *   { style: "display: flex; gap: 20px" },
 *   Link("Cool Counter", { class: "link-style" }, Counter()),
 *   Link("Gif", { class: "link-style" }, Gif()),
 *   Link("Test Name", { class: "link-style" }, Name("TESTING"))
 * )
 * ```
 *
 * @param key
 * @param component
 * @returns
 */
export function Link(
  props: { dataKey: string; class?: string; children: VNode | VNode[] } & VAttrs
): VNode {
  const { dataKey, children, ...attrs } = props;
  const kids = Array.isArray(children) ? children : [children];

  return createElement("div", { ...attrs, "data-key": dataKey }, kids);
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
 * @param elements Child elements.
 * @returns VElement.
 */
export function div(...elements: Values): VElement {
  return buildGenericElement("div", elements);
}

/**
 * # HTML button Element
 *
 * Element is used to omit click events.
 *
 * ## Example
 *
 * ```ts
 * button(
 *   { onClick: () => console.log("Clicked") },
 *   "Click Me"
 * )
 * ```
 *
 * @param elements Child elements.
 * @returns VElement.
 */
export function button(...elements: Values): VElement {
  return buildGenericElement("button", elements);
}

/**
 * # HTML input Element
 *
 * Element is used to omit input events.
 *
 * ## Example
 *
 * ```ts
 * function inputHandler(e: InputEvent) {
 *   const data = (e.target as Element).value;
 *   console.log(data);
 * }
 *
 * input(
 *   {
 *     onInput: inputHandler)
 *     placeholder: "Enter name"
 *   },
 * )
 * ```
 *
 * @param elements Child elements.
 * @returns VElement.
 */
export function input(...elements: Array<VNode | Input>): VElement {
  return buildGenericElement("input", elements);
}

/**
 * # HTML anchor Element
 *
 * Element is used to nest hyperlinks in text.
 *
 * ## Example
 *
 * ```ts
 * a(
 *   { href: "https://jayframework.dev") },
 *   "Documentation"
 * )
 * ```
 *
 * @param elements Child elements.
 * @returns VElement.
 */
export function a(...elements: Values): VElement {
  return buildGenericElement("a", elements);
}

/**
 * # HTML img Element
 *
 * Element displays images with various formats.
 *
 * ## Example
 *
 * ```ts
 * img(
 *   { src: "/images/dog.jpg" },
 * )
 * ```
 *
 * @param elements Child elements.
 * @returns VElement.
 */
export function img(...elements: Array<VNode | Img>): VElement {
  return buildGenericElement("img", elements);
}

/**
 * # HTML p Element
 *
 * Element displays paragraph text.
 *
 * ## Example
 *
 * ```ts
 * p("Hello World!")
 * ```
 *
 * @param elements Child elements.
 * @returns VElement.
 */
export function p(...elements: Values): VElement {
  return buildGenericElement("p", elements);
}

/**
 * # HTML h1 Element
 *
 * Element displays header 1 elements.
 *
 * ## Example
 *
 * ```ts
 * h1("Hello World!")
 * ```
 *
 * @param elements Child elements.
 * @returns VElement.
 */
export function h1(...elements: Values): VElement {
  return buildGenericElement("h1", elements);
}

/**
 * # HTML h2 Element
 *
 * Element displays header 2 elements.
 *
 * ## Example
 *
 * ```ts
 * h2("Hello World!")
 * ```
 *
 * @param elements Child elements.
 * @returns VElement.
 */
export function h2(...elements: Values): VElement {
  return buildGenericElement("h2", elements);
}

/**
 * # HTML h3 Element
 *
 * Element displays header 3 elements.
 *
 * ## Example
 *
 * ```ts
 * h3("Hello World!")
 * ```
 *
 * @param elements Child elements.
 * @returns VElement.
 */
export function h3(...elements: Values): VElement {
  return buildGenericElement("h3", elements);
}

/**
 * # HTML h4 Element
 *
 * Element displays header 4 elements.
 *
 * ## Example
 *
 * ```ts
 * h4("Hello World!")
 * ```
 *
 * @param elements Child elements.
 * @returns VElement.
 */
export function h4(...elements: Values): VElement {
  return buildGenericElement("h4", elements);
}
