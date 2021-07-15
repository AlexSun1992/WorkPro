module.exports = {
  outputDir: "../static/js/",
  css: { extract: false },
  devServer: {
    proxy: {
      "/free/": {
        target: "https://mobile.reso.ru",
      },
      "/am/": {
        target: "https://mobile2.reso.ru",
      },
      "/cabinet|img|fonts|js|_nuxt|api/": {
        target: "http://localhost:8000",
      },
    },
  },
};
