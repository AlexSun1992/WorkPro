module.exports = {
    outputDir: "../static/js/",
    css: { extract: false },
    runtimeCompiler: true,
    devServer: {
        proxy: {
            "^/free": {
                target: "https://mobile.reso.ru",
            },
            "^/am": {
                target: "https://mobile2.reso.ru",
            },
            "^/cabinet|^/img|^/fonts|^/js|^/_nuxt|^/api": {
                target: "http://localhost:8000",
            },
            "^/suggestions": {
                target: "http://localhost:8000",
            },
            "^/loginesia": {
                target: "http://localhost:8000",
            },
            "^/Branches": {
                target: "https://reso.ru",
            },
        },
    },
    chainWebpack: (config) => {
        const svgRule = config.module.rule("svg");
        svgRule.uses.clear();
        svgRule
            .use("babel-loader")
            .loader("babel-loader")
            .end()
            .use("vue-svg-loader")
            .loader("vue-svg-loader");
    },
};