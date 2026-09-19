// ESLint 9 flat config: Astro + TypeScript.
//
// Notes:
// - astro.configs["flat/recommended"] MUST be spread at the top level (not
//   inside a `files`-scoped block), so its per-file entries — in particular
//   `astro/base/typescript` for `**/*.astro/*.ts` — keep their own file
//   patterns and the astro parser stays in charge of `*.astro` files.
// - Formatting is owned by Prettier; eslint-config-prettier (last entry)
//   disables stylistic rules that would conflict with it.
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["dist/", ".astro/", "node_modules/", ".zcode/", ".agents/", ".wrangler/"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    // Node globals for config files, endpoints and lib code (Astro
    // components already get browser + Astro globals from astro/base).
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  // Turn off stylistic rules that conflict with Prettier (must be last).
  eslintConfigPrettier
);
