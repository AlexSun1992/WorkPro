import Vue from "vue";
import Vuex from "vuex";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";

import CabinetLayout from "./CabinetLayout";
import * as menu from "../store/menu";

describe("CabinetLayout", () => {
  Vue.use(Vuex, BootstrapVue);
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  let store;
  let wrapper;
  let mockRoute;
  let mockRouter;

  it("На сиранице отображаются footer, header и breadcrumb", () => {
    const params = {
      idCard: "2484351389",
      idItem: "746",
      idModule: "55",
      idParent: "0",
      idRel: "0D65E3D526B6EF82BA7ED4A23400E131",
      idWizard: "744",
    };
    mockRoute = {
      params,
      path: "/cabinet/wizard/744/55/0/746/2484351389/0D65E3D526B6EF82BA7ED4A23400E131",
    };
    mockRouter = {
      push: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        menu: {
          ...menu,
          namespaced: true,
        },
      },
    });

    wrapper = shallowMount(CabinetLayout, {
      localVue,
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
        $cookiz: {
          get: jest.fn().mockReturnValue(false),
          set: jest.fn(),
        },
      },
    });

    expect(wrapper.find("header-stub").exists()).toBe(true);
    expect(wrapper.find("b-breadcrumb-stub").exists()).toBe(false);
    expect(wrapper.find("bread-crumbs-stub").exists()).toBe(true);
    expect(wrapper.find("footer-stub").exists()).toBe(true);
  });

  it("На сиранице НЕ отображаются footer, header и breadcrumb", () => {
    const params = {
      idCard: "2484351389",
      idItem: "746",
      idModule: "55",
      idParent: "0",
      idRel: "0D65E3D526B6EF82BA7ED4A23400E131",
      idWizard: "744",
    };
    mockRoute = {
      params,
      path: "/cabinet/wizard/744/55/0/746/2484351389/0D65E3D526B6EF82BA7ED4A23400E131",
    };
    mockRouter = {
      push: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        menu: {
          ...menu,
          namespaced: true,
        },
      },
    });

    wrapper = shallowMount(CabinetLayout, {
      localVue,
      mocks: {
        $store: store,
        $route: mockRoute,
        $router: mockRouter,
        $cookiz: {
          get: jest.fn().mockReturnValue(true),
          set: jest.fn(),
        },
      },
    });
    expect(wrapper.find("header-stub").exists()).toBe(false);
    expect(wrapper.find("b-breadcrumb-stub").exists()).toBe(false);
    expect(wrapper.find("footer-stub").exists()).toBe(false);
  });

  it("Отоброжается переданное значение title страницы", () => {
    const state = {
      settings: [{}, {}, { text: "Страховые случаи по полису" }],
    };
    expect(menu.getters.pageTitle(state)).toBe("Страховые случаи по полису");
  });

  it("Отоброжается дефолтное значение title страницы", () => {
    const state = {
      settings: [{}, {}, {}],
    };
    expect(menu.getters.pageTitle(state)).toBe("РЕСО-Гарантия");
  });

  it("Отоброжается дефолтное значение title страницы", () => {
    const state = {
      settings: [],
    };
    expect(menu.getters.pageTitle(state)).toBe("РЕСО-Гарантия");
  });
});
