/* eslint-disable */
module.exports = {
  target: "universal",
  telemetry: false,
  generate: {
    minify: {
      collapseWhitespace: false,
    },
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    // script: [
    //   { src: 'https://www.google.com/recaptcha/api.js?render=6Le_5tkUAAAAAI4paHCeddGpgcZCJZ2aAHfZaCme' }
    // ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#3ea662" },
  /*
   ** Global CSS
   */
  css: [
    { src: "~/assets/scss/bootstrap/bootstrap", lang: "scss" },
    { src: "~/assets/scss/bootstrap/bootstrap-grid", lang: "scss" },
    { src: "~/assets/scss/bootstrap/bootstrap-reboot", lang: "scss" },
    { src: "~/assets/scss/bootstrap/modal", lang: "scss" },
    { src: "~/assets/scss/font", lang: "scss" },
    { src: "~/assets/scss/_custom", lang: "scss" },
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    // '~plugins/devextreme',
    "~/plugins/captcha.js",
    "~/plugins/mask.js",
    "~/plugins/vueTheMask.js",
    "~/plugins/validate",
    // "~/plugins/axios",
    "~/plugins/moment",
    "~/plugins/vue-agile",
    { src: "~plugins/vcalendar.js", ssr: false },
    "~/plugins/quizCalculator.js",
    "~/plugins/fileUploader.js",
    "~/plugins/fileDownload.js",
    "~/plugins/carousel.js",
    "~/plugins/selectValue.js",
    "~/plugins/slick-carousel.js",
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/router", "@nuxtjs/proxy"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    ["bootstrap-vue/nuxt", { css: false }],
    ["@nuxtjs/axios", { proxy: true }],
    "@nuxtjs/auth-next",
    ["cookie-universal-nuxt", { alias: "cookiz" }],
    "@nuxtjs/recaptcha",
  ],
  recaptcha: {
    hideBadge: false,
    siteKey: "6LcR59kUAAAAAN9gdxm2TWPCTey73RTAKGIOkTTV",
    version: 2, // Version
    size: "invisible",
    language: "ru",
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    vendor: ["axios"],
    extend(config, { isDev, isClient }) {
      config.resolve.alias.vue = "vue/dist/vue.common";
      if (isClient) config.devtool = "eval-source-map";
      else config.devtool = "inline-source-map";
    },
    transpile: ["vue-agile"],
  },
  proxy: {
    // Simple proxy
    "/wp-json": "http://wpress.reso.ru/",
    "/wp-content": "http://wpress.reso.ru/",
    // '/free': 'https://mobiletest.reso.ru',
    // '/am': 'https://mobiletest.reso.ru',
    // '/main': 'https://mobiletest.reso.ru',
    "/free": "https://mobile.reso.ru",
    "/am": "https://mobile2.reso.ru",
    "/main": "https://mobile.reso.ru",
  },
  serverMiddleware: [
    "~/api/index.js",
    "~/api/configurator.js",
    "~/api/list.js",
    "~/api/card.js",
    "~/api/dic.js",
    "~/api/wizard.js",
    "~/api/user.js",
    "~/api/refresh.js",
  ],
  auth: {
    strategies: {
      local: {
        scheme: "refresh",
        autoRefresh: {
          enable: true,
        },
        clientId: false,
        grantType: false,
        token: {
          property: "ACCESS_TOKEN",
          maxAge: 360000,
        },
        refreshToken: {
          property: "REFRESH_TOKEN",
          data: "REFRESH_TOKEN",
        },
        user: {
          property: false,
        },
        endpoints: {
          // login: { url: 'http://localhost:8000/api/authorize', method: 'post' },
          login: { url: "/am/auth/v2/authorize", method: "post" },
          refresh: { url: "/api/token_refresh", method: "post" },
          // user: { url: 'http://localhost:8000/api/userinfo', method: 'get' },
          user: { url: "/api/userinfo", method: "get" },
          logout: false,
        },
      },
    },
    resetOnError: false,
    fullPathRedirect: true,
    redirect: {
      login: false,
      logout: "/",
      home: false,
      user: false,
    },
    plugins: ["~/plugins/auth.js"],
  },
  server: {
    port: 8000, // default: 3000
    host: "0.0.0.0", // default: localhost
  },
};
