import createElement from "../createElement";
import { button, div, h1, img } from "../elements";
import { state } from "../hooks";

/**
 * Smaller nested component.
 *
 * @returns
 */
export function Counter() {
  const [count, setCount] = state<number>(0);

  return div(
    button(
      {
        type: "button",
        onClick: () => setCount(c => c + 1),
      },
      count.toString()
    ),
    Name("Steve")
  );
}

function Name(value: string) {
  const [name, setName] = state<string>(value);

  setTimeout(() => {
    const names = ["Josh", value, "Beth", "Cheryl"];
    setName(names[Math.floor(Math.random() * 4)]);
  }, 3000);

  return div({ id: "div-id" }, h1(name));
}

export function Gif() {
  return img({
    src: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnpuOTFsbmQ0bHByczlyeG1jcGttdW8yOGk0cnBkaTlvOWVyMXJndSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jp2KXzsPtoKFG/giphy.gif",
    style: "width: 500px; height: 500px;",
  });
}
