import Vue from "vue";
import Vuex from "vuex";
import * as data_card from "../../../store/data_card";
import * as menu from "../../../store/menu";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    data_card: {
      namespaced: true,
      ...data_card,
    },
    menu: {
      namespaced: true,
      ...menu,
    },
  },
});
