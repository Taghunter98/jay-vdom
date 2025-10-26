import { describe, expect, test } from "vitest";
import createElement from "../createElement";
import { render } from "../render";

describe("Testing render", () => {
  /**
   * Tests for rendering a basic DOM node.
   */
  test("Should render a DOM node", () => {
    const vnode = createElement("div", { id: "test" });
    const element = render(vnode);
    document.body.appendChild(element);

    expect(element).toBeDefined();
    expect(element instanceof HTMLElement);
    expect(document.body.querySelector("div")?.getAttribute("id")).toBe("test");
  });

  /**
   * Tests for rendering a DOM node with children.
   */
  test("Should render a DOM node", () => {
    const vnode = createElement("div", { id: "test" }, [
      createElement("h1"),
      createElement("p"),
      createElement("button"),
    ]);
    const element = render(vnode);
    document.body.appendChild(element);

    expect(element).toBeDefined();
    expect(element instanceof HTMLElement);
    expect(document.body.querySelector("div")?.getAttribute("id")).toBe("test");
    expect(document.body.querySelector("h1")).toBeDefined();
    expect(document.body.querySelector("p")).toBeDefined();
    expect(document.body.querySelector("button")).toBeDefined();
  });

  /**
   * Tests for rendering a DOM node with nested children.
   */
  test("Should render a DOM node", () => {
    const vnode = createElement("div", { id: "test" }, [
      createElement("div", {}, [
        createElement("h1"),
        createElement("p"),
        createElement("img"),
      ]),
    ]);
    const element = render(vnode);
    document.body.appendChild(element);

    expect(element).toBeDefined();
    expect(element instanceof HTMLElement);
    expect(document.body.querySelector("div")?.getAttribute("id")).toBe("test");
    expect(document.body.querySelector("h1")).toBeDefined();
    expect(document.body.querySelector("p")).toBeDefined();
    expect(document.body.querySelector("img")).toBeDefined();
  });
});
