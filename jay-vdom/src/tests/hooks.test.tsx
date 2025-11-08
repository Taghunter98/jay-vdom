import { afterEach, describe } from "node:test";
import { assert, beforeAll, expect, test } from "vitest";
import { derivedBy, effect, state, store } from "../hooks";
import { build } from "../main";
import { renderComponent } from "../render";
import type { VNode } from "../types";
import { readable, writable } from "../stores";
import { createElement } from "../createElement";

describe("Unit Test: state updates", () => {
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
    const body = document.body.querySelector("app");
    if (!body) throw Error("Can't find mounting point");
    body.innerHTML = "";
  });

  /**
   * Tests state updating number on click
   */
  test("Should update button text", () => {
    const vnode = () => {
      const [value, setValue] = state<number>(1);
      return <button onClick={() => setValue(2)}>{value.toString()}</button>;
    };

    buildHelper(vnode);

    expect(document.querySelector("button")?.innerHTML).toBe("1");

    document
      .querySelector("button")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(document.body.querySelector("button")?.innerHTML).toBe("2");
  });

  /**
   * Tests state updating string on click.
   */
  test("Should update values", () => {
    const vnode2 = () => {
      const [value, setValue] = state<string>("TESTING");
      return (
        <button onClick={() => setValue(prev => prev + " WORKED")}>
          {value.toString()}
        </button>
      );
    };

    buildHelper(vnode2);
    expect(document.body.querySelector("button")?.innerHTML).toBe("TESTING");

    document.body
      .querySelector("button")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(document.body.querySelector("button")?.innerHTML).toBe(
      "TESTING WORKED"
    );
  });

  /**
   * Tests effect hook with external API fetch.
   */
  test("Should run an effect hook", () => {
    const vnode3 = () => {
      const [value, setValue] = state<string>("Waiting");
      const [trigger, setTrigger] = state<boolean>(false);

      effect(() => {
        let fetched = false;

        fetch("https://catfact.ninja/fact")
          .then(res => res.json())
          .then(data => {
            if (!fetched) setValue(data.fact);
          })
          .catch(err => console.error(err));

        return () => (fetched = true);
      }, [trigger]);

      return (
        <div>
          <h1>{value}</h1>
          <button onClick={() => setTrigger(!trigger)}></button>
        </div>
      );
    };

    buildHelper(vnode3);

    expect(document.querySelector("h1")?.innerHTML).toBe("Waiting");
    document
      .querySelector("button")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    setTimeout(
      () => assert(document.body.querySelector("h1")?.innerHTML != "Waiting"),
      1000
    );
  });

  /**
   * Tests writeable store and store hook.
   */
  test("Should update at the same time", () => {
    const testStore = writable("initial");

    const vnode4 = () => {
      const [value, setValue] = store(testStore);
      return (
        <div>
          <p>{value}</p>
          <button onClick={() => setValue("changed")}></button>
        </div>
      );
    };

    buildHelper(vnode4);
    expect(document.querySelector("p")?.innerHTML).toBe("initial");
    document
      .querySelector("button")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(document.querySelector("p")?.innerHTML).toBe("changed");
  });

  /**
   * Tests simple derivation from a store.
   */
  test("Should derive a number double the current value", () => {
    const vnode5 = () => {
      const globalValue = writable(2);
      const [doubled] = derivedBy(globalValue, n => n * 2);
      return <p>{doubled.toString()}</p>;
    };

    buildHelper(vnode5);
    expect(document.body.querySelector("p")?.innerHTML).toBe("4");
  });

  /**
   * Tests simple derivation using a state variable.
   */
  test("Should derive from state value", () => {
    const globalValue = writable(2);

    const vnode6 = () => {
      const [, setCount] = store(globalValue);
      const [value] = state<number>(2);
      const [doubled] = derivedBy(globalValue, n => n * value);
      return (
        <div>
          <p>{doubled.toString()}</p>
          <button onClick={() => setCount(4)}></button>
        </div>
      );
    };

    buildHelper(vnode6);
    expect(document.body.querySelector("p")?.innerHTML).toBe("4");
    document.body
      .querySelector("button")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(document.body.querySelector("p")?.innerHTML).toBe("8");
  });

  /**
   * Tests reading and wrting from a store.
   */
  test("Should build a readable store", () => {
    const contextStore = readable<string>("light");

    const vnode7 = () => {
      const [value, setValue] = store(contextStore);
      return (
        <div>
          <p>{value}</p>
          <button onClick={() => setValue("dark")}></button>
        </div>
      );
    };

    buildHelper(vnode7);
    expect(document.body.querySelector("p")?.innerHTML).toBe("light");
    document.body
      .querySelector("button")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    assert(document.body.querySelector("p")?.innerHTML != "dark");
  });
});
