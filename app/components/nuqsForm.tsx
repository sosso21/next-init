"use client";
import { useQueryState, parseAsInteger } from "nuqs";

export const Nuqs = () => {
  const [count, setCount] = useQueryState("count", parseAsInteger);
  return (
    <>
      <pre>count: {count}</pre>
      <button onClick={() => setCount(0)}>Reset</button>
      {/* handling null values in setCount is annoying: */}
      <button
        className="rounded bg-primary text-primary-foreground"
        onClick={() => setCount((c) => (c ?? 0) + 1)}
      >
        +
      </button>
      <button
        className="rounded bg-secondary text-secondary-foreground"
        onClick={() => setCount((c) => (c ?? 0) - 1)}
      >
        -
      </button>
      <button onClick={() => setCount(0)}>Clear</button>
    </>
  );
};
