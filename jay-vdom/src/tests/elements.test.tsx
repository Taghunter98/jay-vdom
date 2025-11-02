import { test, afterEach, describe, beforeAll } from "vitest";
import { renderComponent } from "../render";
import type { VNode } from "../types";
import { Router } from "../router";
import { Link } from "../elements";
import { build } from "../main";
import { expect } from "vitest";
import createElement from "../createElement";

describe("Unit Test: Router", () => {
  const buildHelper = (component: () => VNode) => {
    const App = () =>
      createElement(
        "div",
        {
          id: "app",
        },
        [renderComponent(component)]
      );

    build(App);
  };

  // Build the VDOM
  beforeAll(() => {
    const mountPoint = document.createElement("div");
    mountPoint.id = "app";
    document.body.appendChild(mountPoint);
  });

  // Destroy the VDOM
  afterEach(() => {
    const body = document.getElementById("app");
    if (!body) throw Error("Can't find mounting point");
    body.innerHTML = "";
  });

  /**
   * Tests successful VDOM navigation
   */
  test("Should tab to new page", () => {
    const Comp1 = () => <h1>Test1</h1>;
    const Comp2 = () => <h2>Test2</h2>;
    const router = () => (
      <Router id="router">
        <Link dataKey="Page 1">
          <Comp1 />
        </Link>
        <Link dataKey="Page 2">
          <Comp2 />
        </Link>
      </Router>
    );

    buildHelper(router);
    expect(document.body.querySelector("router")).toBeDefined();
    const links = document.querySelectorAll("a");
    expect(links[0].innerHTML).toBe("Page 1");
    expect(links[1].innerHTML).toBe("Page 2");
    expect(document.body.querySelector("h1")?.innerHTML).toBe("Test1");
    expect(document.body.querySelector("h2")?.innerHTML).toBeUndefined();

    // Test base url
    expect(window.location.pathname).toBe("/");

    // Update UI
    links[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(document.body.querySelector("h1")?.innerHTML).toBeUndefined();
    expect(document.body.querySelector("h2")?.innerHTML).toBe("Test2");

    // Test new url
    expect(window.location.pathname).toBe("/page-2");
  });
});
