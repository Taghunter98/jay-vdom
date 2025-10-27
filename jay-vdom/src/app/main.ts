import { div } from "../elements";
import { build } from "../main";
import { renderComponent } from "../render";
import Index from "./Index";

function App() {
  return div(
    {
      id: "app",
      style: "font-family: sans-serif",
    },
    renderComponent(Index, false)
  );
}

build(App);
