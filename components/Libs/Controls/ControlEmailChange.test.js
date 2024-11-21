import Vue from "vue";
import Vuex from "vuex";
import { mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ControlEmailChange from "./ControlEmailChange.vue";

import {
  state as stateStore,
  getters as gettersStore,
  actions as actionsStore,
  mutations as mutationsStore,
} from "../../../store/data_card";
import {
  dataProps,
  getSMSCodeComponent,
} from "./ControlEmailChange.helper.fixuter";

describe("ControlemailChange", () => {
  let wrapper;

  let store;
  let state;
  let getters;
  let actions;
  let mutations;
  beforeEach(() => {
    state = stateStore;
    getters = gettersStore;
    actions = actionsStore;
    mutations = mutationsStore;
    Vue.use(Vuex, BootstrapVue);
    store = new Vuex.Store({
      state,
      getters,
      actions,
      mutations,
    });
  });

  it("необходимо наличие класса is-invalid в input при введении ff@fff", async () => {
    wrapper = mount(ControlEmailChange, {
      propsData: {
        data: dataProps,
        // params: paramsProps,
      },
      computed: {
        getSMSCodeComponent() {
          return getSMSCodeComponent;
        },
      },
      mocks: {
        $store: store,
      },
    });

    const getCodeInputSelector = "[data-testid=getCodeInput]";
    const getCodeInput = wrapper.find(getCodeInputSelector);
    await getCodeInput.setValue("ff@fff");
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Пожалуйста, введите корректный e-mail");
    expect(getCodeInput.classes()).toContain("is-invalid");
  });

  it("необходимо наличие класса is-valid в input при введении fda@mail.ru", async () => {
    wrapper = mount(ControlEmailChange, {
      propsData: {
        data: dataProps,
        // params: paramsProps,
      },
      computed: {
        getSMSCodeComponent() {
          return getSMSCodeComponent;
        },
      },
      mocks: {
        $store: store,
      },
    });

    const getCodeInputSelector = "[data-testid=getCodeInput]";
    const getCodeInput = wrapper.find(getCodeInputSelector);
    await getCodeInput.setValue("fda@mail.ru");
    await wrapper.vm.$nextTick();
    expect(getCodeInput.classes()).toContain("is-valid");
  });

  it("необходимо наличие класса is-invalid в input при введении русских символов", async () => {
    wrapper = mount(ControlEmailChange, {
      propsData: {
        data: dataProps,
        // params: paramsProps,
      },
      computed: {
        getSMSCodeComponent() {
          return getSMSCodeComponent;
        },
      },
      mocks: {
        $store: store,
      },
    });

    const getCodeInputSelector = "[data-testid=getCodeInput]";
    const getCodeInput = wrapper.find(getCodeInputSelector);
    await getCodeInput.setValue("fdприветa@mail.ru");
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Русские символы запрещены");
    expect(getCodeInput.classes()).toContain("is-invalid");
  });

  it("необходимо наличие класса is-invalid в input при введении '+'", async () => {
    wrapper = mount(ControlEmailChange, {
      propsData: {
        data: dataProps,
        // params: paramsProps,
      },
      computed: {
        getSMSCodeComponent() {
          return getSMSCodeComponent;
        },
      },
      mocks: {
        $store: store,
      },
    });

    const getCodeInputSelector = "[data-testid=getCodeInput]";
    const getCodeInput = wrapper.find(getCodeInputSelector);
    await getCodeInput.setValue("fds+@mail.ru");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Пожалуйста, введите корректный e-mail");
    expect(getCodeInput.classes()).toContain("is-invalid");
  });
  it("проверяем emit компонента", async () => {
    wrapper = mount(ControlEmailChange, {
      propsData: {
        data: dataProps,
        //  params: paramsProps,
      },
      computed: {
        getSMSCodeComponent() {
          return getSMSCodeComponent;
        },
      },
      mocks: {
        $store: store,
      },
    });
    const getCodeInputSelector = "[data-testid=getCodeInput]";
    const getCodeButtonSelector = "[data-testid=getCodeButton]";
    const getCodeInput = wrapper.find(getCodeInputSelector);
    const getCodeButton = wrapper.find(getCodeButtonSelector);

    await getCodeInput.setValue("ma@mail.ru");
    await getCodeButton.trigger("click");

    wrapper.vm.$emit("update", "ma@mail.ru");
    expect(wrapper.emitted().update[0]).toEqual([
      {
        fieldId: 35724,
        name: "SEMAILNEW",
        value: "ma@mail.ru",
      },
    ]);
  });
  it("проверяем наличие атрибута disable у кнопки после отправки запроса", async () => {
    wrapper = mount(ControlEmailChange, {
      propsData: {
        data: dataProps,
        //  params: paramsProps,
      },
      computed: {
        getSMSCodeComponent() {
          return getSMSCodeComponent;
        },
      },
      mocks: {
        $store: store,
      },
    });
    const getCodeInputSelector = "[data-testid=getCodeInput]";
    const getCodeButtonSelector = "[data-testid=getCodeButton]";
    const getCodeInput = wrapper.find(getCodeInputSelector);
    const getCodeButton = wrapper.find(getCodeButtonSelector);

    await getCodeInput.setValue("ma@mail.ru");
    await getCodeButton.trigger("click");

    wrapper.vm.$emit("update", "ma@mail.ru");
    expect(getCodeButton.attributes("disabled")).toBe("disabled");
  });
});
