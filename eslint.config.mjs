import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Junk descargado por accidente en Create Next App (ver AGENTS.md).
    "public/icons/Create Next App.html",
    "public/icons/Create Next App_files/**",
    // Prisma v7 generated client.
    "generated/**",
  ]),
]);

export default eslintConfig;
