import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import FilterBlock from "./FilterBlock.vue";
import * as blocks from "../../../../../store/blocks";
import { getUnfilteredItems } from "./FilterBlock.helper.fixtures";

const test = [
  {
    name: "Проекты",
    isChecked: false,
  },
  {
    name: "Действующие",
    isChecked: false,
  },
  {
    name: "Архивные",
    isChecked: false,
  },
];

describe("FilterBlock", () => {
  Vue.use(Vuex);

  const route = {
    query: {
      filters: "[]",
    },
  };

  let wrapper;
  let getters;
  let store;

  it("отображает FilterBlock", () => {
    // getters = {
    //   getUnfilteredBlockById() {
    //     return test;
    //   },
    // };

    store = new Vuex.Store({
      modules: {
        blocks: {
          ...blocks,
          state: {
            ...blocks.state,
            blocks: [
              {
                blockId: 712,
                data: { items: getUnfilteredItems },
              },
            ],
          },
          namespaced: true,
        },
      },
    });
    wrapper = shallowMount(FilterBlock, {
      propsData: {
        uniqueItems: ["Проекты", "Действующие", "Архивные"],
        propertyName: "SSTATUS",
        itemId: "712",
        showFilteredItemsCount: true,
        filterType: "radiobutton",
        allItemsButtonName: "Все полисы",
        showButtonAll: true,
      },
      store,
      mocks: {
        $route: route,
      },
    });
    console.log("wrapper:", wrapper.html());
    expect(wrapper).not.toBe(null);
  });
});
