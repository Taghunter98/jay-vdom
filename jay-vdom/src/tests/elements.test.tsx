import { test, afterEach, describe, beforeAll } from "vitest";
import { renderComponent } from "../render";
import type { VNode } from "../types";
import { Router } from "../router";
import { Each, Input, Link } from "../elements";
import { build } from "../main";
import { expect } from "vitest";
import { createElement } from "../createElement";
import { state } from "../hooks";

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
      <Router id="router" url={true}>
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

  /**
   * Tests binding value to input event when a user triggers a value change.
   */
  test("Should bind data to event", () => {
    const TestInput = () => {
      const [value, setValue] = state("");
      return (
        <div>
          <Input bind={setValue} value={value} />
          <p>{value}</p>
        </div>
      );
    };

    buildHelper(TestInput);

    const input = document.body.querySelector("input");
    const p = document.body.querySelector("p");

    expect(input).toBeDefined();
    expect(p).toBeDefined();

    if (!input || !p) return;

    input.value = "test";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(p.innerHTML).toBe("test");
  });

  /**
   * Tests each rendering with simple list
   */
  test("Should render three elements", () => {
    const eachTest = () => {
      const [values] = state<number[]>([1, 2, 3]);
      return (
        <Each values={values} layout={(v: number) => <p>{v.toString()}</p>} />
      );
    };

    buildHelper(eachTest);
    const items = document.body.querySelectorAll("p");
    expect(items.length).toBe(3);
    expect(items[0].innerHTML).toBe("1");
    expect(items[1].innerHTML).toBe("2");
    expect(items[2].innerHTML).toBe("3");
  });

  /**
   * Tests rendering object keys.
   */
  test("Should render three object values", () => {
    const eachTestObj = () => {
      const [values] = state({ item1: 1, item2: 2, item3: 3 });
      return (
        <Each values={values} layout={(v: number) => <p>{v.toString()}</p>} />
      );
    };

    buildHelper(eachTestObj);
    const items = document.body.querySelectorAll("p");
    expect(items.length).toBe(3);
    expect(items[0].innerHTML).toBe("1");
    expect(items[1].innerHTML).toBe("2");
    expect(items[2].innerHTML).toBe("3");
  });
});
