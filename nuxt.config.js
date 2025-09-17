// eslint-disable-next-line nuxt/no-cjs-in-config
const { format, transports } = require("winston");

// eslint-disable-next-line nuxt/no-cjs-in-config
const path = require("path");

const { combine, timestamp } = format;
/**
 * @type {import("@nuxt/types").NuxtConfig}
 * https://v2.nuxt.com/docs/configuration-glossary/
 */

const nuxtConfig = {
  allowedSubnetList: ["192", "168", "200"],
  target: "universal",
  // ssr: false,
  telemetry: false,
  env: {
    NODE_ENV: process.env.NODE_ENV || "development",
    APP_VERSION: process.env.APP_VERSION,
  },
  generate: {
    minify: {
      collapseWhitespace: false,
    },
  },
  /*
   ** Headers of the page
   */
  head: {
    title: "Личный кабинет",
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
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#3ea662" },
  /*
   ** Global CSS
   */
  css: [
    { src: "~/assets/scss/font2022", lang: "css" },
    { src: "~/assets/scss/style2022", lang: "css" },
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/lottie-vue-player.client.js",
    "~/plugins/captcha.js",
    "~/plugins/mask.js",
    "~/plugins/validate",
    "~/plugins/axios",
    "~/plugins/VuePluginModal/PluginModal.js",
    {
      src: "~/plugins/PluginLoadingOverlay/PluginLoadingOverlay.js",
      ssr: false,
    },
    { src: "~/plugins/moment" },
    { src: "~/plugins/vcalendar.js", ssr: false },
    { src: "~/plugins/loadScript.js", ssr: false },
    { src: "~/plugins/fileUploader.js" },
    { src: "~/plugins/fileDownload.js" },
    { src: "~/plugins/tooltip.js", ssr: false },
    { src: "~/plugins/vueLog.js" },
    { src: "~/plugins/Vue2TouchEvents.js" },
    { src: "~/plugins/lightGallery.client.js" },
    { src: "~/plugins/YandexMap.js" },
    { src: "~/plugins/YandexMetrika", ssr: false },
    { src: "~/plugins/maska.js", ssr: false },
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
    "@nuxtjs/gtm",
    "nuxt-winston-log",
  ],
  gtm: {
    id: "GTM-TVNGH3X",
    enabled: true,
  },
  winstonLog: {
    useDefaultLogger: false,
    autoCreateLogPath: false,
    skipRequestMiddlewareHandler: true,
    skipErrorMiddlewareHandler: true,
    loggerOptions: {
      format: combine(timestamp(), format.splat(), format.json()),
      transports: [new transports.Console()],
    },
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
      config.resolve.alias["@assets"] = path.resolve(__dirname, "assets");
      if (isDev) {
        if (isClient) config.devtool = "eval-source-map";
        else config.devtool = "inline-source-map";
      } else {
        config.devtool = "nosources-source-map";
      }
    },
    transpile: ["vue-agile", "vue-plugin-load-script", "legacy-package"],
  },
  proxy: [
    [["/free"], { target: process.env.MOBILE_URL ?? "https://lk.reso.ru" }],
    [["/am", "/main"], { target: process.env.MOBILE2_URL ?? "https://lk.reso.ru" }],
    [
      ["/suggestions", "/export", "/individual", "/galleries", "/about", "/system", "/corporate", "/test"],
      { target: process.env.MOBILE_URL ? "https://test-new.reso.ru" : "https://new.reso.ru" },
    ],
  ],
  serverMiddleware: [
    "~/routes/routes.js",
    { path: "/sso", handler: "~/server/sso.js" },
    { path: "/idesia", handler: "~/server/sso.js" },
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
          // user: { url: "/api/userinfo", method: "get" },
          // user: { url: "/am/main/v2/userinfo", method: "get" },
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
    cookie: {
      prefix: "auth.",
      options: {
        path: "/",
        maxAge: 60 * 60 * 24 * 400,
        secure: true,
      },
    },
  },
  server: {
    port: 8000,
    host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
  },
  router: {
    middleware: ["routerRedirect"],
  },
};
// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = nuxtConfig;
