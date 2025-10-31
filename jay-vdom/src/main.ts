import diff from "./diff";
import { beginRenderFor, endRenderFor, resetRenderCounter } from "./hooks";
import mount from "./mount";
import { renderElement } from "./render";
import type { Rendered } from "./render";
import type { VElement, VNode } from "./types";

/**
 * # vApp
 *
 * Global app state holds the current VElement.
 *
 * Created on app startup.
 */
let vApp: (() => VElement) | null = null;

// current mounted VDOM and rendered DOM
let $currentState: VNode;
let $currentVDOM: Rendered;

/**
 * # build
 *
 * Function builds the virtual DOM and sets up the project.
 *
 * ## Behaviour
 *
 * - The render counter is reset for the new build.
 * - The hook counter is set and scoped for the given root element.
 * - The app state is saved and inital render occurs.
 * - The central `div` is fetched and asserted.
 * - The app is mounted to the DOM.
 *
 * ## Throws Errors
 *
 * - If the render fails.
 * - If the app div is undefined.
 *
 * ## Example
 *
 * ```ts
 * function App() {
 *   // Return element
 * }
 *
 * // Start application
 * build(App)
 * ```
 */
export function build(appState: () => VElement) {
  resetRenderCounter();
  beginRenderFor("AppRoot");
  try {
    vApp = appState;
    $currentState = appState();
    const $app = renderElement($currentState);
    const $div = document.getElementById("app");
    if (!$div) throw new Error("Error mounting app");
    $currentVDOM = mount($app, $div);
  } finally {
    endRenderFor();
  }
}

/**
 * # update
 *
 * Function performs primary update to VDOM.
 *
 * ## Behaviour
 *
 * - Attempts a diff check, returns either a new tree or undefined.
 * - Given there has been a change, the patch is activated against the current tree.
 * - If the patched succedes the current VDOM is updated.
 *
 * ## Behaviour
 *
 * ```ts
 * // Updating a component with a new count
 * count++;
 * update(renderComponent("Counter", Counter, count));
 * ```
 *
 * @param newState
 */
export function update() {
  if (!vApp) throw new Error("Unable to update Virtual Dom");
  const newState = vApp();
  const patch = diff($currentState, newState);
  const patched = patch($currentVDOM);
  if (!patched) throw new Error("Error patching");
  $currentVDOM = patched;
  $currentState = newState;
}
