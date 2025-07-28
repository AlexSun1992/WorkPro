import "../../Pages/Cabinet/matchMedia";
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import { createLocalVue, mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import CardEditor from "./CardEditor";

import { params, edit, data, wizardTabs, dataResult } from "./CardEditor.helper.fixtures";

import * as menu from "../../../store/menu";

import * as dataCard from "@/store/data_card";
import { fetchPoutvalue } from "@/utils/fetchPoutvalue";

jest.mock("axios");
jest.mock("@/utils/fetchPoutvalue", () => ({
  fetchPoutvalue: jest.fn(),
}));

describe("CardEditor", () => {
  Vue.use(Vuex, BootstrapVue);
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  let store;
  let wrapper;
  let mockRoute;
  let mockRouter;
  const propsData = {
    params,
    edit,
    data,
    wizardTabs,
  };
  beforeEach(async () => {
    mockRoute = {
      params,
      path: "/cabinet/55/0/1008/2508424119/9917E63E9104B66D3C9D4021E0B16160",
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
    wrapper = mount(CardEditor, {
      localVue,
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
      propsData,
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });
  it("Проверка вызова функции fetchPoutvalue при сохранении карточки", async () => {
    jest.spyOn(axios, "put").mockResolvedValueOnce({
      data: dataResult,
      status: 200,
    });
    const { vm } = wrapper;
    jest.spyOn(vm, "saveDataCard");
    await vm.saveDataCard();
    expect(fetchPoutvalue).toHaveBeenCalledWith(
      {
        POUTVALUE: "/cabinet/55/0/946/6304080620/4B897DFDFD964DD8F525F8E9BF9B6550",
      },
      expect.objectContaining({ router: mockRouter })
    );
  });
});
