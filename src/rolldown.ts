import { createCore } from "./shared";
import { ModuleRunnerEvaluator } from "./evaluator";

import type { Plugin } from "rolldown";
import type { Options } from "./shared";

export type { Serializer } from "./shared";

export function comptime(options?: Options) {
  let evaluator: ModuleRunnerEvaluator | undefined;
  const core = createCore({ getEvaluator, options });

  function getEvaluator() {
    if (evaluator) return evaluator;
    throw new Error("comptime evaluator was used before buildStart");
  }

  const plugin: Plugin = {
    name: "comptime",
    buildStart() {
      evaluator = new ModuleRunnerEvaluator({ core });
    },
    resolveId(id) {
      return core.resolveId(id);
    },
    load(id) {
      return core.load(id);
    },
    async transform(code, id, meta) {
      evaluator?.setHost({
        resolve: async (source, importer) => {
          const resolved = await this.resolve(source, importer);
          if (!resolved) return null;

          return {
            external: resolved.external === true || resolved.external === "absolute",
            id: resolved.id,
          };
        },
        load: async (id) => {
          const loaded = await this.load({ id, resolveDependencies: false });
          return loaded.code;
        },
      });
      try {
        const result = await core.transform(
          code,
          id,
          {
            addWatchFile: this.addWatchFile.bind(this),
            resolve: async (source, importer) => {
              const resolved = await this.resolve(source, importer);
              if (!resolved || resolved.external) return null;
              return resolved.id;
            },
          },
          meta.magicString,
        );
        return result ?? undefined;
      } finally {
        evaluator?.setHost(undefined);
      }
    },
    watchChange(id) {
      core.invalidate(id);
    },
    async buildEnd() {
      await evaluator?.dispose();
    },
  };

  return plugin;
}
