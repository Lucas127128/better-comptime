import { comptime } from "better-comptime";

const markdown = `
# Build-time markdown

This HTML was rendered by **md4x** inside \`comptime()\`.

| phase | shipped |
| --- | --- |
| markdown parser | no |
| final HTML | yes |

- no runtime parser
- no markdown AST in the browser
- no hydration step
`;

const html = comptime(async () => {
  let { renderToHtml } = await import("md4x/napi");
  return renderToHtml(markdown);
});

const article = document.querySelector("#article");

if (article) {
  article.innerHTML = html;
}
