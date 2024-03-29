import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";

import ActionButton from "./ActionButton.vue";
import {
  optionModal,
  fetchMenu,
  params,
  setFletMenu,
} from "./ActionButton.helper.fixtures";
import * as menu from "../../../../store/menu";
import * as dataCard from "../../../../store/data_card";

jest.mock("axios");

describe("ActionButton", () => {
  Vue.use(Vuex, BootstrapVue);
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  let store;
  let wrapper;
  let mockRoute;
  let mockRouter;

  beforeEach(async () => {
    mockRoute = {
      params,
      path: "/cabinet/55/0/718/0",
      query: {
        ref: "/cabinet/55/0/979",
      },
    };
    mockRouter = {
      push: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        data_card: {
          ...dataCard,
          namespaced: true,
        },
        menu: {
          ...menu,
          namespaced: true,
        },
      },
    });
    process.server = true;
    store.$axios = axios;
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("На странице отображается modal с текстом, переданным из конфигуратора", async () => {
    const setFletMenuCopy = JSON.parse(JSON.stringify(setFletMenu));
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ ...fetchMenu })
      .mockResolvedValueOnce({ ...setFletMenuCopy });
    await store.dispatch("menu/fetchMenu", params);

    wrapper = mount(ActionButton, {
      localVue,
      propsData: {
        actionId: "38882",
        body: undefined,
        contextChanged: false,
        id: "buy_section_osago_lk2",
        insideContent: "",
        variant: "transparent",
      },
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });
    const spyBvModal = jest.spyOn(wrapper.vm.$bvModal, "msgBoxConfirm");

    await wrapper.find(".btn").trigger("click");

    expect(spyBvModal).toHaveBeenCalledWith("Test text", optionModal);
  });

  it("На странице отображается modal с дефолтным текстом", async () => {
    const setFletMenuCopy = JSON.parse(JSON.stringify(setFletMenu));
    setFletMenuCopy.data[0].ACTIONSCUR[0].SQUEST = "";
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ ...fetchMenu })
      .mockResolvedValueOnce({ ...setFletMenuCopy });
    await store.dispatch("menu/fetchMenu", params);

    wrapper = mount(ActionButton, {
      localVue,
      propsData: {
        actionId: "38882",
        body: undefined,
        contextChanged: false,
        id: "buy_section_osago_lk2",
        insideContent: "",
        variant: "transparent",
      },
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });
    const spyBvModal = jest.spyOn(wrapper.vm.$bvModal, "msgBoxConfirm");

    await wrapper.find(".btn").trigger("click");

    expect(spyBvModal).toHaveBeenCalledWith(
      'Вы действительно хотите выполнить действие" Оформить новый полис ОСАГО"?',
      optionModal
    );
  });
});
