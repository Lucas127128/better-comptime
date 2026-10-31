import { comptime } from "better-comptime";

const message = comptime<string>(() => readReleaseManifest());

const target = document.querySelector("#message");

if (target instanceof HTMLElement) {
  target.textContent = message;
}

function readReleaseManifest(): string {
  throw new Error("missing RELEASE_MANIFEST_PATH for errors example");
}
