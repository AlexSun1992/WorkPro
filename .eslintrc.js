module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:vue/essential",
    "plugin:vue/vue3-recommended",
    "plugin:nuxt/recommended",
    "prettier",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  env: {
    es6: true,
  },
};
