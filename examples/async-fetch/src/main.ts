import { comptime } from "better-comptime";

type Payload = {
  source: string;
  values: number[];
  total: number;
};

const payload = comptime<Payload>(async () => {
  const response = await fetch(
    "data:application/json,%7B%22source%22%3A%22data-url%22%2C%22values%22%3A%5B3%2C5%2C8%2C13%5D%7D",
  );
  const value: unknown = await response.json();
  return readPayload(value);

  function readPayload(input: unknown): Payload {
    if (!isRecord(input) || typeof input.source !== "string" || !Array.isArray(input.values)) {
      throw new Error("Unexpected payload shape");
    }

    const values = input.values.filter((item) => typeof item === "number");
    return {
      source: input.source,
      values,
      total: values.reduce((sum, item) => sum + item, 0),
    };
  }

  function isRecord(input: unknown): input is Record<string, unknown> {
    return typeof input === "object" && input !== null;
  }
});

const target = document.querySelector("#payload");

if (target) {
  target.textContent = JSON.stringify(payload, null, 2);
}
