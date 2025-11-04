import { createElement } from "./createElement";
import type {
  GenericAttributes,
  VirtualInput,
  VAttrs,
  VNode,
  VirtualEach,
  VirtualIf,
} from "./types";

export type Values = Array<VNode | GenericAttributes>;

/**
 * # Link Element
 *
 * A Jay-VDOM element that builds a link with a given key.
 *
 * Use with a `Router` to create an SPA application.
 *
 * ## Example
 *
 * ```tsx
 * <Router>
 *   <Link dataKey="home">
 *     <Home />
 *   </Link>,
 *   <Link dataKey="about">
 *     <About />
 *   </Link>,
 * </Router>
 * ```
 *
 * @param key
 * @param component
 * @returns
 */
export function Link(
  props: { dataKey: string; class?: string; children: VNode | VNode[] } & VAttrs
): VNode {
  const { dataKey, children, ...attrs } = props;
  const kids = Array.isArray(children) ? children : [children];

  return createElement("div", { ...attrs, "data-key": dataKey }, kids);
}

/**
 * # Input Element
 *
 * A Jay-VDOM element that provides a bind API for values.
 *
 * ## Example
 *
 * ```tsx
 * // Setup a state variable
 * const [username, setUsername] = state<string>('');
 *
 * return(
 *   <Input
 *     type="text"
 *     bind={setUsername} // bind to setter
 *     value={username} // value passes to username
 *     placeholder="Enter username"
 *   />
 * )
 * ```
 *
 * @param param0
 * @returns
 */
export function Input({ bind, value, ...attrs }: VirtualInput) {
  return (
    <input
      {...attrs}
      value={value}
      onInput={(e: InputEvent) => {
        const target = e.target as HTMLInputElement;
        bind?.(target.value);
      }}
    />
  );
}

/**
 * # Each Element
 *
 * The J-VDOM Each element allows for rendering each item in a list or Record.
 *
 * ## Example
 *
 * ```tsx
 * const [items] = state(['apple', 'pair', 'orange']);
 *
 * return (
 *   <Each
 *     class="flex gap-2"
 *     values={items}
 *     layout={item => <p>{item}</p>}
 *   />
 * )
 * ```
 *
 * @param param0
 * @returns
 */
export function Each<T>({
  values,
  layout,
  as = "div",
  ...attrs
}: VirtualEach<T>): VNode {
  let items: T[];

  if (Array.isArray(values)) items = values;
  else if (typeof values === "object" && !(values instanceof HTMLElement))
    items = Object.values(values as object) as T[];
  else throw new Error("Invalid values argument provided");

  const children: VNode[] = items.map((v, i) => layout(v, i));

  return createElement(as, attrs as VAttrs, children);
}

/**
 * # If Element
 *
 * The J-VDOM If element allows for conditonal rendering.
 *
 * Use If to render JSX given the when clause is met, you can also nest
 * if statements within the `else` field.
 *
 *
 * ```tsx
 * <If
 *   when={count > 10}
 *   then={<p>Greater than 10</p>}
 *   else={{
 *     when: count > 5,
 *     then: <p>Greater than 5</p>,
 *     else: <p>5 or less</p>,
 *   }}
 * />
 * ```
 *
 * @param param0
 * @returns
 */
export function If({ when, then, else: otherwise }: VirtualIf): VNode | null {
  if (when) return then;

  if (otherwise && typeof otherwise === "object" && "when" in otherwise)
    return If(otherwise as VirtualIf);

  return (otherwise as VNode) ?? false;
}
