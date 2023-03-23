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
    link: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/export/system/modules/ru.reso.v2/resources/img/favicon.svg",
      },
      {
        rel: "shortcut icon",
        type: "image/svg+xml",
        href: "/export/system/modules/ru.reso.v2/resources/img/favicon.svg",
      },
    ],
    //script: [
    //],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#3ea662" },
  /*
   ** Global CSS
   */
  css: [
    { src: "~/assets/scss/font2022", lang: "scss" },
    { src: "~/assets/scss/style2022", lang: "scss" },
    /*{ src: "~/assets/scss/bootstrap/bootstrap", lang: "scss" },
                    { src: "~/assets/scss/bootstrap/bootstrap-grid", lang: "scss" },
                    { src: "~/assets/scss/bootstrap/bootstrap-reboot", lang: "scss" },
                    { src: "~/assets/scss/bootstrap/modal", lang: "scss" },
                    { src: "~/assets/scss/font", lang: "scss" },
                    { src: "~/assets/scss/_custom", lang: "scss" },*/
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/captcha.js",
    "~/plugins/mask.js",
    "~/plugins/validate",
    "~/plugins/axios",
    "~/plugins/moment",
    "~/plugins/vue-agile",
    { src: "~plugins/vcalendar.js", ssr: false },
    // { src: "~/plugins/load-script.js" },
    { src: "~/plugins/loadScript.js", ssr: false },
    "~/plugins/quizCalculator.js",
    "~/plugins/fileUploader.js",
    "~/plugins/fileDownload.js",
    "~/plugins/carousel.js",
    "~/plugins/selectValue.js",
    "~/plugins/slick-carousel.js",
    { src: "~/plugins/tooltip.js", ssr: false },
    "~/plugins/vueLog.js",
    "~/plugins/Vue2TouchEvents.js",
    { src: "~/plugins/YandexMetrika.js", ssr: false },
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
    "@nuxtjs/sentry",
    "@nuxtjs/gtm",
  ],
  gtm: {
    id: "GTM-TVNGH3X",
    enabled: true,
  },
  sentry: {
    dsn: "https://a4361f5b792b485684f3c14070509b8f@sentry.reso.ru/8", // Enter your project's DSN here
    // Additional Module Options go here
    // https://sentry.nuxtjs.org/sentry/options
    disabled: process.env.NODE_ENV !== "production",
    clientIntegrations: {
      CaptureConsole: {
        levels: ["error"],
      },
    },
    config: {
      // Add native Sentry config here
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
      environment: process.env.NODE_ENV,
    },
    denyUrls: [/cabinet\.new.reso\.ru/i, /cabinet\.test-new.reso\.ru\//i],
  },
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
    "/free": process.env.MOBILE_URL ?? "https://lk.reso.ru",
    "/am": process.env.MOBILE2_URL ?? "https://lk.reso.ru",
    "/main": process.env.MOBILE2_URL ?? "https://lk.reso.ru",
    "/suggestions": "https://dadata.reso.ru",
  },
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
          maxAge: 60 * 60 * 24 * 400,
        },
        refreshToken: {
          property: "REFRESH_TOKEN",
          data: "REFRESH_TOKEN",
          maxAge: false,
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
    plugins: ["~/plugins/auth/auth.js"],
  },
  server: {
    port: 8000,
    host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
  },
};
