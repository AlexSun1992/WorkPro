import Vue from "vue";
import Vuex from "vuex";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ControlEmailChange from "./ControlEmailChange.vue";

import { state as stateStore } from "../../../store/data_card";
import { getters as gettersStore } from "../../../store/data_card";
import { actions as actionsStore } from "../../../store/data_card";
import { mutations as mutationsStore } from "../../../store/data_card";

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

  const paramsProps = {
    text: "Верифицировать e-mail",
    active: true,
    compType: 9,
    recordLoad: true,
    newRecord: false,
    filters: [],
    actions: [
      {
        label: "Выслат код",
        id: 36297,
        type: 4,
        command: "Mobile.ClientUtils.SendEmail",
        relaction: "92FD4856E5006CA158B5BA8236962DA2",
        isDialog: false,
        isCurrentWindow: true,
        field: "id",
        refresh: false,
        closeAfter: false,
      },
    ],
    tabs: [],
    add: false,
    edit: true,
    delete: false,
    cols: 1,
    wizard: [],
    isCard: false,
    isForm: true,
    isWizard: false,
    isPortal: false,
    portalgrid: null,
    cardgrid: null,
    cardtemplate: null,
    isModal: false,
    parentMenu: null,
    idItem: 718,
    idParent: 0,
    newCount: null,
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
        params: paramsProps,
      },
      mocks: {
        $store: store,
      },
    });

    const getCodeButtonSelector = "[data-testid=getCodeButton]";
    const getCodeButton = await wrapper.find(getCodeButtonSelector);
    await getCodeButton.setValue("ff@fff");
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Пожалуйста, введите корректный e-mail");
    expect(getCodeButton.classes()).toContain("is-invalid");
  });

  it("необходимо наличие класса is-valid в input при введении fda@mail.ru", async () => {
    wrapper = mount(ControlEmailChange, {
      propsData: {
        data: dataProps,
        params: paramsProps,
      },
      mocks: {
        $store: store,
      },
    });

    const getCodeButtonSelector = "[data-testid=getCodeButton]";
    const getCodeButton = await wrapper.find(getCodeButtonSelector);
    await getCodeButton.setValue("fda@mail.ru");
    await wrapper.vm.$nextTick();
    expect(getCodeButton.classes()).toContain("is-valid");
  });

  it("необходимо наличие класса is-invalid в input при введении русских символов", async () => {
    wrapper = mount(ControlEmailChange, {
      propsData: {
        data: dataProps,
        params: paramsProps,
      },
      mocks: {
        $store: store,
      },
    });

    const getCodeButtonSelector = "[data-testid=getCodeButton]";
    const getCodeButton = await wrapper.find(getCodeButtonSelector);
    await getCodeButton.setValue("fdприветa@mail.ru");
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Русские символы запрещены");
    expect(getCodeButton.classes()).toContain("is-invalid");
  });

  it("необходимо наличие класса is-invalid в input при введении '+'", async () => {
    wrapper = mount(ControlEmailChange, {
      propsData: {
        data: dataProps,
        params: paramsProps,
      },
      mocks: {
        $store: store,
      },
    });

    const getCodeButtonSelector = "[data-testid=getCodeButton]";
    const getCodeButton = await wrapper.find(getCodeButtonSelector);
    await getCodeButton.setValue("fds+@mail.ru");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Пожалуйста, введите корректный e-mail");
    expect(getCodeButton.classes()).toContain("is-invalid");
  });
});
