import { afterEach, assert, describe, expect, test, vi } from "vitest";

import { createElement } from "../createElement";
import {
  diff,
  diffAttrs,
  diffChildren,
  isEventAttr,
  toEventName,
} from "../diff";
import { render } from "../render";

afterEach(() => (document.body.innerHTML = ""));

describe("Testing VDOM diffing", () => {
  /**
   * Tests the helpers
   */
  test("Should return true", () => {
    assert(isEventAttr("onClick"));
    assert(isEventAttr("onInput"));
    assert(isEventAttr("onDblClick"));
    expect(toEventName("onClick")).toBe("click");
    expect(toEventName("onInput")).toBe("input");
    expect(toEventName("onDblClick")).toBe("dblclick");
  });

  /**
   * Tests for two elements with different attributes by asserting the changed
   * element is the same as the new patched one.
   */
  test("Should replace the element and return new node", () => {
    const currAttrs = createElement("div", { id: "test" });
    const newAttrs = createElement("div", { id: "changed", alt: "testing" });
    const current = render(currAttrs);
    document.body.appendChild(current);

    const patch = diffAttrs(currAttrs.attrs, newAttrs.attrs);
    const patched = patch(current as HTMLElement);
    expect(patch).toBeDefined();
    expect(patched instanceof HTMLElement);
    expect(document.body.querySelector("#changed")).toBe(patched);
  });

  /**
   * Tests child diffing inside one VNode.
   */
  test("Should replace the child nodes", () => {
    const currChildren = createElement("div", { id: "test" }, [
      createElement("h1"),
    ]);
    const newChildren = createElement("div", { id: "test" }, [
      createElement("h1"),
      createElement("p"),
      createElement("img"),
    ]);
    const current = render(currChildren);
    document.body.appendChild(current);

    const patch = diffChildren(currChildren.children, newChildren.children);
    const patched = patch(current);
    expect(patch).toBeDefined();
    expect(patched instanceof HTMLElement);
    expect(document.body.querySelector("#test")).toBe(patched);
    expect(document.body.querySelector("p")).toBeDefined();
    expect(document.body.querySelector("img")).toBeDefined();
  });

  /**
   * Tests diffing between two elements with a subtle variation. Asserts that the
   * changed element is the same as the patched one and the attribute id changes.
   */
  test("Should replace the element and return new node", () => {
    const curTree = createElement("div", { id: "test" });
    const current = render(curTree);
    document.body.appendChild(current);

    const newTree = createElement("div", { id: "changed" });
    const patch = diff(curTree, newTree);
    const patched = patch(current);

    expect(patched).toBeDefined();
    expect(patched instanceof HTMLElement).toBe(true);
    expect((patched as HTMLElement).getAttribute("id")).toBe("changed");
    expect(document.body.querySelector("#changed")).toBe(patched);
  });

  /**
   * Tests complete element wipe with new HTML.
   */
  test("Should replace the entire element and return new node", () => {
    const curTree = createElement("div", { id: "test" });
    const current = render(curTree);
    document.body.appendChild(current);

    const newTree = createElement("div", { id: "changed" }, [
      createElement("h1", {}, ["Hello World!"]),
      createElement("p", {}, ["This is a paragraph"]),
      createElement("img", { src: "url" }),
    ]);
    const patch = diff(curTree, newTree);
    const patched = patch(current);

    expect(patched).toBeDefined();
    expect(patched instanceof HTMLElement).toBe(true);
    expect((patched as HTMLElement).getAttribute("id")).toBe("changed");
    expect(document.body.querySelector("#changed")).toBe(patched);
    expect(document.body.querySelector("h1")?.innerHTML).toBe("Hello World!");
    expect(document.body.querySelector("p")?.innerHTML).toBe(
      "This is a paragraph"
    );
    expect(document.body.querySelector("img")?.getAttribute("src")).toBe("url");
  });

  /**
   * Tests for diffing to only replace children.
   */
  test("Should replace the element's children", () => {
    const curTree = createElement("div", { id: "test" }, [
      createElement("h1", { id: "h1-title" }),
    ]);
    const current = render(curTree);
    document.body.appendChild(current);

    const newTree = createElement("div", { id: "test" }, [
      createElement("h1", { id: "new-title" }, ["Hello World!"]),
    ]);
    const patch = diff(curTree, newTree);
    const patched = patch(current);

    expect(patched).toBeDefined();
    expect(patched instanceof HTMLElement).toBe(true);
    expect((patched as HTMLElement).getAttribute("id")).toBe("test");
    expect(document.body.querySelector("#new-title")?.innerHTML).toBe(
      "Hello World!"
    );
  });

  /**
   * Tests a click handler was wired correctly and calls a dispatch event to assert.
   */
  test("Should attach a click handler", () => {
    const spy = vi.fn();
    const vnode = createElement("button", { onClick: spy }, ["Click"]);
    const $el = render(vnode);
    document.body.appendChild($el);

    ($el as HTMLElement).dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );

    expect(spy).toHaveBeenCalled();
  });
});
