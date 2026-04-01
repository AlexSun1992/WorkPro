module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/matchMediaPolyfill.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/$1",
    "^vue$": "vue/dist/vue.common.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  moduleFileExtensions: ["js", "mjs", "vue", "json"],
  transform: {
    "^.+\\.js$": "babel-jest",
    ".*\\.(vue)$": "@vue/vue2-jest",
    "^.+\\.mjs$": "babel-jest",
    "node_modules/(?!(vue-yandex-maps|@yandex))": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!(vue-yandex-maps)|(@yandex))"],
  collectCoverage: false,
  collectCoverageFrom: ["<rootDir>/components/**/*.vue", "<rootDir>/pages/**/*.vue"],
  testPathIgnorePatterns: ["/node_modules/"],
};
