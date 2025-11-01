import type { GenericAttributes, Img, Input } from "./types";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: GenericAttributes;
      span: GenericAttributes;
      p: GenericAttributes;
      section: GenericAttributes;
      article: GenericAttributes;
      header: GenericAttributes;
      footer: GenericAttributes;
      h1: GenericAttributes;
      h2: GenericAttributes;
      h3: GenericAttributes;
      h4: GenericAttributes;
      h5: GenericAttributes;
      h6: GenericAttributes;
      button: GenericAttributes;
      input: Input;
      img: Img;
      a: GenericAttributes;
      [elemName: string]: GenericAttributes;
    }
  }
}
