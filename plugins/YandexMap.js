import Vue from "vue";
import YmapPlugin from "vue-yandex-maps";

const settings = {
  apiKey: "95a56d05-41db-462a-a2ea-2c49ff3417a1",
  lang: "ru_RU",
  coordorder: "latlong",
  enterprise: false,
  version: "2.1",
};

Vue.use(YmapPlugin, settings);
