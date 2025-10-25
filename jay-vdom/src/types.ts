export interface VElement {
  tagName: string;
  attrs?: VAttrs;
  children?: VNode[];
}

export type VAttrValue = string | number | boolean | ((ev: Event) => void); // event handler allowed

export type VAttrs = Record<string, VAttrValue>;
export type VNode = VElement | string;
