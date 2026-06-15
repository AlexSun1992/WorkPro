module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:vue/strongly-recommended",
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
    "vue/no-reserved-component-names": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-side-effects-in-computed-properties": "off",
    "vue/component-definition-name-casing": ["error", "PascalCase"],
    "vue/padding-line-between-blocks": "error",
    "vue/order-in-components": "error",
    "vue/attributes-order": ["error", { alphabetical: false }],

    // vue props
    "vue/require-prop-types": "error",
    "vue/require-default-prop": "error",
    "vue/require-valid-default-prop": "error",

    // vue directives
    "vue/no-useless-v-bind": "error",
    "vue/no-v-html": "off",
    "vue/no-v-text-v-html-on-component": "off",
    "vue/v-bind-style": ["error", "shorthand"],
    "vue/v-on-style": ["error", "shorthand"],
    "vue/v-slot-style": ["error", "shorthand"],

    // "vue/no-unused-properties": [
    //   "warn",
    //   {
    //     groups: ["props", "data", "methods", "computed"],
    //   },
    // ],

    // IMPORT
    "import/extensions": [
      "error",
      "never",
      {
        ".js": "ignore",
        ".jsx": "ignore",
        ".mjs": "ignore",
        ".cjs": "ignore",
        vue: "ignore",
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
    "no-unused-vars": "off", // ["warn", { args: "none", ignoreRestSiblings: true }],
    "no-console": "off",
    "no-underscore-dangle": "off",
    "no-param-reassign": "off", // ["error", { props: false }],
    "no-plusplus": "off",
    "no-unsafe-optional-chaining": "off", // "error",
    "no-undef": "off",
    "no-useless-escape": "off",
    "no-return-await": "off",
    "no-restricted-syntax": "off",
    "no-template-curly-in-string": "off",
    "no-use-before-define": "off",
    "no-inner-declarations": "off",
    "no-restricted-globals": "off",
    "no-shadow": "off",
    "no-new-object": "error",
    "no-array-constructor": "error",
    "no-nested-ternary": "error",
    "no-else-return": ["error", { allowElseIf: false }],
    "no-unused-expressions": ["error", { allowShortCircuit: false, allowTernary: true, allowTaggedTemplates: true }],

    // JS
    eqeqeq: "off",
    radix: "off",
    camelcase: "off", // ["warn", { properties: "never" }],
    "default-param-last": "off", // "error",
    "consistent-return": "off",
    "func-names": "error",
    "prefer-template": "error",
    "no-implicit-coercion": ["error", { boolean: true, number: true, string: true, allow: [] }],
    "one-var": ["error", "never"],
    "object-shorthand": ["error", "always"],
    "prefer-object-spread": "error",
    "prefer-arrow-callback": "error",
    "arrow-body-style": ["error", "as-needed"],
    // curly: ["error", "all"],
  },
  env: {
    jest: true,
    es6: true,
  },
};
