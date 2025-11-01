import { effect, state } from "../hooks";

function customEffectHook({ count }: { count: number }) {
  effect(() => {
    console.log("It works");
    console.log("New Count:", count);

    return () => console.log("Cleaning up shit");
  }, [count]);
}

/**
 * Smaller nested component.
 *
 * @returns
 */
export function Counter() {
  const [count, setCount] = state<number>(0);

  // Effect hook test
  customEffectHook({ count });

  function clickHandler() {
    setCount(c => c + 1);
  }

  return (
    <div style="display: flex; flex-direction: column; gap: 15px;">
      <h1>My Counter</h1>
      <button type="button" onClick={clickHandler}>
        {count.toString()}
      </button>
    </div>
  );
}

export function Name({ value }: { value: string }) {
  const [name, setName] = state<string>(value);

  const names = ["Josh", value, "Beth", "Cheryl"];

  function handleClick() {
    setName(names[Math.floor(Math.random() * 4)]);
  }

  return (
    <div>
      <h1>{name}</h1>
      <button onClick={handleClick}>Change Name</button>
    </div>
  );
}

export function Gif() {
  return (
    <div>
      <h1>Cool Dog Gif</h1>
      <img
        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnpuOTFsbmQ0bHByczlyeG1jcGttdW8yOGk0cnBkaTlvOWVyMXJndSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jp2KXzsPtoKFG/giphy.gif"
        style="width: 500px; height: 500px;"
      />
    </div>
  );
}
