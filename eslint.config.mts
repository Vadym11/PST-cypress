import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import pluginCypress from 'eslint-plugin-cypress';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginCypress.configs.recommended,
  pluginCypress.configs.globals,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      // Fixes the @ts-ignore vs @ts-expect-error nag
      "@typescript-eslint/ban-ts-comment": "off" 
    }
  },

  {
    // Apply Node rules to BOTH config files and the example files using require
    files: [
      "*.config.js", 
      "*.config.ts", 
      "*.config.mts", 
      "**/2-advanced-examples/files.cy.js" // Fixes the error in this specific file
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    }
  },

  {
    files: ["**/*.cy.{js,ts}", "**/*.spec.{js,ts}"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "cypress/no-unnecessary-waiting": "warn",
    }
  }
]);
