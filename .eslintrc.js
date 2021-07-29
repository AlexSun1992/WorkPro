module.exports = {
  extends: ["plugin:vue/vue3-recommended"],
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
