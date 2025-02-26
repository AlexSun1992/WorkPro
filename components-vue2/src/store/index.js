/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import * as data_card from "../../../store/data_card";
import * as wizard from "../../../store/wizard";
import * as card from "../../../store/card";
import * as menu from "../../../store/menu";
import * as blocks from "../../../store/blocks";
import * as general from "../../../store/index";
import * as map from "../../../store/map";
import * as mapV3 from "../../../store/mapV3";
import * as auth from "./auth";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    data_card: {
      namespaced: true,
      ...data_card,
    },
    wizard: {
      namespaced: true,
      ...wizard,
    },
    card: {
      namespaced: true,
      ...card,
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
    map: {
      namespaced: true,
      ...map,
    },
    mapV3: {
      namespaced: true,
      ...mapV3,
    },
  },
});
