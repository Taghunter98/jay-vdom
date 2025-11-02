type Subscriber<T> = (value: T) => void;
type Store<T> = {
  set: (newValue: T | ((v: T) => T)) => void;
  subscribe: (fn: Subscriber<T>) => () => boolean;
  value: T;
};

/**
 * # writeable
 *
 * Function creates a writeable store for data sharing across components.
 *
 * ```tsx
 * // Setup a new writeable store
 * const myStore = writeable<number>(0);
 *
 * // Use the store
 * function TestStore() {
 *   const [value] = store(myStore);
 *
 *   return(
 *     <p>{value.toString()}</p>
 *   )
 * }
 * ```
 *
 * @param initial Inital value for the store.
 */
export function writable<T>(initial: T): Store<T> {
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
 * Subscribes to a given store and creates a new store based on a
 * derivation function.
 *
 * To access the store, subscribe to it and use the returned value.
 *
 *
 * ```tsx
 * const myStore = writeable(0);
 *
 * function TestStore() {
 *   const derived = derived(myStore, x => x + 2);
 *   const [value] = store(derived);
 *
 *   return(
 *     <p>{value.toString()}</p>
 *   )
 * }
 * ```
 *
 * @param store Store to derive from.
 * @param fn Derivation function.
 * @returns New store to subscribe to.
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

/**
 * # readable
 *
 * Builds a read-only store that allows for persistent data to be read by other
 * elements globally.
 *
 * ## Example
 *
 * Seriously don't actually do this... it's just an example!
 *
 * ```tsx
 * const apiKey = readable<string>("AD34-B9JK-17PN");
 *
 * function Connector() {
 *   const [key] = store(apiKey);
 *   const [data, setData] = state(null);
 *
 *   effect(() => {
 *     let fetched = false;
 *
 *     fetch(`https://api.com?key=${key}`)
 *       .then(res => res.json())
 *       .then(data => {
 *         if (!fetched) setData(data.values);
 *       })
 *       .catch(err => console.error(err));
 *     return () => (fetched = true);
 *   }, []);
 * }
 * ```
 *
 * @param value
 * @returns
 */
export function readable<T>(value: T): Store<T> {
  const store = writable(value);

  return {
    ...store,
    set: () => undefined,
  };
}
