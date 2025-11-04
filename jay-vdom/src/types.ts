/**
 * # VElement
 *
 * Represents a virtual HTML element.
 *
 * ## Data
 *
 * - tagName `string` the element's tagname e.g div.
 * - attrs? `VAttrs` the element's attributes.
 * - children? `VNode[]` child elements.
 */
export interface VElement {
  tagName: string;
  attrs?: VAttrs;
  children?: VNode[];
}

/**
 * # VAttrValue
 *
 * Represents the attribute values that can be used.
 */
export type VAttrValue =
  | string
  | number
  | boolean
  | ((ev: Event) => void)
  | VNode
  | VNode[];

/**
 * # VAttrs
 *
 * Represents the attribute key, value pairs.
 */
export type VAttrs = Record<string, VAttrValue>;

/**
 * # VNode
 *
 * Represents a VDOM node, currently accepts HTMLElements and Text nodes.
 */
export type VNode = VElement | string;

/**
 * # Link
 *
 * Represents a Jay-VDOM Link element, takes an additonal key for identification.
 */
export type LinkType = { key: string; attrs?: VAttrs; element: VElement };

export interface VirtualInput extends GenericAttributes {
  bind?: (v: string) => void;
}

export interface VirtualEach<T> extends GenericAttributes {
  values: T[] | ArrayLike<T> | Record<string, T>;
  layout: (value: T, index: number) => VNode;
  as?: keyof HTMLElementTagNameMap;
}

export interface VirtualIf {
  when: boolean;
  then: VNode;
  else?: VNode | VirtualIf;
}

export interface GenericAttributes extends VEventHandlers {
  /**
   * # id
   *
   * Identifier for the HTML element.
   *
   * ## Example
   *
   * ```tsx
   * <p id="p-2">Hello World!</p>
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
   * ```tsx
   * <input value={value} />
   * ```
   */
  value?: string;

  /**
   * # class
   *
   * CSS classes value for the element.
   *
   * ```tsx
   * <p class="font-bold text-base"></p>
   * ```
   */
  class?: string;

  /**
   * # style
   *
   * CSS style value for the element.
   *
   * ```tsx
   * <p style="color: red; font-size: 14pt;"></p>
   * ```
   */
  style?: string;

  /**
   * # type
   *
   * Type value for the element.
   *
   * ```tsx
   * <button type="button">Click</button>
   * <input type="text" />
   * ```
   */
  type?: string;

  /**
   * # placeholder
   *
   * Placeholder text for the input element.
   *
   * ```tsx
   * <input placeholder="Enter Email" />
   * ```
   */
  placeholder?: string;

  /**
   * # src
   *
   * Source url or directory for the given image.
   *
   * ```tsx
   * <img src="../images/pic.jpg" />
   * ```
   */
  src?: string;

  /**
   * # children
   *
   * Attribute allows for additonal children to be nested.
   *
   * ```tsx
   * function CustomElement({ children }: { children: VNode[] }) {
   *   return(
   *     <div>{children}</div>
   *   )
   * }
   * ```
   * Then in another component, the children can be added.
   * ```tsx
   * <CustomElement>
   *   <p>Nested child 1</p>
   *   <p>Nested child 2</p>
   * </CustomElement>
   * ```
   */
  children?: VNode | VNode[] | string | number | boolean | null | undefined;
}

/**
 * Global namespace for JSX - links to genericAttributes
 */
declare global {
  namespace JSX {
    interface ElementChildrenAttribute {
      children: {};
    }
  }
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
   * ```tsx
   * <button onClick={
   *   (e: Event) => console.log(e.target.value)
   * } >
   *   Click
   * </button>
   * ```
   */
  onClick?: ClickHandler;

  /**
   * # onPointer
   *
   * Called when the cursor is moved.
   *
   * ```tsx
   * <div onPointerMove={ (e) => console.log(e.clientX) }><div>
   * ```
   */
  onPointerMove?: PointerHandler;

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
