import { comptime } from "better-comptime";

const assetUrl = comptime(() => new URL("/manual?chapter=serializers", "https://example.com"));
const target = document.querySelector("#asset");

if (target instanceof HTMLAnchorElement) {
  target.href = assetUrl.href;
  target.textContent = assetUrl.href;
}
