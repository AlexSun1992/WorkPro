module.exports = {
  extends: ["plugin:vue/base"],
  plugins: ["import", "vue"],
  rules: {
    "no-console": "off",
    "no-debugger": "off",
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  env: {
    es6: true,
  },
};
