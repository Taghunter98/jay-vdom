import { div } from "../elements";
import { build } from "../main";
import { renderComponent } from "../render";
import Index from "./app";

function App() {
  return div(
    {
      id: "app",
    },
    renderComponent(Index)
  );
}

build(App);
