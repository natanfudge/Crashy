module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        sourceType: "module",
    },
    ignorePatterns: [
        "/lib/**/*", // Ignore built files.
    ],
    plugins: [
        "@typescript-eslint"
    ],
    rules: {
        "@typescript-eslint/strict-boolean-expressions": ["error", {"allowString":  false, "allowNumber" :  false, "allowNullableObject":  false}],
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
        "require-atomic-updates": "warn",
        "array-callback-return": "warn",
        "class-methods-use-this": "warn",
        "curly": ["warn", "multi-line"],
        "default-param-last": "warn",
        "no-constructor-return": "error",
        "no-extend-native": "off",
        "no-extra-bind": "warn",
        "no-extra-label": "warn",
        "no-implicit-coercion": "error",
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-new": "warn",
        "no-new-func": "warn",
        "no-new-wrappers": "error",
        "no-proto": "error",
        "no-return-assign": "error",
        "no-script-url": "error",
        "no-self-compare": "warn",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-useless-call": "warn",
        "no-useless-concat": "warn",
        "@typescript-eslint/no-base-to-string": "warn"
    },
    overrides: [
        {
            "files": [
                "**/*.ts?(x)"
            ],
            "rules": {
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/no-non-null-assertion" : "off",
                "@typescript-eslint/restrict-plus-operands" : "off",
                "@typescript-eslint/no-namespace": "off",
                "eqeqeq": "off"
            }
        }
    ]
};
