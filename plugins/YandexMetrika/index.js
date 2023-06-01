import Vue from "vue";
import YandexMetrika from "./YandexMetrika";

const options = [
  {
    id: "34000840",
    env: process.env.NODE_ENV,
    debug: false,
    options: {
      webvisor: false,
      clickmap: true,
      useCDN: false,
      trackLinks: true,
      accurateTrackBounce: true,
      ecommerce: "dataLayer",
    },
  },
  {
    id: "25356824",
    env: process.env.NODE_ENV,
    debug: false,
    options: {
      webvisor: true,
      clickmap: true,
      useCDN: false,
      trackLinks: true,
      accurateTrackBounce: true,
      ecommerce: "dataLayer",
    },
  },
];
Vue.use(YandexMetrika, options);
