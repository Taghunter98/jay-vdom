import type { VAttrs, VNode } from "./types";
import render, { type Rendered } from "./render";

/**
 * Patch: takes a Rendered node and returns the new node (or undefined if removed).
 */
type Patch = (node: Rendered) => Rendered | undefined;

const LISTENERS = Symbol.for("vdom_listeners"); // must match render.ts symbol usage pattern

function isEventAttr(key: string): boolean {
  return /^on[A-Z]/.test(key) || /^on[a-z]/.test(key);
}

function toEventName(attrKey: string): string {
  return attrKey.slice(2).toLowerCase();
}

function diffAttrs(oldAttrs: VAttrs = {}, newAttrs: VAttrs = {}) {
  const patches: Array<(node: HTMLElement) => void> = [];

  // set/update attributes
  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push(($node: HTMLElement) => {
      if (typeof v === "function") {
        if (isEventAttr(k)) {
          const eventName = toEventName(k);
          const newFn = v as EventListener;
          const map: Map<string, EventListener> = (($node as any)[LISTENERS] ??=
            new Map());
          const prev = map.get(eventName);
          if (prev && prev !== newFn) {
            $node.removeEventListener(eventName, prev);
          }
          if (prev !== newFn) {
            $node.addEventListener(eventName, newFn);
            map.set(eventName, newFn);
          }
        }
        // else ignore non-on* function attrs
      } else {
        // primitive: set attribute
        $node.setAttribute(k, String(v));
      }
    });
  }

  // remove attributes that are not present in newAttrs
  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push(($node: HTMLElement) => {
        const oldVal = (oldAttrs as any)[k];
        if (typeof oldVal === "function" && isEventAttr(k)) {
          const eventName = toEventName(k);
          const map: Map<string, EventListener> = ($node as any)[LISTENERS];
          const prev = map?.get(eventName);
          if (prev) {
            $node.removeEventListener(eventName, prev);
            map.delete(eventName);
          }
        } else {
          $node.removeAttribute(k);
        }
      });
    }
  }

  return ($node: HTMLElement) => {
    for (const patch of patches) patch($node);
    return $node;
  };
}

function diffChildren(oldVChildren: VNode[] = [], newVChildren: VNode[] = []) {
  const childPatches: Patch[] = oldVChildren.map((oldVChild, i) =>
    diff(oldVChild, newVChildren[i])
  );

  const additionalPatches: Patch[] = newVChildren
    .slice(oldVChildren.length)
    .map(additionalVChild => {
      return ($parent: Rendered) => {
        // This function should be called with an HTMLElement parent in practice.
        if ($parent instanceof HTMLElement) {
          $parent.appendChild(render(additionalVChild));
        }
        return $parent;
      };
    });

  return ($parent: Rendered) => {
    // Apply each child patch to corresponding actual child node (which might be Text or HTMLElement)
    $parent.childNodes.forEach(($child, i) => {
      const patch = childPatches[i];
      if (patch) patch($child as Rendered);
    });

    for (const patch of additionalPatches) {
      patch($parent);
    }

    return $parent;
  };
}

export default function diff(oldVTree: VNode, newVTree?: VNode | null): Patch {
  if (newVTree == null) {
    return ($node: Rendered) => {
      $node.remove();
      return undefined;
    };
  }

  // handle text nodes
  if (typeof oldVTree === "string" || typeof newVTree === "string") {
    if (oldVTree !== newVTree) {
      return ($node: Rendered) => {
        const $newNode = render(newVTree);
        $node.replaceWith($newNode);
        return $newNode;
      };
    }
    return ($node: Rendered) => $node;
  }

  // different tag -> replace
  if (oldVTree.tagName !== newVTree.tagName) {
    return ($node: Rendered) => {
      const $newNode = render(newVTree);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  // same tag: patch attributes and children
  const patchAttrs = diffAttrs(oldVTree.attrs ?? {}, newVTree.attrs ?? {});
  const patchChildren = diffChildren(
    oldVTree.children ?? [],
    newVTree.children ?? []
  );

  return ($node: Rendered) => {
    if ($node instanceof HTMLElement) {
      patchAttrs($node);
      patchChildren($node);
    }
    return $node;
  };
}
