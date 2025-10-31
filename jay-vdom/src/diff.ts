import type { VAttrs, VNode } from "./types";
import { LISTENERS, render } from "./render";
import type { Rendered } from "./render";

/**
 * Patch: takes a Rendered node and returns the new node (or undefined if removed).
 */
type Patch = (node: Rendered) => Rendered | undefined;

/**
 * # isEventAttr
 *
 * Function asserts if a given attribute is an event if it inclues `on`.
 *
 * @param key Attribute key.
 * @returns Flag.
 */
export function isEventAttr(key: string): boolean {
  return /^on[A-Z]/.test(key) || /^on[a-z]/.test(key);
}

/**
 * # toEventName
 *
 * Function converts camelcase attributes to lowercase values for keys.
 *
 * @param attrKey Attribute key.
 * @returns Lowercase key.
 */
export function toEventName(attrKey: string): string {
  return attrKey.slice(2).toLowerCase();
}

/**
 * # diffAttrs
 *
 * Function performs diffing operations on an elements attributes.
 *
 * ## Behaviour
 *
 * - The new attributes are iteratively sorted and any events are wired into the patched
 *   array for checking.
 * - The new elements are checked against the old and any that are not present are
 *   removed.
 * - The array of patches is programatically called when needed, given an HTMLElement
 *   node.
 *
 * ## Example
 *
 * Two `VNodes` are compared.
 *
 * ```ts
 * const node1 = { tagName: "div", attrs: { id: "test" }, children: []}
 * const node2 = { tagName: "div", attrs: { id: "changed" }, children: []}
 *
 * // The nodes are run through the diff and new HTMLElement is returned.
 * const patchAttrs = diffAttrs(node1.attrs, node2.attrs);
 * ```
 *
 * @param oldAttrs Old element's attributes.
 * @param newAttrs New element's attributes.
 * @returns Function to programatically add the attributes.
 */
export function diffAttrs(oldAttrs: VAttrs = {}, newAttrs: VAttrs = {}) {
  const patches: Array<(node: HTMLElement) => void> = [];

  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push(($node: HTMLElement) => {
      if (typeof v === "function") {
        if (isEventAttr(k)) {
          const eventName = toEventName(k);
          const newFn = v as EventListener;
          const map: Map<string, EventListener> = (($node as any)[LISTENERS] ??=
            new Map());
          const prev = map.get(eventName);

          if (prev && prev !== newFn)
            $node.removeEventListener(eventName, prev);

          if (prev !== newFn) {
            $node.addEventListener(eventName, newFn);
            map.set(eventName, newFn);
          }
        }
      } else $node.setAttribute(k, String(v));
    });
  }

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
        } else $node.removeAttribute(k);
      });
    }
  }

  return ($node: HTMLElement) => {
    for (const patch of patches) patch($node);
    return $node;
  };
}

/**
 * # diffChildren
 *
 * Function performs diffing operations on an elements children.
 *
 * ## Behaviour
 *
 * - The childPatches array takes an array of `VNodes` from the old array and maps only
 *   the diffed element's to the patched array.
 * - For each child `diff` is called to provide a patch for that position.
 * - Additonal patches are built based off new elements that are further than the original
 *   length of the children array. Will return a function to patch for each child.
 * - Return the parent patcher function, which when invoked will iterate over all child
 *   nodes and apply the patch for each index.
 *
 * ## Example
 *
 * Given:
 * - `oldVChildren` = [A, B, C]
 * - `newVChildren` = [A', B', C', D, E]
 *
 * Patches:
 * - `childPatches` = [diff(A, A'), diff(B, B'), diff(C, C')]
 * - `additonalPatches` = [D, E]
 *
 * Applying:
 * - `children` = [A', B'. C'] + [D, E] = [A', B', C', D, E]
 *
 * @param oldVChildren
 * @param newVChildren
 * @returns
 */
export function diffChildren(
  oldVChildren: VNode[] = [],
  newVChildren: VNode[] = []
) {
  const childPatches: Patch[] = oldVChildren.map((oldVChild, i) =>
    diff(oldVChild, newVChildren[i])
  );

  const additionalPatches: Patch[] = newVChildren
    .slice(oldVChildren.length)
    .map(additionalVChild => {
      return ($parent: Rendered) => {
        if ($parent instanceof HTMLElement)
          $parent.appendChild(render(additionalVChild));
        return $parent;
      };
    });

  const removalCount = oldVChildren.length - newVChildren.length;

  return ($parent: Rendered) => {
    if (!($parent instanceof HTMLElement)) return $parent;

    const childNodes = Array.from($parent.childNodes);

    childNodes.forEach(($child, i) => {
      const patch = childPatches[i];
      if (patch) patch($child as Rendered);
    });

    if (removalCount > 0)
      for (let i = newVChildren.length; i < oldVChildren.length; i++) {
        const $child = childNodes[i];
        if ($child) $child.remove();
      }

    for (const patch of additionalPatches) patch($parent);

    return $parent;
  };
}

/**
 * # diff
 *
 * Function runs diffing operations on an old and new VNode and returns new VNode.
 *
 * ## Behaviour
 *
 * - If the new VTree is undefined, the node is removed and undefined is returned.
 * - If the old and new nodes are Text based, they are compared and replaced or returned.
 * - If the tag has changed, it can be assumed it's different and re rendered.
 * - Otherise its the same, so only the attributes and children are patched.
 *
 * ## Example
 *
 * ```ts
 * // New state is set the current root app
 * const newState = vApp();
 *
 * // Patch function contains the new VDOM tree
 * const patch = diff($currentState, newState);
 *
 * // Current rendered HTML can be patched with the new tree
 * const patched = patch($currentVDOM);
 * ```
 *
 * @param oldVTree Current VNode.
 * @param newVTree New VNode.
 * @returns Patched HTMLElement or undefined.
 */
export default function diff(oldVTree: VNode, newVTree?: VNode | null): Patch {
  if (newVTree == null) {
    return ($node: Rendered) => {
      $node.remove();
      return undefined;
    };
  }

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

  if (oldVTree.tagName !== newVTree.tagName) {
    return ($node: Rendered) => {
      const $newNode = render(newVTree);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

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
