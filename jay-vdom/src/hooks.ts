import { update } from "./main";

interface Effect {
  fn: () => void | (() => void);
  deps?: any[];
  cleanup?: () => void;
}

export const componentStates = new Map<string, any>();
export const componentEffects = new Map<string, Map<string, Effect>>();
let currentComponentId: string | null = null;
let currentHookIndex = 0;
export let renderCounter = 0;

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
  if (currentComponentId) {
    const effects = componentEffects.get(currentComponentId);
    effects?.forEach(eff => eff);
  }
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

function buildHookKey(): string {
  return `${currentComponentId}:${currentHookIndex++}`;
}

/**
 * # state
 *
 * Hook allows for a variable to persist in component's state.
 *
 * ## Throws Errors
 *
 * - If run before the component is rendered.
 *
 * ## Examples
 *
 * Setting and updating state variable.
 *
 * ```tsx
 * function Counter() {
 *   const [count, setCount] = state<number>(0);
 *
 *    return(
 *      <h1>{count.toString()}</h1>
 *      <button
 *        onClick={ () => setCount(n => n + 1) }
 *      >
 *        Increment
 *      </button
 *    )
 * }
 * ```
 *
 * @param initial
 * @returns
 */
export function state<T>(
  initial: T | (() => T)
): [T, (next: T | ((prev: T) => T)) => void] {
  if (!currentComponentId)
    throw new Error("State must be called during component rendering");

  const hookKey = buildHookKey();

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

/**
 * # effect
 *
 * Hook runs every component render, use it for syncing with external systems.
 *
 * @param fn
 * @param deps
 * @returns
 */
export function effect(fn: () => void | (() => void), deps?: any[]) {
  if (!currentComponentId)
    throw new Error("Effect must be called during component rendering");

  const hookKey = buildHookKey();
  if (!currentComponentId) return;

  let effectsForComponent = componentEffects.get(currentComponentId);
  if (!effectsForComponent) {
    effectsForComponent = new Map();
    componentEffects.set(currentComponentId, effectsForComponent);
  }

  const prev = effectsForComponent.get(hookKey);
  const changed =
    !prev?.deps || !deps || deps.some((d, i) => !Object.is(d, prev.deps?.[i]));

  if (changed) {
    prev?.cleanup?.();

    const cleanup = fn() || undefined;
    effectsForComponent.set(hookKey, { fn, deps, cleanup });
  }
}
