import { defineConfig } from "tsdown/config";

export default defineConfig({
  entry: ["./src/runtime.ts", "./src/rolldown.ts", "./src/vite.ts"],
  clean: true,
  minify: true,
  publint: true,
});
