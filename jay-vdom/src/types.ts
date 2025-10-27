export interface VElement {
  tagName: string;
  attrs?: VAttrs;
  children?: VNode[];
}

export type VAttrValue = string | number | boolean | ((ev: Event) => void);
export type VAttrs = Record<string, VAttrValue>;
export type VNode = VElement | string;

export interface Img extends GenericAttributes {
  /**
   * # src
   *
   * Source url or directory for the given image.
   *
   * ```ts
   * img({ src: "../images/pic.jpg" })
   * ```
   */
  src?: string;
}

export interface GenericAttributes extends VEventHandlers {
  /**
   * # id
   *
   * Identifier for the HTML element.
   *
   * ## Example
   *
   * ```ts
   * p({ id: "p-2"}, "Hello World!")
   * ```
   */
  id?: string;

  /**
   * # value
   *
   * Value of the HTML element.
   *
   * ## Example
   *
   * ```ts
   * input({ value: })
   * ```
   */
  value?: string;
  class?: string;
  style?: string;
  type?: string;
}

/**
 * Specific event callback types (use DOM types from lib.dom).
 * These are precise so hover shows the exact event parameter.
 */
export type ClickHandler = (event: MouseEvent) => void;
export type PointerHandler = (event: PointerEvent) => void;
export type InputHandler = (event: InputEvent) => void;
export type DragHandler = (event: DragEvent) => void;

/**
 * Event handler props. Each property is documented so the editor displays
 * the comment when you hover over the prop (and the value signature).
 */
export interface VEventHandlers {
  /**
   * # onClick
   *
   * Called when the element is clicked.
   *
   * Example:
   * ```ts
   * onClick: (e: Event) => { console.log(e.target.value); }
   * ```
   */
  onClick?: ClickHandler;

  /**
   * # onPointer
   *
   * Pointer event handler. Useful for pointer-specific properties (pressure, pointerType).
   */
  onPointer?: PointerHandler;

  /**
   * # onInput
   *
   * Called when the value of an input/textarea changes.
   * Receives an InputEvent (note: use `target` to access the value).
   *
   * Example:
   * ```ts
   * onInput: (e) => { const v = (e.target as HTMLInputElement).value; }
   * ```
   */
  onInput?: InputHandler;

  /**
   * # onDrag
   *
   * Drag event handler.
   */
  onDrag?: DragHandler;

  /**
   * # onDblClick
   *
   * Double click handler.
   */
  onDblClick?: ClickHandler;
}
