module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:vue/essential",
    "plugin:nuxt/recommended",
    "prettier",
    "plugin:import/errors",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    parser: "@babel/eslint-parser",

    requireConfigFile: false,
  },
  rules: {
    // VUE + NUXT
    "vue/no-v-html": "off",
    "vue/no-reserved-component-names": "off",
    "vue/no-v-text-v-html-on-component": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-side-effects-in-computed-properties": "off",

    // IMPORT
    "import/extensions": [
      "error",
      "never",
      {
        ".js": "ignore",
        ".jsx": "ignore",
        ".mjs": "ignore",
        ".cjs": "ignore",
        "vue": "ignore",
      },
    ],
    "import/no-relative-packages": "off",
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-import-module-exports": "off",

    // NO-*
    "no-constant-condition": "off",
    "no-loop-func": "off",
    "no-unused-vars": "off",
    "no-console": "off",
    "no-underscore-dangle": "off",
    "no-param-reassign": "off",
    "no-plusplus": "off",
    "no-unsafe-optional-chaining": "off",
    "no-undef": "off",
    "no-useless-escape": "off",
    "no-return-await": "off",
    "no-restricted-syntax": "off",
    "no-template-curly-in-string": "off",
    "no-use-before-define": "off",
    "no-inner-declarations": "off",
    "no-restricted-globals": "off",
    "no-shadow": "off",

    // JS
    eqeqeq: "off",
    radix: "off",
    camelcase: "off",
    "default-param-last": "off",
    "consistent-return": "off",
  },
  env: {
    jest: true,
    es6: true,
  },
};
