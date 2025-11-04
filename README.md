# Jay VDOM

A framework that brings the best of both Svelte and React into one simple but deceptively powerful package.

## Features

- Full Virtual DOM with diffing.
- Custom JSX runtime with full intelisense.
- State management APIs.
- Event binding and traditional event listeners.
- Effects with optional cleanup.
- Writeable and readonly stores.
- Derived and derived by hooks.
- Templating APIs.
- Batched rendering - coming soon.
- Build script - coming soon.

## Quick Setup

Currently Jay VDOM is not published on NPM, either link or build the project to access the APIs.

### NPM Link

```sh
npm link

# Create a new project
npm create vite@latest
cd vite-app
npm link jay-vdom
```

### NPM Build

```sh
npm pack

# Create a new project
npm create vite@latest
npm install
```

### App Config

The entrypoint for the app needs to be `main.ts`, inside create the scaffold and call the `build` API.

```ts
import { build } from "jay-vdom";
import { renderComponent } from "jay-vdom";
import Index from "./Index";
import { createElement } from "jay-vdom";

function App() {
  return createElement(
    "div",
    {
      id: "app",
    },
    [renderComponent(Index)]
  );
}

build(App);
```

### Router

Create an `Index.tsx` file and import `Router` and `Link`.

- `dataKey` attribute is responsible for the link text as well and will be capitalised.
- `url` attribute tells the router to update the url from the given `dataKey`.

```tsx
import { Link, Router } from "jay-vdom";

export default function Index() {
  return (
    <Router url={true}>
      <Link dataKey="Counter">
        <h1>Hello World!</h1>
      </Link>
      <Link dataKey="Gif">
        <h1>Page 2! :)</h1>
      </Link>
    </Router>
  );
}
```

### JSX Configuration

Inside the `tsconfig.json` add these to use the custom runtime.

```json
{
  "jsx": "react-jsx",
  "jsxImportSource": "jay-vdom"
}
```

### Run with Vite

Now simply run `npm run dev` and see the glorious hello world message!

- Install Tailwind the same as any vite based project.

## Main APIs

All the APIs are documented with examples and provide intelisense to help you build UI elements.

### state

Hook allows for a variable to persist in component's state.

State can be optionally typed and returns the value and setter method.

```tsx
function Counter() {
  const [count, setCount] = state<number>(0);

  return (
    <h1>{count.toString()}</h1>
    <button
      onClick={ () => setCount(n => n + 1) }
    >
      Increment
    </button>
  )
}
```

### effect

Hook runs every component render, use it for syncing with external systems.

Add dependencies, which will cause the hook to re-run when they change, leave blank to run once.

Run a fetch request on mount.

```tsx
function CatFact() {
  const [fact, setFact] = state<string | null>(null);

  effect(() => {
    let fetched = false;

    fetch("/fact")
      .then(res => res.json())
      .then(data => {
        if (!fetched) setFact(data.fact);
      })
      .catch(err => console.error(err));

    return () => (fetched = true);
  }, []);
}
```

Run a fetch when a state variable changes.

```tsx
function CatFact() {
  const [fact, setFact] = state<string | null>(null);
  const [refresh, setRefresh] = state<boolean>(false);

  effect(() => {
    let fetched = false;
    fetch("/fact")
      .then(res => res.json())
      .then(data => {
        if (!fetched) setFact(data.fact);
      })
      .catch(err => console.error(err));

    return () => (fetched = true);
  }, [refresh]);
}
```

You can also use an effect in a helper function.

```ts
function fetchCatFact({ setData }: { setData: (d) => void }) {
  effect(() => {
    let fetched = false;
    fetch("/fact")
      .then(res => res.json())
      .then(data => {
        if (!fetched) setFact(data.fact);
      })
      .catch(err => console.error(err));

    return () => (fetched = true);
  }, []);
}

// Use in another component
function CatFact() {
  const [data, setData] = state<string | null>(null);

  fetchCatFact({ setData });
}
```

### writable

Function creates a writeable store for data sharing across components.

Optionally type for type safety.

```tsx
const myStore = writeable<number>(0);

function TestStore() {
  const [value, setValue] = store(myStore);
  return (
    <div>
      <p>{value.toString()}</p>
      <button onClick={() => setValue(2)}>Update Store</button>
    </div>
  );
}
```

### readable

Function creates a readable store for data sharing across components.

Optionally type for type safety.

```tsx
const myStore = readable<number>(0);

function TestStore() {
  const [value] = store(myStore);
  return <p>{value.toString()}</p>;
}
```

### store

Hook runs once per component render and retrieves the current value from a `writeable` data store.

We can setup two components to subscribe to a given writable store.

```tsx
// Setup a global store
const globalCount = writeable<number>(0);

function Counter() {
  state[(count, setCount)] = store<number>(globalStore);

  function updateCounter() {
    setCount(c => c + 1);
  }

  return <button onClick={updateCounter}>Update</button>;
}

function DisplayCounter() {
  const [count] = store(globalCount);

  return (
    <div>
      <p>Count {count.tostring()}</p>
      <Counter />
    </div>
  );
}
```

### derivedBy

Hook runs once per component render and derives a value from a store.

```tsx
const counter = writable(0);

function Counter() {
  const [count, setCount] = store(counter);
  const [derivedCount] = derivedBy(counter, c => c + 2);

  return (
    <div>
      <p>Actual count: {count}</p>
      <p>Derived count: {derivedCount}</p>
    </div>
  );
}
```
