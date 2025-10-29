// jsx.d.ts
import { GenericAttributes } from "./types";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: GenericAttributes;
      h1: GenericAttributes;
      button: GenericAttributes & { type?: string };
      img: GenericAttributes & { src: string; alt?: string };
    }
  }
}
