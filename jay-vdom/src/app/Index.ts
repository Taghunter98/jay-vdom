import createElement from "../createElement";
import { button, div, h1, h3 } from "../elements";
import { state } from "../hooks";
import { renderComponent } from "../render";
import { Counter, Gif } from "./Counter";

export default function Index(darkMode: boolean) {
  const [dark, setDark] = state<boolean>(darkMode);

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

  return div(
    {
      style: `display: flex; flex-direction: column; gap: 20; ${
        dark ? "background: black; color: white" : ""
      }`,
    },

    h1("Hello World!"),
    h3(dark ? "Dark Mode" : "Light Mode"),
    "The current count is: " + count,
    "The current state is: " + rendered,
    h3(name),

    button({ type: "button", onClick: clickHandler }, "Click Me"),
    button(
      {
        type: "button",
        onClick: () => {
          setDark(prev => !prev);
        },
      },
      dark ? "Dark Mode" : "Light Mode"
    ),

    Counter(),
    Gif()
  );
}
