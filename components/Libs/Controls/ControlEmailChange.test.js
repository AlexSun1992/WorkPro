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

describe("ControlemailChange", () => {
  let wrapper;
  const dataProps = {
    label: "E-mail",
    type: "emailChange",
    structType: "string",
    id: "718",
    fieldId: 35724,
    cols: 12,
    colSm: 12,
    colMd: 12,
    colLg: 12,
    width: "100%",
    name: "SEMAILNEW",
    labelCols: "mt-3",
    webId: "",
    visible: true,
    required: true,
    page: 0,
    readonly: false,
    control: null,
    state: true,
    checked: true,
    error: null,
    isRelation: false,
    fieldRelation: null,
    isTab: true,
    value: "hhh@mail.ru",
  };

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
      mocks: {
        $store: store,
      },
    });

    const getCodeInputSelector = "[data-testid=getCodeInput]";
    const getCodeInput = await wrapper.find(getCodeInputSelector);
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
      mocks: {
        $store: store,
      },
    });

    const getCodeInputSelector = "[data-testid=getCodeInput]";
    const getCodeInput = await wrapper.find(getCodeInputSelector);
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
      mocks: {
        $store: store,
      },
    });

    const getCodeInputSelector = "[data-testid=getCodeInput]";
    const getCodeInput = await wrapper.find(getCodeInputSelector);
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
      mocks: {
        $store: store,
      },
    });

    const getCodeInputSelector = "[data-testid=getCodeInput]";
    const getCodeInput = await wrapper.find(getCodeInputSelector);
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
      mocks: {
        $store: store,
      },
    });
    const getCodeInputSelector = "[data-testid=getCodeInput]";
    const getCodeButtonSelector = "[data-testid=getCodeButton]";
    const getCodeInput = await wrapper.find(getCodeInputSelector);
    const getCodeButton = await wrapper.find(getCodeButtonSelector);

    await getCodeInput.setValue("ma@mail.ru");
    getCodeButton.trigger("click");
    await wrapper.vm.$nextTick();

    wrapper.vm.$emit("update", "ma@mail.ru");
    expect(wrapper.emitted().update[0]).toEqual(["ma@mail.ru"]);
  });
  it("проверяем наличие атрибута disable у кнопки после отправки запроса", async () => {
    wrapper = mount(ControlEmailChange, {
      propsData: {
        data: dataProps,
        //  params: paramsProps,
      },
      mocks: {
        $store: store,
      },
    });
    const getCodeInputSelector = "[data-testid=getCodeInput]";
    const getCodeButtonSelector = "[data-testid=getCodeButton]";
    const getCodeInput = await wrapper.find(getCodeInputSelector);
    const getCodeButton = await wrapper.find(getCodeButtonSelector);

    await getCodeInput.setValue("ma@mail.ru");
    getCodeButton.trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    wrapper.vm.$emit("update", "ma@mail.ru");
    expect(getCodeButton.attributes("disabled")).toBe("disabled");
  });
});
