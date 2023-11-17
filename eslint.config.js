/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable ts/no-unsafe-assignment */
const antfu = require("@antfu/eslint-config").default;
const preferArrowPlugin = require("eslint-plugin-prefer-arrow-functions");
const promisePlugin = require("eslint-plugin-promise");

module.exports = antfu({
    stylistic: {
        indent: 4,
        quotes: "double",
    },
    jsonc: false,
    yaml: false,
    typescript: {
        tsconfigPath: "tsconfig.json",
    },
    rules: {
        "antfu/if-newline": "off",
        "antfu/top-level-function": "off",
        "curly": ["error", "multi-line"],
        "no-console": "off",
        "node/prefer-global/process": ["error", "always"],
        "prefer-arrow/prefer-arrow-functions": ["error"],
        "style/brace-style": ["error", "1tbs", { allowSingleLine: true }],
        "style/max-statements-per-line": "off",
        "style/semi": ["error", "always"],
        "ts/no-use-before-define": "off",
    },
    plugins: {
        "prefer-arrow": {
            rules: preferArrowPlugin.rules,
        },
        "promise": {
            rules: promisePlugin.rules,
        },
    },
});
