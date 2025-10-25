import { assert, describe, expect, test } from "vitest";

import createElement from "../src/createElement";

describe("Testing virtual dom", () => {
  test("Should create an element", () => {
    expect(createElement("div")).toStrictEqual({
      tagName: "div",
      attrs: {},
      children: [],
    });
  });
});
