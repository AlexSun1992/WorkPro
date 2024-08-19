import "./matchMedia";
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

import {
  fetchMenuDTP,
  menuResponseDTP,
  paramsDTP,
  fetchFormParamsDTP,
  fetchFormReturnValueDTP,
  fetchFormReturnValueNoRequiredDocsDTP,
} from "./CardPage.helper.saveBtnCheck.fixtures";

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

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Проверяем отсутствие disabled кнопки сохранить при visible === false(uploader)", async () => {
    mockRoute = {
      params: paramsDTP,
      path: "/cabinet/55/0/1008/2508424119/9917E63E9104B66D3C9D4021E0B16160",
      query: {
        ref: "/cabinet/55/0/701",
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

    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: fetchMenuDTP });
    await store.dispatch("menu/fetchMenu", paramsDTP);

    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: menuResponseDTP });
    await store.dispatch("menu/fetchMenuById", paramsDTP);
    wrapper = mount(CardPage, {
      localVue,
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });
    const cloneFetchFormReturnValue = JSON.parse(
      JSON.stringify(fetchFormReturnValueDTP)
    );

    const uploadComponent = cloneFetchFormReturnValue.metaData.data.find(
      (item) => item.type === "uploadFiles"
    );

    uploadComponent.visible = false;

    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: cloneFetchFormReturnValue,
    });

    await store.dispatch("data_card/fetchForm", fetchFormParamsDTP);

    expect(wrapper.find('[data-testid="saveButton"]').exists()).toBe(true);
    expect(
      wrapper.find('[data-testid="saveButton"]').attributes("disabled")
    ).toBe(undefined);
  });

  it("Проверяем отсутствие disabled у кнопки сохранить при отсутствии uploder на странице", async () => {
    mockRoute = {
      params: paramsDTP,
      path: "/cabinet/55/0/1008/2508424119/9917E63E9104B66D3C9D4021E0B16160",
      query: {
        ref: "/cabinet/55/0/701",
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
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: fetchMenuDTP });
    await store.dispatch("menu/fetchMenu", paramsDTP);
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: menuResponseDTP });
    await store.dispatch("menu/fetchMenuById", paramsDTP);
    wrapper = mount(CardPage, {
      localVue,
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });

    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: fetchFormReturnValueNoRequiredDocsDTP,
    });

    await store.dispatch("data_card/fetchForm", fetchFormParamsDTP);
    expect(wrapper.find('[data-testid="saveButton"]').exists()).toBe(true);
    expect(
      wrapper.find('[data-testid="saveButton"]').attributes("disabled")
    ).toBe(undefined);
  });

  it("Проверяем отсутствие disabled у кнопки сохранить при отсутствии свойства fileSettings у ControlUploadFiles", async () => {
    mockRoute = {
      params: paramsDTP,
      path: "/cabinet/55/0/1008/2508424119/9917E63E9104B66D3C9D4021E0B16160",
      query: {
        ref: "/cabinet/55/0/701",
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
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: fetchMenuDTP });
    await store.dispatch("menu/fetchMenu", paramsDTP);
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: menuResponseDTP });
    await store.dispatch("menu/fetchMenuById", paramsDTP);
    wrapper = mount(CardPage, {
      localVue,
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });

    const cloneFetchFormReturnValue = JSON.parse(
      JSON.stringify(fetchFormReturnValueDTP)
    );
    const uploadComponent = cloneFetchFormReturnValue.metaData.data.find(
      (item) => item.type === "uploadFiles"
    );
    uploadComponent.fileSettings = "mock";

    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: cloneFetchFormReturnValue,
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await store.dispatch("data_card/fetchForm", fetchFormParamsDTP);
    expect(wrapper.find('[data-testid="saveButton"]').exists()).toBe(true);
    expect(
      wrapper.find('[data-testid="saveButton"]').attributes("disabled")
    ).toBe(undefined);
  });
  //
  it("Проверяем наличие disabled у кнопки сохранить при loading и отсутствии uploader", async () => {
    mockRoute = {
      params: paramsDTP,
      path: "/cabinet/55/0/1008/2508424119/9917E63E9104B66D3C9D4021E0B16160",
      query: {
        ref: "/cabinet/55/0/701",
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
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: fetchMenuDTP });
    await store.dispatch("menu/fetchMenu", paramsDTP);
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: menuResponseDTP });
    await store.dispatch("menu/fetchMenuById", paramsDTP);
    await store.commit("data_card/setLoading", true);
    wrapper = mount(CardPage, {
      localVue,
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });

    const cloneFetchFormReturnValue = JSON.parse(
      JSON.stringify(fetchFormReturnValueDTP)
    );
    const uploadComponent = cloneFetchFormReturnValue.metaData.data.find(
      (item) => item.type === "uploadFiles"
    );
    uploadComponent.type = "mock";

    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: cloneFetchFormReturnValue,
    });

    await store.dispatch("data_card/fetchForm", fetchFormParamsDTP);

    expect(wrapper.find('[data-testid="saveButton"]').exists()).toBe(true);
    store.commit("data_card/setLoading", true);
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find('[data-testid="saveButton"]').attributes("disabled")
    ).toBe("disabled");
  });

  it("Проверяем наличие disabled у кнопки сохранить при наличии uploader", async () => {
    mockRoute = {
      params: paramsDTP,
      path: "/cabinet/55/0/1008/2508424119/9917E63E9104B66D3C9D4021E0B16160",
      query: {
        ref: "/cabinet/55/0/701",
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
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: fetchMenuDTP });
    await store.dispatch("menu/fetchMenu", paramsDTP);
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: menuResponseDTP });
    await store.dispatch("menu/fetchMenuById", paramsDTP);
    wrapper = mount(CardPage, {
      localVue,
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });

    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: fetchFormReturnValueDTP,
    });
    await store.dispatch("data_card/fetchForm", fetchFormParamsDTP);
    expect(wrapper.find('[data-testid="saveButton"]').exists()).toBe(true);
    expect(
      wrapper.find('[data-testid="saveButton"]').attributes("disabled")
    ).toBe("disabled");
  });

  it("Проверяем отсутствие disabled у кнопки сохранить при отсутствии uploder на странице", async () => {
    mockRoute = {
      params: paramsDTP,
      path: "/cabinet/55/0/1008/2508424119/9917E63E9104B66D3C9D4021E0B16160",
      query: {
        ref: "/cabinet/55/0/701",
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
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: fetchMenuDTP });
    await store.dispatch("menu/fetchMenu", paramsDTP);
    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: menuResponseDTP });
    await store.dispatch("menu/fetchMenuById", paramsDTP);
    wrapper = mount(CardPage, {
      localVue,
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });

    const cloneFetchFormReturnValue = JSON.parse(
      JSON.stringify(fetchFormReturnValueDTP)
    );
    const uploadComponent = cloneFetchFormReturnValue.metaData.data.find(
      (item) => item.type === "uploadFiles"
    );
    uploadComponent.type = "mock";

    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: cloneFetchFormReturnValue,
    });
    await store.dispatch("data_card/fetchForm", fetchFormParamsDTP);
    expect(wrapper.find('[data-testid="saveButton"]').exists()).toBe(true);
    expect(
      wrapper.find('[data-testid="saveButton"]').attributes("disabled")
    ).toBe(undefined);
  });

  it("Проверяем отсутствие disabled кнопки сохранить при наличии uploader на странице и загрузке требуемых документов", async () => {
    mockRoute = {
      params: paramsDTP,
      path: "/cabinet/55/0/1008/2508424119/9917E63E9104B66D3C9D4021E0B16160",
      query: {
        ref: "/cabinet/55/0/701",
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

    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: fetchMenuDTP });
    await store.dispatch("menu/fetchMenu", paramsDTP);

    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: menuResponseDTP });
    await store.dispatch("menu/fetchMenuById", paramsDTP);
    wrapper = mount(CardPage, {
      localVue,
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });
    const cloneFetchFormReturnValue = JSON.parse(
      JSON.stringify(fetchFormReturnValueDTP)
    );

    const uploadComponent = cloneFetchFormReturnValue.metaData.data.find(
      (item) => item.type === "uploadFiles"
    );

    const formData = new FormData();
    const mockDock = [
      {
        FILENAME: "ОСАГО.pdf",
        SIZE: 195885,
        NAME: "EPROTOKOLGUILTY1",
      },
      {
        FILENAME: "ОСАГО.pdf",
        SIZE: 195885,
        NAME: "EPROTOKOLGUILTY2",
      },
      {
        FILENAME: "ОСАГО.pdf",
        SIZE: 195885,
        NAME: "EPROTOKOLGUILTY1",
      },
    ];
    formData.append("JSON", JSON.stringify({ FILES: mockDock }));

    uploadComponent.value = formData;

    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: cloneFetchFormReturnValue,
    });

    await store.dispatch("data_card/fetchForm", fetchFormParamsDTP);

    expect(wrapper.find('[data-testid="saveButton"]').exists()).toBe(true);
    expect(
      wrapper.find('[data-testid="saveButton"]').attributes("disabled")
    ).toBe(undefined);
  });

  it("Проверяем отсутствие disabled кнопки сохранить при добавлении не всех требуемых документов (1 из 2)", async () => {
    mockRoute = {
      params: paramsDTP,
      path: "/cabinet/55/0/1008/2508424119/9917E63E9104B66D3C9D4021E0B16160",
      query: {
        ref: "/cabinet/55/0/701",
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

    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: fetchMenuDTP });
    await store.dispatch("menu/fetchMenu", paramsDTP);

    jest.spyOn(axios, "get").mockResolvedValueOnce({ data: menuResponseDTP });
    await store.dispatch("menu/fetchMenuById", paramsDTP);
    wrapper = mount(CardPage, {
      localVue,
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
      },
    });
    const cloneFetchFormReturnValue = JSON.parse(
      JSON.stringify(fetchFormReturnValueDTP)
    );

    const uploadComponent = cloneFetchFormReturnValue.metaData.data.find(
      (item) => item.type === "uploadFiles"
    );

    const formData = new FormData();
    const mockDock = [
      {
        FILENAME: "ОСАГО.pdf",
        SIZE: 195885,
        NAME: "EPROTOKOLGUILTY1",
      },
    ];
    formData.append("JSON", JSON.stringify({ FILES: mockDock }));

    uploadComponent.value = formData;

    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: cloneFetchFormReturnValue,
    });

    await store.dispatch("data_card/fetchForm", fetchFormParamsDTP);

    expect(wrapper.find('[data-testid="saveButton"]').exists()).toBe(true);
    expect(
      wrapper.find('[data-testid="saveButton"]').attributes("disabled")
    ).toBe("disabled");
  });

  it("На странице нет кнопки 'Отменить'", async () => {
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
