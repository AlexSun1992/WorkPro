import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";

import ActionButton from "./ActionButton.vue";
import {
  optionModal,
  fetchMenu,
  setFlatMenu,
} from "./ActionButton.helper.fixtures";
import * as menu from "../../../../store/menu";
import * as dataCard from "../../../../store/data_card";

jest.mock("axios");
jest.spyOn(window, "open");

describe("ActionButton", () => {
  Vue.use(Vuex, BootstrapVue);
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  let store;
  let wrapper;
  let mockRoute;
  let mockRouter;

  function findButtonByText(text) {
    return wrapper
      .findAll("button")
      .filter((elm) => elm.text().includes(text))
      .at(0);
  }

  beforeEach(async () => {
    mockRoute = {
      params: {
        idRel: "SOMERELVALUE",
        idCard: "123456",
        idItem: "712",
        idModule: "55",
        idParent: "0",
      },
      path: "/cabinet/55/0/718/0",
      query: {
        ref: "/cabinet/55/0/979",
      },
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
    global.eventHandler = () => null;
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("На странице отображается modal с текстом, переданным из конфигуратора", async () => {
    const setFletMenuCopy = JSON.parse(JSON.stringify(setFlatMenu));
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ ...fetchMenu })
      .mockResolvedValueOnce({ ...setFletMenuCopy });
    await store.dispatch("menu/fetchMenu", mockRoute.params);

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
    const setFlatMenuCopy = JSON.parse(JSON.stringify(setFlatMenu));
    setFlatMenuCopy.data[0].ACTIONSCUR[0].SQUEST = "";
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ ...fetchMenu })
      .mockResolvedValueOnce({ ...setFlatMenuCopy });
    await store.dispatch("menu/fetchMenu", mockRoute.params);

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

  it("происходит переход в новый пункт меню", async () => {
    const setFlatMenuCopy = JSON.parse(JSON.stringify(setFlatMenu));
    setFlatMenuCopy.data[0].ACTIONSCUR[0].NTYPE = 2;
    setFlatMenuCopy.data[0].ACTIONSCUR[0].LHIDEDLG = true;
    setFlatMenuCopy.data[0].ACTIONSCUR[0].LCURWINDOW = false;
    setFlatMenuCopy.data[0].ACTIONSCUR[0].SCONST = "999";
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ ...fetchMenu })
      .mockResolvedValueOnce({ ...setFlatMenuCopy });
    await store.dispatch("menu/fetchMenu", mockRoute.params);

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
    const spyWindowOpen = jest.spyOn(window, "open");

    await wrapper.find(".btn").trigger("click");

    expect(spyWindowOpen).toHaveBeenCalledWith(
      "/cabinet/55/0/999/0/123456?ref=undefined"
    );
  });

  it("происходит вызов report2", async () => {
    const setFlatMenuCopy = JSON.parse(JSON.stringify(setFlatMenu));
    setFlatMenuCopy.data[0].ACTIONSCUR[0].NTYPE = 3;
    setFlatMenuCopy.data[0].ACTIONSCUR[0].LHIDEDLG = true;
    setFlatMenuCopy.data[0].ACTIONSCUR[0].LCURWINDOW = false;
    setFlatMenuCopy.data[0].ACTIONSCUR[0].SCONST = "999";
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ ...fetchMenu })
      .mockResolvedValueOnce({ ...setFlatMenuCopy });

    const mockedAxios = jest.fn().mockRejectedValue(new Error("some error"));
    await store.dispatch("menu/fetchMenu", mockRoute.params);

    wrapper = mount(ActionButton, {
      localVue,
      propsData: {
        actionId: "38882",
        body: undefined,
        contextChanged: false,
        id: "buy_section_osago_lk2",
        insideContent: "",
        variant: "transparent",
        params: {},
      },
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
        $axios: mockedAxios,
      },
    });

    await wrapper.find(".btn").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "http://localhost/am/main/v2/report2?id=123456&rel=SOMERELVALUE&idaction=38882&relaction=445A968215DA21380CD302AAB6668879",
      })
    );
  });

  it("Если нет связанного action то не всплывает модалка", async () => {
    const setFlatMenuCopy = JSON.parse(JSON.stringify(setFlatMenu));
    setFlatMenuCopy.data[0].ACTIONSCUR = [];
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ ...fetchMenu })
      .mockResolvedValueOnce({ ...setFlatMenuCopy });
    await store.dispatch("menu/fetchMenu", mockRoute.params);

    wrapper = mount(ActionButton, {
      localVue,
      propsData: {
        /** actionId === null - отсутствует связанный Action */
        actionId: null,
        body: undefined,
        contextChanged: false,
        id: "buy_section_osago_lk2",
        insideContent: "",
        variant: "transparent",
        data: {
          label: "Рассчитать ОСАГО",
          name: "SCALCULATEPOLIS",
        },
      },

      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });
    const spyBvModal = jest.spyOn(wrapper.vm.$bvModal, "msgBoxConfirm");

    await wrapper.find(".btn").trigger("click");

    expect(spyBvModal).not.toHaveBeenCalled();
  });

  it("Отображается текст об успешном выполнении действия", async () => {
    const setFlatMenuCopy = JSON.parse(JSON.stringify(setFlatMenu));
    setFlatMenuCopy.data[0].ACTIONSCUR[0].LHIDEDLG = true;
    setFlatMenuCopy.data[0].ACTIONSCUR[0].SMESSAGE =
      "Сообщение об успешном выполнении";
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ ...fetchMenu })
      .mockResolvedValueOnce({ ...setFlatMenuCopy });
    // Запрос на выполнение действия
    jest.spyOn(axios, "post").mockResolvedValueOnce({ status: 200, data: {} });
    await store.dispatch("menu/fetchMenu", mockRoute.params);

    wrapper = mount(ActionButton, {
      localVue,
      propsData: {
        actionId: "38882",
        data: {
          label: "Рассчитать ОСАГО",
          name: "Item38882",
          type: "button",
        },
        params: {},
      },

      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
        $modal: {
          alert: jest.fn(),
        },
      },
    });

    await await findButtonByText("Оформить новый полис ОСАГО").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$modal.alert).toHaveBeenCalledWith(
      "Сообщение об успешном выполнении",
      {
        icon: "ok",
      }
    );
  });

  it("Не отображается текст об успешном выполнении действия при ошибке запроса", async () => {
    const setFlatMenuCopy = JSON.parse(JSON.stringify(setFlatMenu));
    setFlatMenuCopy.data[0].ACTIONSCUR[0].LHIDEDLG = true;
    setFlatMenuCopy.data[0].ACTIONSCUR[0].SMESSAGE =
      "Сообщение об успешном выполнении";
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ ...fetchMenu })
      .mockResolvedValueOnce({ ...setFlatMenuCopy });
    // Запрос на выполнение действия
    jest.spyOn(axios, "post").mockRejectedValueOnce({
      response: { status: 500, data: { MESSAGE: "Ошибка" } },
    });
    await store.dispatch("menu/fetchMenu", mockRoute.params);

    wrapper = mount(ActionButton, {
      localVue,
      propsData: {
        actionId: "38882",
        data: {
          label: "Рассчитать ОСАГО",
          name: "Item38882",
          type: "button",
        },
        params: {},
      },

      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
        $modal: {
          alert: jest.fn(),
        },
      },
    });

    await await findButtonByText("Оформить новый полис ОСАГО").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$modal.alert).not.toHaveBeenCalled();
  });
});
