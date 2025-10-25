import createElement from "./createElement";
import diff from "./diff";
import mount from "./mount";
import render, { type Rendered } from "./render";
import type { VNode } from "./types";

let $currentState: VNode;
let $currentVDOM: Rendered;

function build(appState: VNode) {
  console.log("Building DOM tree...");
  $currentState = appState;
  const $app = render(appState);
  const $div = document.getElementById("app");
  if (!$div) throw new Error("Error mounting app");
  $currentVDOM = mount($app, $div);
}

function update(newState: VNode) {
  console.log("Updating...");
  const patch = diff($currentState, newState);
  const patched = patch($currentVDOM);
  if (!patched) throw new Error("Error patching");
  $currentVDOM = patched;
  $currentState = newState;
}

/**
 * Clicker now returns a VNode whose button has an onClick handler.
 * The handler updates the VDOM by calling update with a new VNode structure.
 */
function Clicker(count: number) {
  return createElement(
    "div",
    { style: "display: flex; flex-direction: column; gap: 20;" },
    [
      createElement("h1", {}, ["Hello World!"]),
      "The current count is:",
      String(count),
      // note: id is "btn" to match any selectors. We pass the handler as onClick.
      createElement(
        "button",
        {
          id: "btn",
          type: "button",
          onClick: (e: Event) => {
            // event handler lives in VNode attrs and will be attached by render/diff
            console.log("click handler: set count to", count + 1);
            update(Clicker(count + 1));
          },
        },
        ["Click Me"]
      ),
      createElement("img", {
        src: "https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif",
      }),
    ]
  );
}

function vApp() {
  return createElement(
    "div",
    {
      id: "app",
    },
    [Clicker(0)]
  );
}

build(vApp());
