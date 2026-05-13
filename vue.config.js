const path = require("path");

module.exports = {
  outputDir: "./static/js/",
  css: {
    extract: false,
    loaderOptions: {
      css: {
        url: (url) => !url.startsWith("/"),
      },
    },
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    if (config.plugins.has("html")) {
      config.plugin("html").tap((args) => {
        args[0].template = path.resolve(__dirname, "webcomponents/public/index.html");
        return args;
      });
    }
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("babel-loader").loader("babel-loader").end().use("vue-svg-loader").loader("vue-svg-loader");
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
        "@assets": path.resolve(__dirname, "./assets"),
      },
    },
  },
  devServer: {
    hot: false,
    liveReload: true,
    proxy: {
      "^/free": {
        target: "http://localhost:8000",
      },
      "^/lk/": {
        target: "http://localhost:8000",
      },
      "^/cabinet|^/img|^/fonts|^/js|^/_nuxt|^/api": {
        target: "http://localhost:8000",
      },
      "^/suggestions": {
        target: "http://localhost:8000",
      },
      "^/sso": {
        target: "http://localhost:8000",
      },
      "^/s/:hash": {
        target: "http://localhost:8000",
      },
      "^/system|^/export": {
        target: "https://reso.ru",
      },
      "^/Branches": {
        target: "https://reso.ru",
      },
    },
  },
  transpileDependencies: ["vue-yandex-maps", "@yandex/ymaps3-world-utils"],
};
