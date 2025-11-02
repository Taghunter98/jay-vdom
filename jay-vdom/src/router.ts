import createElement from "./createElement";
import { state } from "./hooks";
import type { VElement, VNode } from "./types";

/**
 * # Router
 *
 * A Jay-VDOM element that takes Link elements and constructs
 * a SPA router for displaying content.
 *
 * The SPA router is case sensitive and will create URLs in lowercase with
 * a - spacer.
 *
 * So a link with key 'Dog Pics' becomes /dog-pics.
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
export function Router(props: {
  id?: string;
  class?: string;
  children?: VNode[];
  layout?: (links: string[], currentPage: VNode) => VNode;
  error404?: VNode;
}) {
  const links = props.children ?? [];
  if (!links.length) throw new Error("No components provided");

  const newLinks: VNode[] = [];
  const linkMap: Map<string, { node: VElement; key: string }> = new Map();

  links.forEach((child, i) => {
    const childNode = child as VElement;
    const key = childNode.attrs?.["data-key"] as string;
    const hash = key + "#" + i;
    const css = childNode.attrs?.["class"] as string;

    // Store key in map separately
    linkMap.set(hash, { node: childNode, key });

    // Clear attributes for rendering
    childNode.attrs = {};

    newLinks.push(
      createElement(
        "a",
        {
          class: css,
          onClick: () => {
            const path = `/${encodeURIComponent(
              key.toLowerCase().replace(/\s+/g, "-")
            )}`;
            history.pushState({ page: key }, "", path);
            setPage(hash);
          },
        },
        [key]
      )
    );
  });

  const initialPath = window.location.pathname;
  const initialHash =
    findHashByPath(initialPath, linkMap) ??
    ((links[0] as VElement).attrs?.["data-key"] ?? "") + "#0";

  const [page, setPage] = state<string>(initialHash);

  const currentPage = linkMap.get(page)?.node;
  if (!currentPage) {
    return props.error404
      ? props.error404
      : createElement("div", {}, [
          `404 — Page not found: ${window.location.pathname}`,
        ]);
  }

  if (props.layout) return props.layout(newLinks as string[], currentPage);

  // Default layout (navbar + page)
  return createElement("div", {}, [
    createElement(
      "div",
      { id: props.id ?? "", class: props.class ?? "" },
      newLinks
    ),
    currentPage,
  ]);
}

// Helper to map a key to a path
function keyToPath(key: string) {
  return "/" + encodeURIComponent(key.toLowerCase().replace(/\s+/g, "-"));
}

// Find hash by key
function findHashByPath(
  path: string,
  linkMap: Map<string, { node: VElement; key: string }>
) {
  for (const [hash, { key }] of linkMap.entries()) {
    if (keyToPath(key) === path) return hash;
  }
  return null;
}
