import { test, describe, afterAll, beforeAll } from "vitest";
import { comptime } from "comptime/vite";
import { comptime as betterComptime } from "better-comptime/vite";
import { createServer, type ViteDevServer } from "vite";
import { writeFile, rm, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";

beforeAll(async () => {
  await mkdir("./test-files");
});
afterAll(async () => {
  await rm("./test-files", { recursive: true });
});

describe.concurrent("comptime vs better-comptime", async () => {
  const comptimeServer = await createServer({
    configFile: false,
    plugins: [comptime()],
    server: { port: 0 },
    logLevel: "silent",
  });

  const betterComptimeServer = await createServer({
    configFile: false,
    plugins: [betterComptime()],
    server: { port: 0 },
    logLevel: "silent",
  });

  const cheapBody = `() => Math.random() + Math.random()`;
  const mediumBody = `() => Math.random() * 150 + Math.sin(Date.now())`;
  const expensiveBody = `() => {
    let a = 0, b = 1;
    for (let i = 0; i < 50; i++) [a, b] = [b * 2 + a, a + b];
    return a;
  }`;

  const runTransformEval = async (server: ViteDevServer, body: string) => {
    const source = `
      import { comptime } from "comptime/vite";

      const result = comptime(${body});
      console.log(result);
    `;
    const hash = createHash("sha256").update(source).digest("hex");
    const fileName = `./test-files/${hash}.ts`;
    await writeFile(fileName, source);

    await server.transformRequest(fileName);
  };

  test("transform + eval (cheap)", async ({ bench }) => {
    await bench.compare(
      bench("comptime", async () => {
        await runTransformEval(comptimeServer, cheapBody);
      }),
      bench("better-comptime", async () => {
        await runTransformEval(betterComptimeServer, cheapBody);
      }),
    );
  });
  test("transform + eval (medium)", async ({ bench }) => {
    await bench.compare(
      bench("comptime", async () => {
        await runTransformEval(comptimeServer, mediumBody);
      }),
      bench("better-comptime", async () => {
        await runTransformEval(betterComptimeServer, mediumBody);
      }),
    );
  });
  test("transform + eval (expensive)", async ({ bench }) => {
    await bench.compare(
      bench("comptime", async () => {
        await runTransformEval(comptimeServer, expensiveBody);
      }),
      bench("better-comptime", async () => {
        await runTransformEval(betterComptimeServer, expensiveBody);
      }),
    );
  });
});
