module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    extends: ["plugin:@typescript-eslint/recommended"],  // Inherit recommended ruleset
    rules: {
        "block-spacing": ["error", "never"],
        "array-bracket-spacing": ["error", "never"],
        "computed-property-spacing": ["error", "never"],
        "space-before-blocks": ["error", "always"],
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/semi": ["error", "always"],
        "@typescript-eslint/quotes": ["error", "double"],
        "@typescript-eslint/object-curly-spacing": ["error", "never"],
        "comma-dangle":["error", "always-multiline"],
        "@typescript-eslint/indent": ["error", 4],  // indent with 4 spaces
        "@typescript-eslint/no-explicit-any": "off",
        "func-call-spacing": ["error","never"],
        "@typescript-eslint/func-call-spacing": ["error"],
        "eol-last": ["error", "always"],
        "@typescript-eslint/explicit-function-return-type":["error"],
        "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 0 }],
        "max-len": ["error", {
          code: 100,
          ignoreUrls: true,
        }],
    },
};

