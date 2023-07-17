import Vue from "vue";
import Vuex from "vuex";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ControlCustomCombobox from "../Controls/ControlCustomCombobox";

import {
  state as stateStore,
  getters as gettersStore,
  actions as actionsStore,
  mutations as mutationsStore,
} from "../../../store/data_card";

describe("ControlCustomCombobox", () => {
  let wrapper;
  const dataProps = {
    checked: true,
    colLg: 13,
    colMd: 12,
    colSm: 12,
    cols: 3,
    control: null,
    error: null,
    fieldId: 37106,
    fieldRelation: null,
    id: "765",
    isRelation: true,
    isTab: false,
    label: "Серия",
    cssClass: "",
    name: "SSERIES",
    options: [
      {
        ID: "ААА",
        SNAME: "ААА",
        text: "ААА",
        value: "ААА",
      },
    ],
    page: 0,
    placeholder: "Выберите серию",
    readonly: false,
    required: true,
    state: true,
    structType: "string",
    type: "customCombobox",
    value: "ХХХ",
    visible: true,
    webId: "",
    width: "100%",
    disabled: false,
    edit: true,
    loading: false,
    params: undefined,
    profileFullness: undefined,
    store: undefined,
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
  it("когда загрузилась страница, input с серией стал is-valid", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);

    wrapper = mount(ControlCustomCombobox, {
      localVue,
      propsData: {
        data: dataProps,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    expect(wrapper.html()).toContain("is-valid");
  });

  it("ввели невалидное значение в инпут с серией, два раза сработал blur и появился текст с ошибкой", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);

    wrapper = mount(ControlCustomCombobox, {
      localVue,
      propsData: {
        data: dataProps,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    const getCodeInput = wrapper.findComponent(".autocomplete-input");
    await getCodeInput.setValue("ggg");
    await getCodeInput.trigger("blur");
    await getCodeInput.trigger("blur");
    expect(wrapper.html()).toContain(`Обязательно для заполнения`);
  });

  it("ввели невалидное значение в инпут с серией, появился текст с ошибкой", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);

    wrapper = mount(ControlCustomCombobox, {
      localVue,
      propsData: {
        data: dataProps,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    const getCodeInput = wrapper.findComponent(".autocomplete-input");
    await getCodeInput.setValue("fff");
    expect(wrapper.html()).toContain(`По фразе "fff" ничего не найдено`);
  });

  it("ввели валидное значение,класс у инпута с серией стал is-valid", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);

    wrapper = mount(ControlCustomCombobox, {
      localVue,
      propsData: {
        data: dataProps,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    const getCodeInput = wrapper.findComponent(".autocomplete-input");
    await getCodeInput.setValue("ААА");
    expect(wrapper.find(".is-valid").exists()).toBe(true);
  });

  it("ввели невалидное значение в инпут с серией, появился текст ошибки", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);

    wrapper = mount(ControlCustomCombobox, {
      localVue,
      propsData: {
        data: dataProps,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    const getCodeInput = wrapper.findComponent(".autocomplete-input");
    await getCodeInput.setValue("ффф");
    await getCodeInput.trigger("blur");
    expect(wrapper.html()).toContain("Выберите значение из выпадающего списка");
  });
  it("сначала ввели невалидное значение в инпут с серией, появился текст ошибки, затем выбрали валидное значение и текст с ошибкой исчез", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);

    wrapper = mount(ControlCustomCombobox, {
      localVue,
      propsData: {
        data: dataProps,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    const getCodeInput = wrapper.findComponent(".autocomplete-input");
    await getCodeInput.setValue("ффф");
    await getCodeInput.trigger("blur");
    await getCodeInput.setValue("ААА");
    expect(wrapper.html()).toContain("");
  });
});
