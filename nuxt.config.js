// eslint-disable-next-line nuxt/no-cjs-in-config
const { format, transports } = require("winston");

// eslint-disable-next-line nuxt/no-cjs-in-config
const path = require("path");

require("dotenv").config();

// eslint-disable-next-line nuxt/no-cjs-in-config
const TerserPlugin = require("terser-webpack-plugin");

const { combine, timestamp } = format;
/**
 * @type {import("@nuxt/types").NuxtConfig}
 * https://v2.nuxt.com/docs/configuration-glossary/
 */

const isDev = process.env.NODE_ENV === "development";
const useFiddler = process.env.USE_FIDDLER === "true";

// eslint-disable-next-line nuxt/no-cjs-in-config
// const HttpsProxyAgent = require('https-proxy-agent')

const nuxtConfig = {
  allowedSubnetList: ["192", "168", "200"],
  target: "universal",
  // ssr: false,
  telemetry: false,
  env: {
    NODE_ENV: process.env.NODE_ENV || "development",
    APP_VERSION: process.env.APP_VERSION,
    VUE_APP_SMART_CAPTCHA_SITE_KEY1: "ysc1_CMiAA4UUPVoQKD8FfL2B9WhXJiYCa1XDNMRLc1Huf09c6c74",
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
    { src: "~/plugins/vue-compile-polyfill/vue-compile-polyfill.client.js", mode: "client" },
    { src: "~/plugins/cardmodal.client.js", mode: "client" },
    { src: "~/plugins/vmodal.client.js", mode: "client" },
    "~/plugins/lottie-vue-player.client.js",
    "~/plugins/captcha.js",
    "~/plugins/mask.js",
    "~/plugins/axios",
    { src: "~/plugins/VuePluginModal/PluginModal.js", mode: "client" },
    {
      src: "~/plugins/PluginLoadingOverlay/PluginLoadingOverlay.js",
      ssr: false,
    },
    {
      src: "~/plugins/PluginModalCardInfo/PluginModalCardInfo.js",
      ssr: false,
    },
    { src: "~/plugins/moment" },
    { src: "~/plugins/loadScript.js", ssr: false },
    { src: "~/plugins/fileUploader.js" },
    { src: "~/plugins/fileDownload.js" },
    { src: "~/plugins/tooltip.js", ssr: false },
    { src: "~/plugins/vueLog.js" },
    { src: "~/plugins/Vue2TouchEvents.js" },
    { src: "~/plugins/lightGallery.client.js" },
    { src: "~/plugins/YandexMetrika", ssr: false },
    { src: "~/plugins/maska.js", ssr: false },
    { src: "~/plugins/vuelidate.js" },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/router", "@nuxtjs/proxy", "@nuxtjs/composition-api/module"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    ["bootstrap-vue/nuxt", { css: false }],
    ["@nuxtjs/axios", { proxy: true }],
    "@nuxtjs/auth-next",
    ["cookie-universal-nuxt", { alias: "cookiz" }],
    "nuxt-winston-log",
    [
      "~/modules/runtime-compiler-static",
      {
        source: "vue/dist/vue.js", // ← UMD c компилятором
        outDir: "js",
        filename: "vue.js",
      },
    ],
    "vue-yandex-maps/nuxt2",
  ],
  yandexMaps: {
    apikey: process.env.YANDEX_MAP_API_KEY,
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
    siteKey: process.env.RECAPTCHA_SITE_KEY,
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
    postcss: {
      plugins: {
        "postcss-import": {},
        "postcss-url": {},
        "postcss-preset-env": {
          stage: 2,
          autoprefixer: {
            grid: true,
          },
        },
      },
    },

    devMiddleware: {
      writeToDisk: true,
    },

    extend(config, { isDev, isClient, isServer }) {
      config.resolve.alias.vue = "vue/dist/vue.common";
      config.resolve.alias["@assets"] = path.resolve(__dirname, "assets");
      config.devtool = "nosources-source-map";

      if (isClient) {
        // ⚠️ Именно эта сборка содержит Vue.compile
        config.resolve.alias.vue$ = "vue/dist/vue.esm.js";
        config.resolve.alias.vue = "vue/dist/vue.esm.js";
        config.resolve.alias.vue = "vue/dist/vue.runtime.esm.js";
      }

      if (isDev && isClient) {
        config.devtool = "source-map";

        // config.output.devtoolModuleFilenameTemplate = (info) => `webpack:///./${info.resourcePath.replace(/^(\.\.\/)+/, '').split('?')[0]}`
        config.output.devtoolModuleFilenameTemplate = (info) => {
          const relPath = path.relative(__dirname, info.absoluteResourcePath).replace(/\\/g, "/");
          return `webpack:///./${relPath}`;
        };
        devtoolFallbackModuleFilenameTemplate = "webpack:///./[resource-path]?[hash]";
      }
      if (!isDev) {
        config.optimization.minimizer = [
          new TerserPlugin({
            extractComments: false,
            terserOptions: {
              compress: {
                pure_funcs: ["console.log"],
              },
              format: {
                comments: false,
              },
            },
          }),
        ];
      }

      if (isDev && isServer) {
        config.devtool = "inline-source-map";
        config.optimization.concatenateModules = false;
        config.output.devtoolModuleFilenameTemplate = (info) => `webpack:///./${info.resourcePath}`;
      }
    },

    transpile: ["vue-agile", "vue-plugin-load-script", "legacy-package", "@yandex/ymaps3-world-utils"],
  },
  proxy: [
    [
      ["/free"],
      {
        target: process.env.MOBILE_URL ?? "https://lk.reso.ru",

        agent:
          isDev && useFiddler // eslint-disable-next-line global-require
            ? new (require("https-proxy-agent"))(process.env.FIDDLER_URL)
            : undefined,

        secure: !(isDev && useFiddler),
      },
    ],
    [
      ["/am", "/main"],
      {
        target: process.env.MOBILE2_URL ?? "https://lk.reso.ru",

        agent:
          isDev && useFiddler // eslint-disable-next-line global-require
            ? new (require("https-proxy-agent"))(process.env.FIDDLER_URL)
            : undefined,

        secure: !(isDev && useFiddler),
      },
    ],
    [
      ["/suggestions", "/export", "/individual", "/galleries", "/about", "/system", "/corporate", "/test"],
      {
        target: process.env.MOBILE_URL ? "https://test-new.reso.ru" : "https://new.reso.ru",

        agent:
          isDev && useFiddler // eslint-disable-next-line global-require
            ? -new (require("https-proxy-agent"))(process.env.FIDDLER_URL)
            : undefined,

        secure: !(isDev && useFiddler),
      },
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
