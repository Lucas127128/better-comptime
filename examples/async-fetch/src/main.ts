import { comptime } from "better-comptime";

type Payload = {
  source: string;
  values: number[];
  total: number;
};

type PayloadInput = {
  source?: unknown;
  values?: unknown;
};

const payload = comptime<Payload>(async () => {
  const response = await fetch(
    "data:application/json,%7B%22source%22%3A%22data-url%22%2C%22values%22%3A%5B3%2C5%2C8%2C13%5D%7D",
  );
  const value: unknown = await response.json();
  return readPayload(value);

  function readPayload(input: unknown) {
    if (typeof input !== "object" || input === null) {
      throw new Error("Unexpected payload shape");
    }

    const { source, values } = input as PayloadInput;
    if (typeof source !== "string" || !Array.isArray(values)) {
      throw new Error("Unexpected payload shape");
    }

    const numbers = values.filter((item) => typeof item === "number");
    return {
      source,
      values: numbers,
      total: numbers.reduce((sum, item) => sum + item, 0),
    };
  }
});

const target = document.querySelector("#payload");

if (target) {
  target.textContent = JSON.stringify(payload, null, 2);
}
