import Vue from "vue";
import Vuex from "vuex";
//import * as card from "../../../store/card";
import * as data_card from "../../../store/data_card";
//import * as index from "../../../store/index";
//import * as menu from "../../../store/menu";
Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    data_card,
  },
});
