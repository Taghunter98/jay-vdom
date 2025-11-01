import { test, afterEach, beforeEach, describe } from "vitest";
import { renderComponent } from "../render";
import type { VNode } from "../types";
import { Router } from "../router";
import { div, Link } from "../elements";
import { build } from "../main";
import { expect } from "vitest";

describe("Unit Test: Router", () => {
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
  afterEach(() => (document.body.innerHTML = ""));

  /**
   * Tests successful VDOM navigation
   */
  test("Should tab to new page", () => {
    const Comp1 = () => <h1>Test1</h1>;
    const Comp2 = () => <h2>Test2</h2>;
    const router = () => (
      <Router id="router">
        <Link dataKey="p1">
          <Comp1 />
        </Link>
        <Link dataKey="p2">
          <Comp2 />
        </Link>
      </Router>
    );

    buildHelper(router);
    expect(document.body.querySelector("router")).toBeDefined();
    const links = document.querySelectorAll("a");
    expect(links[0].innerHTML).toBe("p1");
    expect(links[1].innerHTML).toBe("p2");
    expect(document.body.querySelector("h1")?.innerHTML).toBe("Test1");
    expect(document.body.querySelector("h2")?.innerHTML).toBeUndefined();

    // Update UI
    links[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(document.body.querySelector("h1")?.innerHTML).toBeUndefined();
    expect(document.body.querySelector("h2")?.innerHTML).toBe("Test2");
  });
});
