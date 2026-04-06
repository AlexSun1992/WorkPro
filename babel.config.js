module.exports = {
  env: {
    test: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current",
            },
          },
        ],
      ],
    },
    wc: {
      presets: ["@vue/cli-plugin-babel/preset"],
    },
  },
};
