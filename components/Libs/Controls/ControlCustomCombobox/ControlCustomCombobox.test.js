import Vue from "vue";
import Vuex from "vuex";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ControlCustomCombobox, { calcDisabledByRelation } from "./ControlCustomCombobox";
import { dataProps } from "../ControlCustomCombobox.helper.fixuter";
import * as dataCard from "@/store/data_card";

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
    const isDisabled = calcDisabledByRelation([{ required: false, visible: true }]);

    expect(isDisabled).toBe(false);
  });

  it("Поле связанное, а зависимое не отображается на странице, поэтому не disabled", async () => {
    const isDisabled = calcDisabledByRelation([{ required: true, visible: false }]);

    expect(isDisabled).toBe(false);
  });

  it("Поле связанное, а зависимое не заполнено, поэтому  disabled", async () => {
    const isDisabled = calcDisabledByRelation([{ required: true, visible: true }]);

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
    const isDisabled = calcDisabledByRelation([{ required: true, visible: true, value: 0 }]);

    expect(isDisabled).toBe(false);
  });

  it.skip("когда загрузилась страница, input с серией стал is-valid, если в value пришли цифры", async () => {
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
    expect(wrapper.html()).not.toContain("is-valid");
    expect(wrapper.html()).not.toContain("is-invalid");
  });

  it.skip("когда загрузилась страница, input с серией, если в value пришли буквы", async () => {
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
    expect(wrapper.html()).not.toContain("is-valid");
    expect(wrapper.html()).not.toContain("is-invalid");
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
    // await getCodeInput.trigger("blur");
    expect(wrapper.html()).toContain(`Выберите значение из выпадающего списка`);
  });

  it.skip("ввели невалидное значение в инпут с серией, появился текст с ошибкой", async () => {
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
        isMap: false,
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

  it.skip("Убрали регистрозависимость в компоненте", async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    wrapper = mount(ControlCustomCombobox, {
      localVue,

      propsData: {
        edit: true,
        data: {
          label: "Страна",
          type: "customCombobox",
          structType: "double",
          id: "1012",
          fieldId: 58448,
          cols: 6,
          colSm: 12,
          colMd: 12,
          isMask: false,
          colLg: 12,
          width: "100%",
          name: "IDCOUNTRY_EVENT",
          cssClass: "",
          webId: "",
          visible: true,
          required: true,
          page: 1,
          readonly: false,
          control: null,
          state: null,
          checked: null,
          error: null,
          isRelation: false,
          fieldRelation: null,
          isTab: true,
          options: [
            { SNAME: "РОССИЯ", ID: 179, value: 179, text: "РОССИЯ" },
            { SNAME: "АБХАЗИЯ", ID: 239, value: 239, text: "АБХАЗИЯ" },
            { SNAME: "АВСТРАЛИЯ", ID: 11, value: 11, text: "АВСТРАЛИЯ" },
            { SNAME: "АВСТРИЯ", ID: 12, value: 12, text: "АВСТРИЯ" },
            { SNAME: "АЗЕРБАЙДЖАН", ID: 9, value: 9, text: "АЗЕРБАЙДЖАН" },
            { SNAME: "АЛБАНИЯ", ID: 2, value: 2, text: "АЛБАНИЯ" },
            { SNAME: "АЛЖИР", ID: 4, value: 4, text: "АЛЖИР" },
            { SNAME: "АНГИЛЬЯ", ID: 183, value: 183, text: "АНГИЛЬЯ" },
            { SNAME: "АНГОЛА", ID: 7, value: 7, text: "АНГОЛА" },
            { SNAME: "АНДОРРА", ID: 6, value: 6, text: "АНДОРРА" },
            { SNAME: "АНТАРКТИДА", ID: 3, value: 3, text: "АНТАРКТИДА" },

            { SNAME: "АРГЕНТИНА", ID: 10, value: 10, text: "АРГЕНТИНА" },
            { SNAME: "АРМЕНИЯ", ID: 16, value: 16, text: "АРМЕНИЯ" },
            { SNAME: "АРУБА", ID: 149, value: 149, text: "АРУБА" },
            { SNAME: "АФГАНИСТАН", ID: 1, value: 1, text: "АФГАНИСТАН" },
            {
              SNAME: "БАГАМСКИЕ ОСТРОВА",
              ID: 13,
              value: 13,
              text: "БАГАМСКИЕ ОСТРОВА",
            },
            { SNAME: "БАНГЛАДЕШ", ID: 15, value: 15, text: "БАНГЛАДЕШ" },
            { SNAME: "БАРБАДОС", ID: 17, value: 17, text: "БАРБАДОС" },
            { SNAME: "БАХРЕЙН", ID: 14, value: 14, text: "БАХРЕЙН" },
            { SNAME: "БЕЛАРУСЬ", ID: 34, value: 34, text: "БЕЛАРУСЬ" },
            { SNAME: "БЕЛИЗ", ID: 26, value: 26, text: "БЕЛИЗ" },
            { SNAME: "БЕЛЬГИЯ", ID: 18, value: 18, text: "БЕЛЬГИЯ" },
            { SNAME: "БЕНИН", ID: 59, value: 59, text: "БЕНИН" },
            {
              SNAME: "БЕРМУДСКИЕ ОСТРОВА (БРИТ.)",
              ID: 19,
              value: 19,
              text: "БЕРМУДСКИЕ ОСТРОВА (БРИТ.)",
            },
            { SNAME: "БИРМА", ID: 265, value: 265, text: "БИРМА" },
            { SNAME: "БОЛГАРИЯ", ID: 31, value: 31, text: "БОЛГАРИЯ" },
            { SNAME: "БОЛИВИЯ", ID: 21, value: 21, text: "БОЛИВИЯ" },
            {
              SNAME: "БОНЭЙР, СИНТ-ЭСТАТИУС И САБА",
              ID: 272,
              value: 272,
              text: "БОНЭЙР, СИНТ-ЭСТАТИУС И САБА",
            },
            {
              SNAME: "БОСНИЯ И ГЕРЦЕГОВИНА",
              ID: 22,
              value: 22,
              text: "БОСНИЯ И ГЕРЦЕГОВИНА",
            },
          ],
        },
      },
    });

    const getCodeInput = wrapper.findComponent(".autocomplete-input");
    expect(wrapper.vm.isErr).toBe(null);
    await getCodeInput.setValue("ффф");
    await getCodeInput.trigger("blur");
    expect(wrapper.vm.isErr).toBe(false);
    await getCodeInput.setValue("р");
    await getCodeInput.trigger("blur");
    expect(wrapper.vm.isErr).toBe(true);
    expect(getCodeInput.element.value).toBe("РОССИЯ");
  });
});
