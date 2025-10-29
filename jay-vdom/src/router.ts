import createElement from "./createElement";
import { a, div } from "./elements";
import { state } from "./hooks";
import type { Link, VAttrs, VElement, VNode } from "./types";

/**
 * # Router
 *
 * A Jay-VDOM element that takes Link elements and constructs
 * a SPA router for displaying content.
 *
 * ## Throws Errors
 *
 * - If the current page rendering fails.
 * - If there are no provided components.
 *
 * ## Example
 *
 * ```ts
 * Router(
 *   Link("Counter", Counter()),
 *   Link("Gif", Gif()),
 * )
 * ```
 *
 * @param attrs HTML attributes for the router.
 * @param links Link array.
 * @returns Router element with links.
 */
export default function Router(props: {
  class?: string;
  children: VElement[];
}) {
  const links = props.children ?? [];
  if (!links.length) throw new Error("No components provided");

  const [page, setPage] = state<string>(
    (links[0].attrs?.["data-key"] ?? "") + "#0"
  );

  const newLinks: VNode[] = [];
  const linkMap: Map<string, VElement> = new Map();

  links.forEach((child, i) => {
    const key = child.attrs?.["data-key"] as string;
    const hash = key + "#" + i;
    newLinks.push(createElement("a", { onClick: () => setPage(hash) }, [key]));
    linkMap.set(hash, child);
  });

  const currentPage = linkMap.get(page);
  if (!currentPage) throw new Error("Page rendering failed");

  return div(
    createElement("div", { class: props.class ?? "" }, [...newLinks]),
    currentPage
  );
}
