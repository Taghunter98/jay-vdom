import { createElement } from "./createElement";
import type {
  GenericAttributes,
  VirtualInput,
  VAttrs,
  VNode,
  VirtualEach,
  VElement,
  VirtualControl,
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
 *     as={item => <p>{item}</p>}
 *   />
 * )
 * ```
 *
 * @param param0
 * @returns
 */
export function Each<T>({
  values,
  as,
  element = "div",
  ...attrs
}: VirtualEach<T>): VNode {
  let items: T[];

  if (Array.isArray(values)) items = values;
  else if (typeof values === "object" && !(values instanceof HTMLElement))
    items = Object.values(values as object) as T[];
  else throw new Error("Invalid values argument provided");

  const children: VNode[] = items.map((v, i) => as(v, i));

  return createElement(element, attrs as VAttrs, children);
}

export function Else(props: { children?: VNode }): VNode | null {
  return createElement("Else", {}, [props.children ?? ""]);
}

export function Elif(props: VirtualControl): VNode {
  const children = Array.isArray(props.children)
    ? props.children
    : [props.children];
  return createElement("Elif", { when: props.when }, children);
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
export function If({ when, children }: VirtualControl): VNode | null {
  // First child test
  const firstChild = Array.isArray(children)
    ? (children[0] as VNode)
    : children;
  if (when) return firstChild;

  let elseChild: VElement | undefined;

  if (!Array.isArray(children)) return "";

  // Iterate through children
  for (const child of children as VNode[]) {
    const el = child as VElement;
    if (el.tagName === "Elif" && el.attrs?.when == true)
      return Array.isArray(el.children) ? el.children[0] : null;

    if (el.tagName === "Else") elseChild = el;
  }

  if (elseChild)
    return Array.isArray(elseChild.children) ? elseChild.children[0] : null;

  return null;
}

/**
 * # Case
 *
 * The Jay-VDOM Case element is a wrapper for a conditional render given the case
 * value is met.
 *
 * ## Example
 *
 * ```tsx
 * <Case when={x == 2}>
 *   <p>{x} is equal to 2</p>
 * </Case>
 * ```
 *
 * @param props
 * @returns
 */
export function Case(props: { when: any; children?: VNode }): VNode | null {
  return createElement("Case", { when: props.when }, [props.children ?? ""]);
}

/**
 * # Default
 *
 * The Jay-VDOM Default element provides a default template to render in a `Switch` statement.
 *
 * ```tsx
 * <Default>
 *   <p>Nothing here</p>
 * </Default>
 * ```
 *
 * @param props
 * @returns
 */
export function Default(props: { children?: VNode }): VNode | null {
  return createElement("Default", {}, [props.children ?? ""]);
}

/**
 * # Switch
 *
 * The Jay-VDOM Switch element allows for chaining options for conditonal rendering without
 * needing `If` blocks.
 *
 * Use with `Case` elements and a `Default` for a default value.
 *
 * ## Example
 *
 * ```tsx
 * <Switch value={page}>
 *   <Case when="page1">
 *     <p>Page 1</p>
 *   </Case>
 *
 *   <Case when="page2">
 *     <p>Page 2</p>
 *   </Case>
 *
 *   <Default>
 *     <p>Page not found</p>
 *   </Default>
 * </Switch>
 * ```
 *
 * @param props
 * @returns
 */
export function Switch(props: { value: any; children: VNode[] }): VNode | null {
  const { value, children } = props;

  for (const child of children) {
    if (!child || typeof child !== "object") continue;
    const el = child as VElement;

    if (el.tagName === "Case" && el.attrs?.when === value)
      if (el.children) return createElement("div", {}, el.children) ?? null;

    if (el.tagName === "Default" && el.children)
      return createElement("div", {}, el.children);
  }

  return null;
}
