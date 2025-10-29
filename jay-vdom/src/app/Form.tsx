import { state } from "../hooks";

export function Form() {
  const [data, setData] = state<string>("");

  function inputHandler(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value;
    setData(value);
  }

  return (
    <div>
      <input onInput={inputHandler} placeholder="Enter name" />
      <h3>Name: {data}</h3>
    </div>
  );
}
