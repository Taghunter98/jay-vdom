import createElement from "./createElement";
import diff from "./diff";
import {
  beginRenderFor,
  endRenderFor,
  resetRenderCounter,
  useState,
} from "./hooks";
import mount from "./mount";
import render, { type Rendered } from "./render";
import type { VNode } from "./types";

// current mounted VDOM and rendered DOM
let $currentState: VNode;
let $currentVDOM: Rendered;

/**
 * # build
 *
 * Function builds the virtual DOM and sets up the project.
 */
function build(appState: VNode) {
  // Reset the per-render cursor so hook keys are generated consistently each render pass.
  resetRenderCounter();
  beginRenderFor("AppRoot");
  try {
    $currentState = appState;
    const $app = render(appState);
    const $div = document.getElementById("app");
    if (!$div) throw new Error("Error mounting app");
    $currentVDOM = mount($app, $div);
  } finally {
    endRenderFor();
  }
}

function renderComponent<T extends any[]>(
  componentName: string,
  fn: (...args: T) => VNode,
  ...args: T
): VNode {
  beginRenderFor(componentName);
  try {
    return fn(...args);
  } finally {
    endRenderFor();
  }
}

function update(newState: VNode) {
  const patch = diff($currentState, newState);
  const patched = patch($currentVDOM);
  if (!patched) throw new Error("Error patching");
  $currentVDOM = patched;
  $currentState = newState;
}

// Clicker.ts (kept inline here for convenience)
function Clicker(count: number, name: string) {
  const [rendered, setRendered] = useState<number>(() => 0);

  function clickHandler() {
    setRendered(prev => prev + 1);
    const nextCount = count + 1;
    const nextName = rendered > 4 ? "CHANGED" : "Beth";
    update(renderComponent("Clicker", Clicker, nextCount, nextName));
  }

  return createElement(
    "div",
    { style: "display: flex; flex-direction: column; gap: 20;" },
    [
      createElement("h1", {}, ["Hello World!"]),
      "The current count is:",
      String(count),
      createElement("h3", {}, [name]),
      createElement("button", { type: "button", onClick: clickHandler }, [
        "Click Me",
      ]),
      createElement(
        "img",
        { src: "https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif" },
        []
      ),
    ]
  );
}

// App entry point: use renderComponent for the top-level Clicker instance
function vApp() {
  return createElement(
    "div",
    {
      id: "app",
    },
    [renderComponent("Clicker", Clicker, 0, "Josh")]
  );
}

build(vApp());
