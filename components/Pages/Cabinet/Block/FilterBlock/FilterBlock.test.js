import { createLocalVue, mount } from "@vue/test-utils";
import axios from "axios";
import Vuex, { Store } from "vuex";
import FilterBlock from "./FilterBlock.vue";
import { allBlocksMocks } from "./FilterBlock.fixtures.js";
import blocks from "../../../../../store/blocks";
// import { state, actions, mutations } from "../../../../../store/blocks";

// import { getters as getter } from "../../../../../store/blocks";
// import { mutations as mutation } from "../../../../../store/blocks";
// import { state as states } from "../../../../../store/blocks";
import menu from "../../../../../store/menu";
// jest.mock("axios");

// jest.mock("this.$route.query");

describe("FilterBlock", () => {
  let wrapper;
  const route = {
    fullPath: "/cabinet/55/0/712",
    query: {
      filters: '[{"propertyName":"SSTATUS","filter":["Архивные"],"id":"712"}]',
    },
  };

  const createComponent = () => {
    wrapper = mount(FilterBlock, {
      mocks: {
        // $store: blocks,
        $store: [blocks, menu],
        $route: route,
      },
      propsData: {
        itemId: 712,
        propertyName: "SSTATUS",
        showFilteredItemsCount: true,
        query: {
          filters:
            '[{"propertyName":"SSTATUS","filter":["Архивные"],"id":"712"}]',
        },
        $route: route,
      },
    });
  };

  it("first test for filterBlock", () => {
    createComponent();
    console.log(wrapper.html());
    // expect(wrapper.text()).not.toBe(null);
  });
});

///

// localVue,
// propsData: {
//   propertyName: "SSTATUS",
//   itemId: "712",
//   showFilteredItemsCount: true,
// },
///

// const mockRoute = {
//   params: {
//     idModule: "55",
//     idParent: "0",
//     idItem: "712",
//   },
// };

// const mockRouter = {
//   push: jest.fn(),
// };

// let wrapper;

// const localVue = createLocalVue();
// localVue.use(Vuex);
// let getters;
// let store;

// beforeEach(() => {
//   getters = {
//     getUnfilteredBlockById: jest.fn(),
//   };
//   store = new Vuex.Store({
//     state: {},
//     getters,
//   });
// });

// it("first test for filterBlock", () => {
//   wrapper = mount(FilterBlock, {
//     localVue,
//     store,
//   });
//   expect(wrapper.text()).not.toBe(null);
// });

//
// const localVue = createLocalVue();
// localVue.use(Vuex);

// const propsData = {
//   uniqueItems: ["Проекты", "Действующие", "Архивные"],
//   defaultValue: null,
//   propertyName: "SSTATUS",
//   filterType: "radiobutton",
//   itemId: "712",
//   showButtonName: "Все полисы",
//   showFilteredItemsCount: true,
// };

// const store = new Vuex.Store({
//   getters,
//   state,
//   actions,
//   mutations,
// });

// const createComponent = ({ props } = {}) => {
//   wrapper = mount(FilterBlock, {
//     localVue,
//     props,
//     store,
//   });
// };
