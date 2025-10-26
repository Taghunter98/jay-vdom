import { update } from "./main";

const componentStates = new Map<string, any>();
let currentComponentId: string | null = null;
let currentHookIndex = 0;
let renderCounter = 0;

/**
 * # beginRenderFor
 *
 * Function starts the rendering process for a given component.
 *
 * ## Example
 *
 * ```ts
 * // Start rendering the root component
 * beginRenderFor("AppRoot");
 * ```
 *
 * @param component Name of component to render.
 * @returns The component ID.
 */
export function beginRenderFor(component: string) {
  currentComponentId = `${component}#${renderCounter}`;
  currentHookIndex = 0;
  return currentComponentId;
}

/**
 * # endRenderFor
 *
 * Function resets the rendering process by nullifying the current component ID.
 *
 * ```ts
 * beginRenderFor("AppRoot");
 * try {
 *   // Render and mount element
 * } finally {
 *   endRenderFor();
 * }
 * ```
 */
export function endRenderFor() {
  currentComponentId = null;
}

/**
 * # resetRenderCounter
 *
 * Function resets the render counter before rendering again.
 *
 * This is to ensure that hook keys are consistently generated.
 *
 * ```ts
 * resetRenderCounter();
 * beginRenderFor("AppRoot");
 * ```
 */
export function resetRenderCounter() {
  renderCounter = 0;
}

/**
 * # use
 *
 * @param initial
 * @returns
 */
export function state<T>(
  initial: T | (() => T)
): [T, (next: T | ((prev: T) => T)) => void] {
  if (!currentComponentId)
    throw new Error("State must be called during component rendering");

  const hookKey = `${currentComponentId}:${currentHookIndex++}`;

  if (!componentStates.has(hookKey)) {
    const init =
      typeof initial === "function" ? (initial as () => T)() : initial;
    componentStates.set(hookKey, init);
  }

  const getter = () => componentStates.get(hookKey) as T;
  const setter = (next: T | ((prev: T) => T)) => {
    const prev = componentStates.get(hookKey) as T;
    const value =
      typeof next === "function" ? (next as (p: T) => T)(prev) : next;
    componentStates.set(hookKey, value);
    update();
  };

  return [getter(), setter];
}
