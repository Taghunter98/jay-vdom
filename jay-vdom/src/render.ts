import type { VElement, VNode, VAttrs } from "./types";

export type Rendered = HTMLElement | Text;

// Use a global symbol so other modules (diff.ts) can access the same property.
const LISTENERS = Symbol.for("vdom_listeners");

function isEventAttr(key: string): boolean {
  // Treat any attr that starts with "on" as a potential event handler:
  // onClick, onclick, oninput, etc.
  return key.startsWith("on");
}

function toEventName(attrKey: string): string {
  // Convert onClick -> click, onclick -> click
  return attrKey.slice(2).toLowerCase();
}

function attachListener($el: HTMLElement, attrKey: string, fn: EventListener) {
  const eventName = toEventName(attrKey);
  // ensure map exists on element
  let map: Map<string, EventListener> = ($el as any)[LISTENERS];
  if (!map) {
    map = new Map();
    ($el as any)[LISTENERS] = map;
  }
  // If a previous listener exists for this event, don't remove it here;
  // diff.ts will manage updates/removals. For initial render we just add.
  map.set(eventName, fn);
  $el.addEventListener(eventName, fn);
}

function renderElement(node: VElement): Rendered {
  const { tagName, attrs, children } = node;
  const $el = document.createElement(tagName);

  if (attrs) {
    for (const [k, v] of Object.entries(attrs as VAttrs)) {
      if (typeof v === "function" && isEventAttr(k)) {
        attachListener($el, k, v as EventListener);
      } else if (v === true)
        // boolean true -> set attribute without value (HTML boolean attribute)
        $el.setAttribute(k, "");
      else if (v === false || v == null) {
        // skip false or null/undefined (don't set)
      } else $el.setAttribute(k, String(v));
    }
  }

  if (children) {
    for (const child of children) {
      $el.appendChild(render(child));
    }
  }

  return $el;
}

export default function render(node: VNode): Rendered {
  if (typeof node === "string") return document.createTextNode(node);
  return renderElement(node);
}
