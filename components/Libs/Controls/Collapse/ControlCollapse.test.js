import Vue from "vue";
import Vuex from "vuex";

import { shallowMount } from "@vue/test-utils";

import ControlCollapse from "./ControlCollapse.vue";
import * as dataCard from "@/store/data_card";
import { dataProps, dataPropsClose, fullForm, collapseField } from "./ControlCollapse.fixtures";

describe("ControlCollapse", () => {
  let wrapper;
  let store;

  Vue.use(Vuex);

  const createComponent = (stateConf, dataProperties) => {
    store = new Vuex.Store({
      modules: {
        data_card: {
          ...dataCard,
          state: {
            ...dataCard.state(),
            form: stateConf,
          },

          namespaced: true,
        },
      },
    });
    wrapper = shallowMount(ControlCollapse, {
      propsData: {
        data: dataProperties,
      },
      mocks: {
        $store: store,
      },
    });
  };

  it("Компонент находится в развернутом состоянии (Перед рендером компонента необходимо сделать reverse видимости)", async () => {
    createComponent(fullForm, dataProps);
    expect(wrapper.emitted("update")).toBeTruthy();

    const controlsOnPage = wrapper.vm.$store.state.data_card.form.reduce((acc, el) => {
      if (dataProps.value.includes(el.name)) acc.push(el);
      return acc;
    }, []);

    jest.spyOn(wrapper.vm.$store, "dispatch");

    const controlsBeforeToggle = controlsOnPage.reduce((acc, item) => {
      if (item.visible) {
        acc.push(item.name);
      }
      return acc;
    }, []);

    await store.dispatch("data_card/setActionFormField", collapseField);

    const controlsOnPageAfterToggle = wrapper.vm.$store.state.data_card.form.filter((el) =>
      dataProps.value.includes(el.name)
    );

    const controlsAfterToggle = controlsOnPageAfterToggle.reduce((acc, item) => {
      if (item.visible) {
        acc.push(item.name);
      }
      return acc;
    }, []);

    const isAnyVisibleControlsAfterToggle = controlsAfterToggle.filter((el) => controlsBeforeToggle.includes(el));

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalled();

    expect(isAnyVisibleControlsAfterToggle.length).toBe(0);

    expect(wrapper.html()).toContain("Свернуть");
  });

  it("Компонент находится в свернутом состоянии", () => {
    createComponent(fullForm, dataPropsClose);
    expect(wrapper.emitted("update")).not.toBeTruthy();
    expect(wrapper.html()).toContain("Развернуть");
  });

  it("Кликаем по кнопне 'свернуть/развернуть'", async () => {
    createComponent(fullForm, dataPropsClose);

    const btn = wrapper.find(".btn-link");

    const controlsOnPage = wrapper.vm.$store.state.data_card.form.filter((el) => dataProps.value.includes(el.name));

    const controlsBeforeToggle = controlsOnPage.reduce((acc, item) => {
      if (item.visible) {
        acc.push(item.name);
      }
      return acc;
    }, []);

    btn.trigger("click");

    await store.dispatch("data_card/setActionFormField", collapseField);

    const controlsOnPageAfterToggle = wrapper.vm.$store.state.data_card.form.filter((el) =>
      dataProps.value.includes(el.name)
    );

    const controlsAfterToggle = controlsOnPageAfterToggle.reduce((acc, item) => {
      if (item.visible) {
        acc.push(item.name);
      }
      return acc;
    }, []);

    const isAnyVisibleControlsAfterToggle = controlsAfterToggle.filter((el) => controlsBeforeToggle.includes(el));

    expect(isAnyVisibleControlsAfterToggle.length).toBe(0);
  });
});
