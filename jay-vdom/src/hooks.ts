const componentStates = new Map<string, any>();
let currentComponentId: string | null = null;
let currentHookIndex = 0;
let renderCounter = 0;

export function beginRenderFor(component: string) {
  currentComponentId = `${component}#${renderCounter}`;
  currentHookIndex = 0;
  return currentComponentId;
}

export function endRenderFor() {
  currentComponentId = null;
}

export function resetRenderCounter() {
  renderCounter = 0;
}

export function useState<T>(
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
    // TODO add update here
  };

  return [getter(), setter];
}
