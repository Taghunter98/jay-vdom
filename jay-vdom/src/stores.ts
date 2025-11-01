type Subscriber<T> = (value: T) => void;

/**
 * # writeable
 *
 * Function creates a writeable store for data sharing across components.
 *
 * @param initial
 * @returns
 */
export function writable<T>(initial: T) {
  let value = initial;
  const subscribers = new Set<Subscriber<T>>();

  /**
   * # set
   *
   * Function reviews the incomming value and given the object is not identical
   * the store updates.
   *
   * ## Behaviour
   *
   * - Checks if the new value is a function or plain value.
   * - Returns early if identical.
   * - Updates the current value.
   * - Sends changed data to all subscibers.
   *
   * @param newValue New value to update.
   */
  function set(newValue: T | ((v: T) => T)): void {
    const nextValue =
      typeof newValue === "function"
        ? (newValue as (v: T) => T)(value)
        : newValue;

    if (Object.is(nextValue, value)) return;
    value = nextValue;
    subscribers.forEach(fn => fn(value));
  }

  /**
   * # subscribe
   *
   * Function adds a new subscriber.
   *
   * ## Behaviour
   *
   * - The incomming function is called with the current value for its arg.
   * - The subscribers set is appended with the new functon.
   * - An unsubscribe function is returned to be called later.
   *
   * ## Example
   *
   * ```ts
   * effect(() => {
   *   const unsubscribe = store.subscribe(val => {
   *     if (!Object.is(val, value)) setValue(val);
   *   });
   *   return unsubscribe;
   * }, []);
   * ```
   *
   * @param fn Subscriber function.
   * @returns Unsubscribe function.
   */
  function subscribe(fn: Subscriber<T>) {
    fn(value);
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }

  return {
    subscribe,
    set,
    get value() {
      return value;
    },
  };
}

/**
 * # derived
 *
 * @param store
 * @param fn
 * @returns
 */
export function derived<A, B>(
  store: ReturnType<typeof writable<A>>,
  fn: (value: A) => B
) {
  // Create a new writeable store from the result of the derive func
  const result = writable(fn(store.value));

  // Subscribe the current store and set the new value
  store.subscribe(v => result.set(fn(v)));
  return result;
}
