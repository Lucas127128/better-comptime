import { comptime } from "better-comptime";
import { fibonacci } from "./math";

const input = 12;
const value = comptime(() => fibonacci(input));
const message = `fibonacci(${input}) = ${value}`;
const output = document.querySelector("#output");

if (output) {
  output.textContent = message;
}

console.log(message);
