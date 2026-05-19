import Vue from "vue";
import VueEasyTooltip from "vue-easy-tooltip";

Vue.component("VueEasyTooltip", VueEasyTooltip);

export default {
  install(Vue) {
    Vue.component("VueEasyTooltip", VueEasyTooltip);
  },
};
