import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import Vue from "vue";
import { nextTick } from "process";
import WizardButtons from "./WizardButtons";
import * as dataCard from "../../../../store/data_card";

describe("WizardButtons", () => {
  Vue.use(Vuex);
  let wrapper;
  const params = {};
  const mockRoute = {
    params,
  };
  let store;

  const createComponent = (getterMock) => {
    wrapper = mount(WizardButtons, {
      mocks: {
        $route: mockRoute,
        $store: getterMock,
      },
      propsData: {
        currentTab: {
          name: "Проверка и оплата",
          idItem: 746,
          id: 2363,
          list: false,
          order: 3,
        },
        qty: 3,
      },
    });
  };

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        data_card: {
          ...dataCard,
          namespaced: true,
        },
      },
    });
  });

  it("значение кнопки 'Назад' приходит из базы", async () => {
    createComponent(store);
    store.commit("data_card/setForm", [
      {
        type: "WizardButton",
        name: "Back",
        label: "В бесконечность и далее",
      },
    ]);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).not.toContain("Назад");
    expect(wrapper.text()).toContain("В бесконечность и далее");
  });

  it("Дефолтное значение кнопки 'Назад'", async () => {
    createComponent(store);
    store.commit("data_card/setForm", []);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Назад");
    expect(wrapper.text()).not.toContain("В бесконечность и далее");
  });
});
