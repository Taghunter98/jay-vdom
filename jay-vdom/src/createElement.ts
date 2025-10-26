import type { VAttrs, VNode, VElement } from "./types";

/**
 * # createElement
 *
 * Builder function builds a VElement.
 *
 * ## Example
 *
 * ```ts
 * createElement(
 *   "div",
 *   {
 *     id: "app",
 *     style: "font-family: sans-serif",
 *   },
 *   [renderComponent(Index)]
 * );
 * ```
 *
 * @param tagName Element name e.g div.
 * @param attrs Element attributes e.g class, id.
 * @param children Element children, VNode list.
 * @returns VElement.
 */
export default function createElement(
  tagName: string,
  attrs?: VAttrs,
  children?: VNode[]
): VElement {
  return {
    tagName,
    attrs: attrs ?? {},
    children: children ?? [],
  };
}
