import { afterEach, describe } from "node:test";
import { beforeEach, expect, test } from "vitest";
import createElement from "../createElement";
import { state } from "../hooks";
import { build, update } from "../main";
import { renderComponent } from "../render";
import { div } from "../elements";
import type { VNode } from "../types";

describe("Unit Test: state updates", () => {
  const buildHelper = (component: () => VNode) => {
    const App = () =>
      div(
        {
          id: "app",
        },
        renderComponent(component)
      );

    build(App);
  };

  // Build the VDOM
  beforeEach(() => {
    const mountPoint = document.createElement("div");
    mountPoint.id = "app";
    document.body.appendChild(mountPoint);
  });

  // Destroy the VDOM
  afterEach(() => {
    const body = document.body.querySelector("app");
    if (!body) throw Error("Can't find mounting point");
    body.innerHTML = "";
  });

  test("Should update button text", () => {
    const vnode = () => {
      const [value, setValue] = state<number>(1);
      return createElement("button", { onClick: () => setValue(2) }, [
        value.toString(),
      ]);
    };

    buildHelper(vnode);

    expect(document.querySelector("button")?.innerHTML).toBe("1");

    document
      .querySelector("button")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(document.body.querySelector("button")?.innerHTML).toBe("2");
  });

  test("Should update values", () => {
    const vnode2 = () => {
      const [value, setValue] = state<string>("TESTING");
      return createElement(
        "button",
        { onClick: () => setValue(prev => prev + " WORKED") },
        [value.toString()]
      );
    };

    buildHelper(vnode2);
    expect(document.querySelector("button")?.innerHTML).toBe("TESTING");

    document
      .querySelector("button")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(document.body.querySelector("button")?.innerHTML).toBe(
      "TESTING WORKED"
    );
  });
});
