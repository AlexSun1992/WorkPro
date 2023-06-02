import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { createLocalVue, mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import CardPage from "./CardPage.vue";

import {
  fetchFormReturnValue,
  menuResponse,
  fetchCountersValue,
  fetchFormParams,
  fetchMenu,
  params,
} from "./CardPage.helper.fixtures";

import * as menu from "../../../store/menu";

import * as dataCard from "../../../store/data_card";

jest.mock("axios");

describe("CardPage", () => {
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

    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: fetchMenu });
    await store.dispatch("menu/fetchMenu", params);

    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: menuResponse });
    await store.dispatch("menu/fetchMenuById", params);

    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: fetchCountersValue,
    });

    wrapper = mount(CardPage, {
      localVue,
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("На странице нет кнопки 'Отменить'", async () => {
    const cloneFetchFormReturnValue = JSON.parse(
      JSON.stringify(fetchFormReturnValue)
    );
    cloneFetchFormReturnValue.metaData.btnCancel = false;
    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: cloneFetchFormReturnValue,
    });

    await store.dispatch("data_card/fetchForm", fetchFormParams);

    expect(wrapper.find('[data-testid="cancelButton"]').exists()).toBe(false);
  });

  it("На странице есть кнопка 'Отменить'", async () => {
    const cloneFetchFormReturnValue = JSON.parse(
      JSON.stringify(fetchFormReturnValue)
    );
    cloneFetchFormReturnValue.metaData.btnCancel = true;
    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: cloneFetchFormReturnValue,
    });

    await store.dispatch("data_card/fetchForm", fetchFormParams);

    expect(wrapper.find('[data-testid="cancelButton"]').exists()).toBe(true);
  });
});
