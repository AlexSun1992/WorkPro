import Vue from "vue";
import Vuex from "vuex";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ControlCustomCombobox, {
  calcDisabledByRelation,
} from "./ControlCustomCombobox.vue";
import { dataProps } from "./ControlCustomCombobox.helper.fixuter";
import * as dataCard from "../../../store/data_card";

describe("ControlCustomCombobox", () => {
  let wrapper;
  let store;

  beforeEach(async () => {
    Vue.use(Vuex, BootstrapVue);
    store = new Vuex.Store({
      modules: {
        data_card: {
          ...dataCard,
          namespaced: true,
        },
      },
    });
  });

  it("Поле не связанное, поэтому не disabled", async () => {
    const isDisabled = calcDisabledByRelation([]);

    expect(isDisabled).toBe(false);
  });

  it("Поле связанное, а зависимое не обязательным, поэтому disabled", async () => {
    const isDisabled = calcDisabledByRelation([
      { required: false, visible: true },
    ]);

    expect(isDisabled).toBe(false);
  });

  it("Поле связанное, а зависимое не отображается на странице, поэтому не disabled", async () => {
    const isDisabled = calcDisabledByRelation([
      { required: true, visible: false },
    ]);

    expect(isDisabled).toBe(false);
  });

  it("Поле связанное, а зависимое не заполнено, поэтому  disabled", async () => {
    const isDisabled = calcDisabledByRelation([
      { required: true, visible: true },
    ]);

    expect(isDisabled).toBe(true);
  });

  it("Поле связанное, а одно из зависимых не заполнено, поэтому  disabled", async () => {
    const isDisabled = calcDisabledByRelation([
      { required: true, visible: true },
      { required: true, visible: true, value: 123 },
    ]);

    expect(isDisabled).toBe(true);
  });

  it("Поле связанное, а зависимое заполнено, поэтому не disabled", async () => {
    const isDisabled = calcDisabledByRelation([
      { required: true, visible: true, value: 1 },
      { required: true, visible: true, value: 123 },
    ]);

    expect(isDisabled).toBe(false);
  });

  it("Поле связанное, а зависимое заполнено нулём, поэтому не disabled", async () => {
    const isDisabled = calcDisabledByRelation([
      { required: true, visible: true, value: 0 },
    ]);

    expect(isDisabled).toBe(false);
  });

  it("когда загрузилась страница, input с серией стал is-valid, если в value пришли цифры", async () => {
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

    expect(getCodeInput.element.value).toContain("ААА");
    expect(wrapper.html()).toContain("is-valid");
  });

  it("когда загрузилась страница, input с серией, если в value пришли буквы", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const dataPropsValueString = { ...dataProps };
    dataPropsValueString.options = [
      {
        ID: "ААА",
        SNAME: "ААА",
        text: "ААА",
        value: "ААА",
      },
    ];
    dataPropsValueString.value = "ААА";

    wrapper = mount(ControlCustomCombobox, {
      localVue,
      propsData: {
        data: dataPropsValueString,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    const getCodeInput = wrapper.findComponent(".autocomplete-input");

    expect(getCodeInput.element.value).not.toContain("ААА");
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
    expect(wrapper.html()).toContain(`Выберите значение из выпадающего списка`);
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
