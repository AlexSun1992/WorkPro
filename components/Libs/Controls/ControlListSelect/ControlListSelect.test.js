import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ControlListSelect from "./ControlListSelect";
import ControlWrapperSelect from "../ControlWrapperSelect";
import { propsDataAfterRequest, response, propsDataBeforeRequest } from "./ControlListSelect.fixtures";
import * as blocks from "@/store/blocks";
import * as dataCard from "@/store/data_card";
import * as menu from "@/store/menu";

jest.mock("axios");

describe("ControlListSelect", () => {
  Vue.use(Vuex, BootstrapVue);
  const localVue = createLocalVue();
  localVue.use(Vuex, BootstrapVue);

  let store;
  let wrapper;
  let mockRoute;
  let mockRouter;

  beforeEach(async () => {
    store = new Vuex.Store({
      modules: {
        blocks: {
          ...blocks,
          namespaced: true,
        },
        data_card: {
          ...dataCard,
          namespaces: true,
        },
        menu: {
          ...menu,
          namespaces: true,
        },
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    wrapper.destroy();
  });

  it("Проверяем подставление значения(застрахованный) (v-model=) при выбранном застрахованном и отсутствии query параметра", async () => {
    mockRoute = {
      params: {
        idModule: "55",
        idParent: "0",
        idItem: "872",
        idCard: "0",
      },
      path: "/cabinet/55/0/872/0",
      query: {},
    };
    mockRouter = {
      push: jest.fn(),
    };
    wrapper = mount(ControlListSelect, {
      localVue,
      propsData: {
        data: propsDataAfterRequest,
        edit: true,
      },
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });

    const childComp = wrapper.findComponent(ControlWrapperSelect);

    expect(childComp.vm.itemValue).toEqual({
      SPOLICY: "9109559-ЛКТЕСТ-1",
      IDPOLICYFR: 0,
      SSTOMATOL: "N",
      TO_DATE: "2025-03-17 00:00:00.0",
      LSHOWGLSERV: "Y",
      SNAME: "Тестов Тест Иванович",
      VLBLOCKPND: "N",
      LSHOWMEDSWISS: "Y",
      FRANCHISE: 20,
      LDEFAULT: false,
      SPHONE: "9161230000",
      SCLINIC: "Y",
      LCHILD: true,
      IDPOLICY: 1758826822,
      LSTOMATOL: false,
      MSBLOCK1: "N",
      LSHOWGL: "Y",
      RN: 1,
      SCHILD: "Y",
      LSHOWCALLCENTER: "Y",
      IDMEDPARTNER: 4626502,
    });
    expect(wrapper.vm.options).toEqual([response]);
    expect(wrapper.vm.itemValue.SNAME).toBe("Тестов Тест Иванович");
  });

  it("Проверяем подставление значения(застрахованный) при наличии query параметра", async () => {
    mockRoute = {
      params: {
        idModule: "55",
        idParent: "0",
        idItem: "872",
        idCard: "0",
      },
      path: "/cabinet/55/0/872/0",
      query: {
        IDMEDPARTNER: "4626502",
      },
    };
    mockRouter = {
      push: jest.fn(),
    };
    wrapper = mount(ControlListSelect, {
      localVue,
      propsData: {
        data: propsDataAfterRequest,
        edit: true,
      },
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });

    expect(wrapper.vm.itemValue.SNAME).toBe("Тестов Тест Иванович");
  });

  it("Проверяем неподставление значения(застрахованный) при отсутствии query параметра ", async () => {
    mockRoute = {
      params: {
        idModule: "55",
        idParent: "0",
        idItem: "872",
        idCard: "0",
      },
      path: "/cabinet/55/0/872/0",
      query: {},
    };
    mockRouter = {
      push: jest.fn(),
    };
    wrapper = mount(ControlListSelect, {
      localVue,
      propsData: {
        data: propsDataBeforeRequest,
        edit: true,
      },
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.itemValue).toEqual({});
  });
});
