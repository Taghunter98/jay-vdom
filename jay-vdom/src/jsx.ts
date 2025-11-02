import type { GenericAttributes, VNode } from "./types";

/**
 * # JSX Types
 *
 * These are the mapped types that correspond to JSX HTML values.
 */
declare global {
  namespace JSX {
    type Element = VNode;

    interface IntrinsicElements {
      div: GenericAttributes;
      span: GenericAttributes;
      p: GenericAttributes;
      button: GenericAttributes;
      input: GenericAttributes;
      img: GenericAttributes;
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
