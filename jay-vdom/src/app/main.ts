import createElement from "../createElement";
import { build } from "../main";
import { renderComponent } from "../render";
import Index from "./Index";

function App() {
  return createElement(
    "div",
    {
      id: "app",
      style: "font-family: sans-serif",
    },
    [renderComponent(Index)]
  );
}

build(App);
