import createElement from "../createElement";
import { state } from "../hooks";
import { renderComponent } from "../render";
import { Counter, Gif } from "./Counter";

export default function Index() {
  const [dark, setDark] = state<boolean>(true);

  const [count, setCount] = state<number>(0);
  const [name, setName] = state<string>("Josh");
  const [rendered, setRendered] = state<number>(0);

  function clickHandler() {
    setRendered(prev => {
      const next = prev + 1;
      setName(next > 4 ? "CHANGED" : "Beth");
      return next;
    });
    setCount(prev => prev + 1);
  }

  return createElement(
    "div",
    {
      style: `display: flex; flex-direction: column; gap: 20; ${
        dark ? "background: black; color: white" : ""
      }`,
    },
    [
      createElement("h1", {}, ["Hello World!"]),
      createElement("h3", {}, [dark ? "Dark Mode" : "Light Mode"]),
      "The current count is: " + count,
      "The current state is: " + rendered,
      createElement("h3", {}, [name]),
      createElement("button", { type: "button", onClick: clickHandler }, [
        "Click Me",
      ]),
      createElement(
        "button",
        {
          type: "button",
          onClick: () => {
            setDark(prev => !prev);
          },
        },
        [dark ? "Dark Mode" : "Light Mode"]
      ),

      renderComponent(Counter), // Maybe call this during diffing?
      renderComponent(Gif),
    ]
  );
}
