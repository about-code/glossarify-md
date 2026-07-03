import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/node_modules/", "test/node_modules/**/*"]), {
    extends: compat.extends("eslint:recommended"),

    languageOptions: {
        globals: {
            ...Object.fromEntries(Object.entries(globals.commonjs).map(([key]) => [key, "off"])),
            ...globals.node,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
        },

        ecmaVersion: 2020,
        sourceType: "module",
    },

    rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],

        indent: ["error", 4, {
            SwitchCase: 1,
        }],

        "dot-location": ["error", "property"],
        "dot-notation": ["error"],
        "linebreak-style": ["error", "unix"],

        "newline-per-chained-call": ["error", {
            ignoreChainWithDepth: 2,
        }],

        "brace-style": ["error", "1tbs", {
            allowSingleLine: true,
        }],

        curly: ["error", "all"],
        "eol-last": ["error", "always"],

        "no-multiple-empty-lines": ["error", {
            max: 2,
            maxEOF: 1,
            maxBOF: 0,
        }],

        "no-trailing-spaces": ["error"],

        "space-before-blocks": ["error", {
            functions: "always",
            keywords: "always",
            classes: "always",
        }],

        "block-spacing": ["error", "always"],

        "keyword-spacing": ["error", {
            before: true,
            after: true,
        }],

        "spaced-comment": ["warn", "always", {
            exceptions: ["_", "-", "="],
        }],

        "comma-dangle": ["error", "never"],
        "comma-style": ["warn", "first"],
        "guard-for-in": ["error"],
        eqeqeq: ["error", "always"],
        "no-extra-bind": ["error"],
        "no-eval": ["error"],
    },
}]);