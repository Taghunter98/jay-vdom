import type { VAttrs, VNode, VElement } from "./types";

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
