import { describe, expect, test, vi } from "vitest";
import createElement from "../createElement";
import { attachListener, render, renderComponent } from "../render";

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

  test("Should render a component", () => {
    const component = ({ name }: { name: string }) => {
      return createElement("div", { id: "test" }, [
        createElement("h1", {}, [name]),
      ]);
    };

    renderComponent(component, { name: "Testing" });

    expect(document.body.querySelector("h1")?.innerHTML).toBeDefined();
  });
});

describe("Testing event listeners", () => {
  const vnode = createElement("div", { id: "test" });

  /**
   * Tests attaching an onclick event
   */
  test("Should attach a listener", () => {
    const spy = vi.fn();
    const $el = render(vnode) as HTMLElement;
    attachListener($el, "onClick", spy);

    $el.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(spy).toHaveBeenCalled();
  });

  /**
   * Tests attaching an onInput event
   */
  test("Should attach a listener", () => {
    const spy = vi.fn();
    const $el = render(vnode) as HTMLElement;
    attachListener($el, "onInput", spy);

    $el.dispatchEvent(new InputEvent("input", { bubbles: true }));

    expect(spy).toHaveBeenCalled();
  });
});

describe("Testing Element Library", () => {
  test("Should render a div", () => {
    const vnode = createElement("div", { id: "test" }, [
      createElement("div", {}, [
        createElement("h1", {}, ["Hello World!"]),
        createElement("p", {}, ["This is cool text"]),
        createElement("img", { src: "https://..." }),
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
