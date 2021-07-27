import Vue from "vue";
import Vuex from "vuex";
import card from "../../../store/card";
import data_card from "../../../store/data_card";
import index from "../../../store/index";
import menu from "../../../store/menu";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    card,
    data_card,
    index,
    menu,
  },
});
