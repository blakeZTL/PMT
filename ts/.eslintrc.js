module.exports = {
  ignorePatterns: ["dist", "node_modules"],
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    // 'plugin:import/recommended',

    "prettier",
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  // parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "@typescript-eslint/no-use-before-define": ["error", { functions: false }],
    "no-underscore-dangle": "off",
    "no-console": ["error", { allow: ["info", "error", "warn", "debug"] }],
    "import/prefer-default-export": "off",
    "import/extensions": "off",
  },
};
