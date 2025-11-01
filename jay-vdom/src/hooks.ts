import { update } from "./main";
import { derived, type writable } from "./stores";

interface Effect {
  fn: () => void | (() => void);
  deps?: any[];
  cleanup?: () => void;
  run?: boolean;
}

type State<T> = [T, (next: T | ((prev: T) => T)) => void];

export const componentStates = new Map<string, any>();
export const componentEffects = new Map<string, Map<string, Effect>>();

let effectQueue: (() => void | (() => void))[] = [];

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
  currentComponentId = null;
}

export function flushEffects() {
  const queue = effectQueue;
  effectQueue = [];
  queue.forEach(run => run());
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
export function state<T>(initial: T | (() => T)): State<T> {
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
 * ## Throws Errors
 *
 * - If run before the component is rendered.
 *
 * ## Examples
 *
 * Run a fetch request on mount.
 *
 * ```tsx
 * function CatFact() {
 *   const [fact, setFact] = state<string | null>(null);
 *
 *   effect(() => {
 *     let fetched = false;
 *
 *     fetch("/fact")
 *       .then(res => res.json())
 *       .then(data => {
 *         if (!fetched) setFact(data.fact);
 *       })
 *      .catch(err => console.error(err));
 *
 *    // Return cleanup
 *    return () => fetched = true;
 *   }, []); // Leave empty for single run.
 * }
 * ```
 *
 * Run a fetch when a state variable changes.
 *
 * ```tsx
 * function CatFact() {
 *   const [fact, setFact] = state<string | null>(null);
 *   const [refresh, setRefresh] = state<boolean>(false);
 *
 *   effect(() => {
 *     let fetched = false;
 *
 *     fetch("/fact")
 *       .then(res => res.json())
 *       .then(data => {
 *         if (!fetched) setFact(data.fact);
 *       })
 *      .catch(err => console.error(err));
 *
 *    // Return cleanup
 *    return () => fetched = true;
 *   }, [refresh]);
 * }
 * ```
 *
 * You can also use an effect in a helper function.
 *
 * ```ts
 * function fetchCatFact({ setData }: { setData: (d) => void }) {
 *   effect(() => {
 *     let fetched = false;
 *
 *     fetch("/fact")
 *       .then(res => res.json())
 *       .then(data => {
 *         if (!fetched) setFact(data.fact);
 *       })
 *      .catch(err => console.error(err));
 *
 *    // Return cleanup
 *    return () => fetched = true;
 *   }, []); // Leave empty for single run.
 * }
 *
 * // Use in another component
 * function CatFact() {
 *   const [data, setData] = state<string | null>(null);
 *   fetchCatFact({ setData }); // call hook
 *
 *    // JSX
 * }
 * ```
 *
 * @param fn Hook function to be run, optionally include cleanup as return.
 * @param deps Dependencies that will cause the hook to re-run.
 */
export function effect(fn: () => void | (() => void), deps?: any[]): void {
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

  // only run once if []
  if (deps?.length === 0 && prev?.run) return;

  if (changed) {
    const runEffect = () => {
      prev?.cleanup?.();

      const cleanup = fn() || undefined;
      effectsForComponent.set(hookKey, { fn, deps, cleanup, run: true });
    };

    // Push to queue
    effectQueue.push(runEffect);
  }
}

/**
 * # store
 *
 * Hook runs once per component render and retrieves the current value from
 * a `writeable` data store.
 *
 * ## Example
 *
 * We can setup two components to subscribe to a given writeable store.
 *
 * ```tsx
 * const globalCount = writeable<number>(0)
 *
 * function Counter() {
 *   state [count, setCount] = store<number>(globalStore);
 *
 *   function updateCounter() {
 *     setCount(c => c + 1);
 *   }
 *
 *   return <button onClick={updateCounter}>Update</button>
 * }
 *
 * function DisplayCounter() {
 *   const [count] = store(globalCount);
 *
 *   return(
 *     <div>
 *       <p>Count {count.tostring()}</p>
 *       <Counter />
 *     </div>
 *   )
 * }
 * ```
 *
 * @param store Store to subscribe to.
 * @returns Store value and setter.
 */
export function store<T>(
  store: ReturnType<typeof writable<T>>
): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = state<T>(store.value);

  // subscribe once when component mounts
  effect(() => {
    const unsubscribe = store.subscribe(val => {
      if (!Object.is(val, value)) setValue(val);
    });
    return unsubscribe;
  }, []);

  return [value, store.set];
}

/**
 * # derivedBy
 *
 * Hook runs once per component render and derives a value from a store.
 *
 * ## Examples
 *
 * Derive multiplications
 *
 * ```ts
 *
 * ```
 *
 * @param st
 * @param fn
 * @returns
 */
export function derivedBy<A, B>(
  st: ReturnType<typeof writable<A>>,
  fn: (v: A) => B
) {
  return store(derived(st, fn));
}
