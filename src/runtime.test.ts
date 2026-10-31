import { describe, expect, test } from "bun:test";
import { comptime } from "./runtime";

describe.concurrent("runtime stub", () => {
  test("throws when the plugin did not replace a comptime call", () => {
    expect(() => comptime(() => 1)).toThrow("Missing comptime() plugin");
  });

  test("is typed as an identity helper", () => {
    // eslint-disable-next-line
    if (false) {
      let value: "hi" = comptime((): "hi" => "hi");
      expect(value).toBe("hi");
    }
  });

  test("awaits promise-returning bodies in the type signature", () => {
    // eslint-disable-next-line
    if (false) {
      let value: "hi" = comptime(async (): Promise<"hi"> => "hi");
      expect(value).toBe("hi");
    }
  });
});
