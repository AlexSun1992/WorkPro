import { mount, createLocalVue } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import {
  state as stateStore,
  getters as gettersStore,
  actions as actionsStore,
  mutations as mutationsStore,
} from "../../../../store/data_card";

import ControlButton from "./ControlButton.vue";
import { dataProps } from "./ControlButton.fixtures";

jest.mock("axios");
jest.useFakeTimers();
describe("ControlButton", () => {
  let wrapper;
  let store;
  let state;
  let getters;
  let actions;
  let mutations;

  beforeEach(() => {
    jest.useFakeTimers();
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

  const localVue = createLocalVue();
  const createComponent = () => {
    wrapper = mount(ControlButton, {
      localVue,

      propsData: {
        data: dataProps,
      },
      mocks: {
        $store: store,
      },
    });
  };

  it("Должен отображаться тестируемый компонент", async () => {
    jest.useFakeTimers();

    createComponent();

    wrapper.find("[type='button']").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
  });
});
