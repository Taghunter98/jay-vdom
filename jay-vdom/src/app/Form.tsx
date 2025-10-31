import { state } from "../hooks";

export function Form() {
  const [username, setUsername] = state<string>("");
  const [password, setPassword] = state<string>("");
  const [result, setResult] = state<string>("");

  function inputHandler(e: InputEvent, type: "username" | "password") {
    const value = (e.target as HTMLInputElement).value;
    type === "username" ? setUsername(value) : setPassword(value);
  }

  return (
    <div style="display: flex; flex-direction: column; padding: 20px; border: solid 2px gray">
      <input
        style="display: flex; padding: 5px"
        onInput={(e: InputEvent) => inputHandler(e, "username")}
        placeholder="Enter username"
      />
      <input
        style="display: flex; padding: 5px"
        onInput={(e: InputEvent) => inputHandler(e, "password")}
        placeholder="Enter password"
      />
      <button onClick={() => setResult(username + " " + password)}>
        Submit
      </button>
      <h3>Result: {result}</h3>
    </div>
  );
}
