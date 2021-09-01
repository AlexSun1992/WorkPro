import Vue from "vue";
import Vuex from "vuex";
import * as data_card from "../../../store/data_card";
import * as menu from "../../../store/menu";
import * as blocks from "../../../store/blocks";
import * as general from "../../../store/index";
import * as auth from "./auth";

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
    blocks: {
      namespaced: true,
      ...blocks,
    },
    general: {
      namespaced: true,
      ...general,
    },
    auth: {
      namespaced: true,
      ...auth,
    },
  },
});
