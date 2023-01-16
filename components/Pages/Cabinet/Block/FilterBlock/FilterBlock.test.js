import { mount } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import FilterBlock from "./FilterBlock.vue";
//
import { actions as actionsStore } from "../../../../../store/blocks";
import { getters as gettersStore } from "../../../../../store/blocks";
import { mutations as mutationsStore } from "../../../../../store/blocks";
import { state as stateStore } from "../../../../../store/blocks";

jest.mock("axios");

describe("FilterBlock", () => {
  let wrapper;
  const route = {
    fullPath: "/cabinet/55/0/712",
    query: {
      filters: "[]",
    },
  };
  const uniqueItemsProps = ["Проекты", "Действующие", "Архивные"];

  let store;
  let state;
  let getters;
  let actions;
  let mutations;

  beforeEach(() => {
    state = stateStore;
    getters = gettersStore;
    actions = actionsStore;
    mutations = mutationsStore;
    Vue.use(Vuex);
    store = new Vuex.Store({
      state,
      getters,
      actions,
      mutations,
    });
  });

  it("first test for filterBlock", () => {
    wrapper = mount(FilterBlock, {
      mocks: {
        $store: store,
        $route: route,
      },
      propsData: {
        itemId: 712,
        propertyName: "SSTATUS",
        showFilteredItemsCount: true,
        uniqueItems: uniqueItemsProps,
        query: {
          filters: "[]",
        },
      },
    });
  });
});
