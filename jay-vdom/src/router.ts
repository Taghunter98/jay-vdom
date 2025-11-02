import createElement from "./createElement";
import { state } from "./hooks";
import type { VElement, VNode } from "./types";

/**
 * # Router
 *
 * A Jay-VDOM element that takes Link elements and constructs
 * a SPA router for displaying content.
 *
 * ## Props
 *
 * - id? `string` Router id attribute.
 * - class? `string` Class attributes.
 * - children? `Vnode[]` Child VNode links.
 * - layout? `(links: string[], currentPage: VNode) => VNode` Layout component.
 * - error404? `VNode` 404 page component.
 * - url? `boolean` Router emits url per page.
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
 * Add an optional 404 page for errors.
 *
 * ```tsx
 * <Router
 *   error404={<Error type="404" />}
 * >
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
  url?: boolean;
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

    linkMap.set(hash, { node: childNode, key });
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
            if (props.url) history.pushState({ page: key }, "", path);
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

/**
 * # keyToPath
 *
 * Helper function converts a given key to URL path.
 *
 * @param key Hash.
 * @returns URL param.
 */
function keyToPath(key: string) {
  return "/" + encodeURIComponent(key.toLowerCase().replace(/\s+/g, "-"));
}

/**
 * # findHashByPath
 *
 * Helper function finds the correct component to render based of the url path.
 *
 * If the path is / the first page is returned.
 *
 * @param path URL path.
 * @param linkMap Map of current links.
 * @returns Hash or null.
 */
function findHashByPath(
  path: string,
  linkMap: Map<string, { node: VElement; key: string }>
) {
  if (path === "/") return linkMap.keys().next().value;
  for (const [hash, { key }] of linkMap.entries())
    if (keyToPath(key) === path) return hash;

  return null;
}
