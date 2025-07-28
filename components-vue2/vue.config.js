const path = require("path");

module.exports = {
  outputDir: "../static/js/",
  css: { extract: false },
  runtimeCompiler: true,
  productionSourceMap: true,
  devServer: {
    proxy: {
      "^/free": {
        target: "http://localhost:8000",
      },
      "^/am": {
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
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("babel-loader").loader("babel-loader").end().use("vue-svg-loader").loader("vue-svg-loader");
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "../"),
      },
    },
  },
};
