import createElement from "./createElement";
import { state } from "./hooks";
import type { VElement, VNode } from "./types";

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
 * Create a plain router.
 *
 * ```tsx
 * <Router class="navbar">
 *   <Link class="link-style" dataKey="Counter">
 *     <Counter />
 *   </Link>
 *   <Link class="link-style" dataKey="Gif">
 *     <Gif />
 *   </Link>
 * </Router>
 * ```
 *
 * Or style with a layout.
 *
 * ```tsx
 * <Router
 *   layout={(links, page) => (
 *     <div>
 *       <div class="navbar">
 *         <h1>My Website</h1>
 *         <div style="display: flex; gap: 20px;">{links}</div>
 *       </div>
 *     <main>{page}</main>
 *     <footer>Coppyright myawesomewebsite.com 2025</footer>
 *   </div>
 * )}
 * >
 *   <Link class="link-style" dataKey="Counter">
 *     <Counter />
 *   </Link>
 * </Router>
 * ```
 *
 * @param attrs HTML attributes for the router.
 * @param links Link array.
 * @returns Router element with links.
 */
export default function Router(props: {
  class?: string;
  children: VElement[];
  layout?: (links: VNode[], currentPage: VNode) => VElement;
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
    const css = child.attrs?.["class"] as string;
    child.attrs = {}; // temp, reset attributes for children
    newLinks.push(
      createElement("a", { class: css, onClick: () => setPage(hash) }, [key])
    );
    linkMap.set(hash, child);
  });

  const currentPage = linkMap.get(page);
  if (!currentPage) throw new Error("Page rendering failed");

  if (props.layout) return props.layout(newLinks, currentPage);

  // Default layout (navbar + page)
  return createElement("div", {}, [
    createElement("div", { class: props.class ?? "" }, newLinks),
    currentPage,
  ]);
}
