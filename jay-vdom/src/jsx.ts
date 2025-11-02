import type { GenericAttributes, Input, Img, VNode } from "./types";

declare global {
  namespace JSX {
    type Element = VNode;

    interface IntrinsicElements {
      div: GenericAttributes;
      span: GenericAttributes;
      p: GenericAttributes;
      button: GenericAttributes;
      input: Input;
      img: Img;
      h1: GenericAttributes;
      h2: GenericAttributes;
      h3: GenericAttributes;
      h4: GenericAttributes;
      main: GenericAttributes;
      header: GenericAttributes;
      footer: GenericAttributes;

      // Allow any valid HTML tag name as a fallback
      [elemName: string]: GenericAttributes;
    }
  }
}

export {};
