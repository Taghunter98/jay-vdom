import { Link } from "../elements";
import Router from "../router";
import { Counter, Gif, Name } from "./Counter";
import { Form } from "./Form";

export default function Index() {
  return (
    <div>
      <Router class="navbar">
        <Link class="flex p-8 bg-violet-300" dataKey="Counter">
          <Counter />
        </Link>
        <Link class="link-style" dataKey="Gif">
          <Gif />
        </Link>
        <Link class="link-style" dataKey="Test Name">
          <Name value="TESTING" />
        </Link>
        <Link dataKey="Cool form">
          <Form />
        </Link>
      </Router>
    </div>
  );
}
