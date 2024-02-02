module.exports = {
  root: true,
  plugins: ["vue", "@typescript-eslint", "prettier", "html"],
  extends: [
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:vue/vue3-strongly-recommended",
    // "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:@typescript-eslint/strict",
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    "prettier/prettier": "error",
    "no-console": "error",
    "vue/multi-word-component-names": "off",
    "vue/max-attributes-per-line": "off",
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
    extraFileExtensions: [".vue"],
  },
};
