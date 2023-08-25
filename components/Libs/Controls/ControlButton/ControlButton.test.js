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
    jest.spyOn(global, "setInterval");
    createComponent();

    wrapper.find("[type='button']").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // console.log("btn:", wrapper.find("[type='button']"));
    console.log("wrapper:", wrapper.html());

    //
    // const params = {
    //   actionId: 41019,
    //   relaction: "4342A64CF92DDD413F91F7EC10F49C9A",
    //   relId: "2F00C6F4592B1E0CBB468EB66F6295EC",
    //   rowId: 2371162956,
    //   body: [],
    // };
    //

    // await store.dispatch("data_card/executeAction", params);
    //   jest.spyOn(axios, "post");
    //   axios.post.mockImplementationOnce({
    //     data: [{ status: 200 }],
    //   });

    // jest.spyOn(axios, "post");
  });
});
