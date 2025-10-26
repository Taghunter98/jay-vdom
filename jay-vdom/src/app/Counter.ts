import createElement from "../createElement";
import { state } from "../hooks";

/**
 * Smaller nested component.
 *
 * @returns
 */
export function Counter() {
  const [count, setCount] = state<number>(0);

  return createElement(
    "button",
    {
      type: "button",
      onClick: () => setCount(c => c + 1),
    },
    [count.toString()]
  );
}

export function Gif() {
  return createElement(
    "img",
    {
      src: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnpuOTFsbmQ0bHByczlyeG1jcGttdW8yOGk0cnBkaTlvOWVyMXJndSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jp2KXzsPtoKFG/giphy.gif",
      style: "width: 500px; height: 500px;",
    },
    []
  );
}
