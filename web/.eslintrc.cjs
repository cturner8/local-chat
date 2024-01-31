module.exports = {
  root: true,
  plugins: ["vue", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-strongly-recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-type-checked",
    // "plugin:@typescript-eslint/stylistic-type-checked",
    // "plugin:@typescript-eslint/strict",
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    "no-console": "error",
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
  },
};
