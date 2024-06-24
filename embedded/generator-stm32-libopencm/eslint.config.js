import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticTs from '@stylistic/eslint-plugin-ts'
import tseslint from "typescript-eslint";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files:
      ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    plugins: {
      '@stylistic/ts': stylisticTs
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "no-multiple-empty-lines": [
        "error",
        {
          "max": 1,
          "maxEOF": 0
        }
      ]
    }
  }
];
