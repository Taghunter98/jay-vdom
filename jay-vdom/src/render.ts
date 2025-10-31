import { beginRenderFor, endRenderFor } from "./hooks";
import type { VElement, VNode, VAttrs } from "./types";

export type Rendered = HTMLElement | Text;

// Global listeners symbol - tracks current vdom listeners.
export const LISTENERS = Symbol.for("vdom_listeners");

/**
 * # isEventAttr
 *
 * Function asserts if an attribute starts with 'on' the event keyword.
 *
 * @param key Attribute key.
 * @returns Status.
 */
function isEventAttr(key: string): boolean {
  return key.startsWith("on");
}

/**
 * # attrKey
 *
 * Function simply converts listeners to lowercase.
 *
 * @param attrKey Attribute key.
 * @returns Lowercase attribute name.
 */
function toEventName(attrKey: string): string {
  return attrKey.slice(2).toLowerCase();
}

/**
 * # attachListener
 *
 * Function handles attaching event listeners to the new HTMLElement.
 *
 * ## Behaviour
 *
 * - The listener is checked in the global `vdom_listeners` map, given it doesn't exist
 *   a new map is created.
 * - The event name is set as the key with the function.
 * - The event listener is wired to the given HTMLElement.
 *
 * ## Example
 *
 * ```ts
 * const vnode = createElement("button", { onClick: handler }, []);
 *
 * // Node attribute value is a function so the listner is attached to new element
 * const $el = document.createElement(tagName);
 *
 * for (const [k, v] of Object.entries(attrs as VAttrs)) {
 *   if (typeof v === "function" && isEventAttr(k)) {
 *     attachListener($el, k, v as EventListener);
 *   }
 * }
 * ```
 *
 * @param $el HTMLElement to attach listener to.
 * @param attrKey Attribute key e.g onClick, onInput.
 * @param fn Attribute function to wire as listener.
 */
function attachListener($el: HTMLElement, attrKey: string, fn: EventListener) {
  const eventName = toEventName(attrKey);
  let map: Map<string, EventListener> = ($el as any)[LISTENERS];
  if (!map) {
    map = new Map();
    ($el as any)[LISTENERS] = map;
  }

  map.set(eventName, fn);
  $el.addEventListener(eventName, fn);
}

/**
 * # renderElement
 *
 * Function renders a DOM element from a VElement.
 *
 * ## Behaviour
 *
 * - VNode is destructured and new HTMLElement is created.
 * - If the VElement has attributes, the attributes are set.
 * - First listeners are attached then regular attributes.
 * - If there are child elements then each is rendered and appended to the HTMLElement.
 * - New Element is then returned.
 *
 * ## Example
 *
 * ```ts
 * const virNode = createElement(
 *     "div",
 *     {
 *       id: "app",
 *     },
 *     ["Hello World"]
 *   );
 * }
 *
 * const domNode = renderElement(virNode);
 * ```
 *
 * @param node VDOM node.
 * @returns HTMLElement or Text Node.
 */
export function renderElement(node: VElement): Rendered {
  const { tagName, attrs, children } = node;
  const $el = document.createElement(tagName);

  if (attrs) {
    for (const [k, v] of Object.entries(attrs as VAttrs)) {
      if (typeof v === "function" && isEventAttr(k))
        attachListener($el, k, v as EventListener);
      else if (v === true) $el.setAttribute(k, "");
      else if (v === false || v == null) continue;
      else $el.setAttribute(k, String(v));
    }
  }

  if (children) for (const child of children) $el.appendChild(render(child));
  return $el;
}

/**
 * # render
 *
 * Wrapper function handles text node and regular DOM node rendering.
 *
 * @param node VNode to render.
 * @returns DOM node.
 */
export function render(node: VNode): Rendered {
  if (typeof node === "string") return document.createTextNode(node);
  return renderElement(node);
}

/**
 * # renderComponent
 *
 * Function renders a component
 *
 * @param fn
 * @param args
 * @returns
 */
export function renderComponent<T extends any[]>(
  fn: (...args: T) => VNode,
  ...args: T
): VNode {
  const name = fn.name;
  beginRenderFor(name);
  try {
    return fn(...args);
  } finally {
    endRenderFor();
  }
}
