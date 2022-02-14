module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "google",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        sourceType: "module",
    },
    ignorePatterns: [
        "/lib/**/*", // Ignore built files.
    ],
    plugins: [
        "@typescript-eslint",
        "import",
    ],
    rules: {
        "quotes": ["error", "double"],
        "import/no-unresolved": 0,
        "max-len": [1, 160],
        "indent": 0,
        "no-unused-vars": 1,
        "comma-dangle": 0,
        "no-trailing-spaces": 0,
        "padded-blocks": 0,
        "spaced-comment": 0,
        "eol-last": 0,
        "require-jsdoc": 0,
        "linebreak-style": 0,
        "valid-jsdoc": 0,
        "no-non-null-assertion": 0,
        "semi": 0,
        "arrow-parens": 0,
        "camelcase": 0
    },
};
