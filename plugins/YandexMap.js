import Vue from "vue";
import YmapPlugin from "vue-yandex-maps";

// TODO move key to .env
const settings = {
  apiKey: process.env.YANDEX_MAP_API_KEY,
  lang: "ru_RU",
  coordorder: "latlong",
  enterprise: false,
  version: "2.1",
};

Vue.use(YmapPlugin, settings);
