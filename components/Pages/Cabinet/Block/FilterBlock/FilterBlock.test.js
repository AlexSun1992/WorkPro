import { mount } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import { BootstrapVue } from "bootstrap-vue";
import FilterBlock from "./FilterBlock.vue";

//
import {
  actions as actionsStore,
  getters as gettersStore,
  mutations as mutationsStore,
  state as stateStore,
} from "../../../../../store/blocks";

// jest.mock("this.$route.query.filters");

describe("FilterBlock", () => {
  const filterProperyName = "SSTATUS";
  const filterItemId = "712";
  const filterShowFilteredItemsCount = true;
  const filterRouteQuery = [
    { propertyName: "SSTATUS", filter: ["Действующие"], id: "712" },
  ];

  const route = {
    fullPath:
      "/cabinet/55/0/712?filters=%5B%7B%22propertyName%22%3A%22SSTATUS%22,%22filter%22%3A%5B%22%D0%94%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D1%83%D1%8E%D1%89%D0%B8%D0%B5%22%5D,%22id%22%3A%22712%22%7D%5D",
    hash: "",
    meta: "Cabinet",
    name: undefined,
    params: {
      idModule: "55",
      idParent: "0",
      idItem: "712",
    },
    path: "/cabinet/55/0/712",
    query: {
      filters:
        '[{"propertyName":"SSTATUS","filter":["Действующие"],"id":"712"}]',
    },
  };

  let store;
  let state;
  let getters;
  let actions;
  let mutations;

  const filterItem = [
    {
      name: "Корпоративный ДМС",
      isChecked: false,
    },
    {
      name: "ОСАГО",
      isChecked: false,
    },
    {
      name: "Домовой Коробочный",
      isChecked: false,
    },
  ];

  beforeEach(() => {
    state = stateStore;
    getters = gettersStore;
    actions = actionsStore;
    mutations = mutationsStore;
    Vue.use(Vuex, BootstrapVue);
    store = new Vuex.Store({
      state,
      getters: {
        filterItems: () => filterItem,
      },
      actions,
      mutations,
    });
  });

  it("test", async () => {
    const wrapper = mount(FilterBlock, {
      propsData: {
        propertyName: filterProperyName,
        itemId: filterItemId,
        showFilteredItemsCount: filterShowFilteredItemsCount,
      },
      mocks: {
        $store: {
          store,
          commit: () => null,
          // filterItems()=>
        },
        $route: route,
      },
    });
    expect(wrapper).not.toBe(null);
  });
});
