import { describe, expect, test } from "vitest";
import createElement from "../createElement";
import { render } from "../render";
import { div, h1, img, p } from "../elements";

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

describe("Testing Element Library", () => {
  test("Should render a div", () => {
    const vnode = div(
      { id: "test" },
      div(
        {},
        h1({}, "Hello World!"),
        p({}, "This is cool text"),
        img({ src: "https://..." })
      )
    );
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
