export const env = {
    browser: true,
    commonjs: true,
    es6: true,
};
export const extendsConfig = ["plugin:@typescript-eslint/recommended", "prettier", "plugin:prettier/recommended"];
export const parser = "@typescript-eslint/parser";
export const parserOptions = {
    project: "./tsconfig.json",
    sourceType: "module",
};
export const plugins = ["@typescript-eslint", "prettier"];
export const rules = {
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": "error",
};
