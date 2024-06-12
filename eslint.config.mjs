import antfu from "@antfu/eslint-config";
import preferArrowPlugin from "eslint-plugin-prefer-arrow-functions";
import promisePlugin from "eslint-plugin-promise";

export default antfu(
    {
        stylistic: {
            indent: 4,
            quotes: "double",
        },
        jsonc: false,
        yaml: true,
        typescript: {
            tsconfigPath: "tsconfig.json",
        },
        isInEditor: false,
        rules: {
            "antfu/if-newline": "off",
            "antfu/top-level-function": "off",
            "curly": ["error", "multi-line"],
            "no-console": "off",
            "node/prefer-global/buffer": ["error", "always"],
            "node/prefer-global/process": ["error", "always"],
            "style/arrow-parens": ["error", "always"],
            "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
            "style/max-statements-per-line": "off",
            "style/member-delimiter-style": ["error", {
                multiline: {
                    delimiter: "semi",
                    requireLast: true,
                },
                singleline: {
                    delimiter: "semi",
                    requireLast: false,
                },
                multilineDetection: "brackets",
            }],
            "style/semi": ["error", "always"],

            // Prefer arrow plugin
            "prefer-arrow/prefer-arrow-functions": "off", // Broken

            // Promise plugin
            "promise/always-return": "off",
            "promise/no-return-wrap": "error",
            "promise/param-names": "error",
            "promise/catch-or-return": "error",
            "promise/no-native": "off",
            "promise/no-nesting": "error",
            "promise/no-promise-in-callback": "off",
            "promise/no-callback-in-promise": "off",
            "promise/avoid-new": "off",
            "promise/no-new-statics": "error",
            "promise/no-return-in-finally": "warn",
            "promise/valid-params": "warn",
        },
        plugins: {
            "prefer-arrow": {
                rules: preferArrowPlugin.rules,
            },
            "promise": {
                rules: promisePlugin.rules,
            },
        },
    },
    {
        files: ["**/*.ts"],
        rules: {
            "ts/no-misused-promises": ["error", { checksVoidReturn: { arguments: false } }],
            "ts/no-use-before-define": "off",
            "ts/strict-boolean-expressions": ["error", { allowString: false, allowNumber: false, allowNullableObject: false }],
        },
    },
);
