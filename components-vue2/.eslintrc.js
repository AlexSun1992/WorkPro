module.exports = {
  extends: ["plugin:vue/base"],
  rules: {
    "no-console": "off",
    "no-debugger": "off",
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  ecmaFeatures: {
    modules: true,
  },
};
