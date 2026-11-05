import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import ts from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    extends: [js.configs.recommended, ...ts.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      nextPlugin.configs["core-web-vitals"],
      reactHooks.configs.flat.recommended,
    ],
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
]);
