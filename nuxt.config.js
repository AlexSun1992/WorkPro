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
    "~/plugins/validate",
    "~/plugins/axios",
    "~/plugins/moment",
    "~/plugins/vue-agile",
    { src: "~plugins/vcalendar.js", ssr: false },
    // { src: "~/plugins/load-script.js" },
    "~/plugins/loadScript.js",
    "~/plugins/quizCalculator.js",
    "~/plugins/fileUploader.js",
    "~/plugins/fileDownload.js",
    "~/plugins/carousel.js",
    "~/plugins/selectValue.js",
    "~/plugins/slick-carousel.js",
    "~/plugins/tooltip.js",
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
    transpile: ["vue-agile", "vue-plugin-load-script"],
  },
  proxy: {
    "/free": "https://mobile.reso.ru",
    "/am": "https://mobile2.reso.ru",
    "/main": "https://mobile2.reso.ru",
    "/suggestions": "https://dadata.reso.ru",
  },
  // serverMiddleware: ["~/api/api.js"],
  serverMiddleware: ["~/routes/routes.js"],
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
          //user: { url: "/api/userinfo", method: "get" },
          //user: { url: "/am/main/v2/userinfo", method: "get" },
          user: false,
          logout: false,
        },
        autoFetchUser: false,
      },
    },
    resetOnError: false,
    fullPathRedirect: true,
    redirect: {
      login: false,
      logout: false,
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
