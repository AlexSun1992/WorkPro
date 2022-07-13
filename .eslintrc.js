module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:vue/essential",
    "plugin:nuxt/recommended",
    "prettier",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  rules: {
    // https://github.com/prettier/eslint-plugin-prettier/issues/94#issuecomment-642336945
    "vue/max-attributes-per-line": "off",
    "import/prefer-default-export": "off",
    "eslint-disable-next-line": "off",
  },
  env: {
    jest: true,
    es6: true,
  },
};
