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
        "quotes": 0,
        "max-len": 0,
        "semi": 0,
        "padded-blocks": 0,
        "comma-dangle": 0,
        "eol-last": 0,
        "import/no-unresolved": 0,
        "indent": 0,
        "key-spacing": 0,
        "spaced-comment": 0,
        "comma-spacing": 0,
    },
};
