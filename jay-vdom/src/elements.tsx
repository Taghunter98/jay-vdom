import createElement from "./createElement";
import type {
  GenericAttributes,
  VirtualInput,
  VAttrs,
  VNode,
  VirtualEach,
} from "./types";

export type Values = Array<VNode | GenericAttributes>;

/**
 * # Link
 *
 * A Jay-VDOM element that builds a link with a given key.
 *
 * Use with a `Router` to create an SPA.
 *
 * ## Example
 *
 * ```ts
 * Router(
 *   { style: "display: flex; gap: 20px" },
 *   Link("Cool Counter", { class: "link-style" }, Counter()),
 *   Link("Gif", { class: "link-style" }, Gif()),
 *   Link("Test Name", { class: "link-style" }, Name("TESTING"))
 * )
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

export function VInput({ bind, value, ...attrs }: VirtualInput) {
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

export function VEach<T>({
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
