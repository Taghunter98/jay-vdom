declare namespace JSX {
  type Element = import("./types").VElement;
  interface IntrinsicElements {
    [elemName: string]: GenericAttributes;
  }
}
