import { comptime } from "better-comptime";

const html = comptime(async () => {
  const { render } = await import("preact-render-to-string");
  const { Article } = await import("./Article");

  const details = [
    { label: "renderer", value: "preact-render-to-string" },
    { label: "component", value: "Article.tsx" },
    { label: "timing", value: "inside comptime()" },
    { label: "runtime", value: "static HTML string" },
  ];

  return render(
    <Article details={details} eyebrow="comptime preact" title="Rendered before the bundle runs" />,
  );
});
const output = document.querySelector("#output");

if (output) {
  output.innerHTML = html;
}

console.log(html);
