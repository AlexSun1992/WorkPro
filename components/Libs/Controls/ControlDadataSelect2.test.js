import Vue from "vue";
import Vuex from "vuex";
import { mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import AutoComplete from "./ControlDadataSelect2.vue";
import { dataPropsSet, resultValue } from "./ControlDadataSelect2.fixtures";

describe("Обрабатываем различные значения", () => {
  let wrapper;

  beforeEach(() => {
    Vue.use(Vuex, BootstrapVue);
  });

  it("Строковый тип данных", async () => {
    const dataProps = {
      label: "Наименование банка получателя",
      value: '"\\"АО «Тинькофф Банк»\\""',
    };
    wrapper = mount(AutoComplete, {
      propsData: {
        data: dataProps,
      },
    });
    expect(wrapper.vm.getCurrentValue).toEqual('"АО «Тинькофф Банк»"');
  });

  it("Ошибка парсинга", () => {
    const dataProps = {
      label: "Наименование банка получателя",
      value: "АО «Тинькофф Банк»",
    };
    wrapper = mount(AutoComplete, {
      propsData: {
        data: dataProps,
      },
    });
    expect(wrapper.vm.getCurrentValue).toEqual("АО «Тинькофф Банк»");
  });
  it("Формат JSON", () => {
    const dataProps = {
      label: "Наименование банка получателя",
      value: '{"value":"АО «Тинькофф Банк»"}',
    };
    wrapper = mount(AutoComplete, {
      propsData: {
        data: dataProps,
      },
    });
    expect(wrapper.vm.getCurrentValue).toEqual("АО «Тинькофф Банк»");
  });

  it("Метод компонента handleBlur не вызывается после handleSubmit", async () => {
    wrapper = mount(AutoComplete, {
      propsData: {
        data: dataPropsSet,
      },
      computed: {
        getCurrentValue() {
          return "Московская обл, г Балашиха, пр-кт Ленина, д 77, кв 56";
        },
      },
    });
    const blurSpy = jest.spyOn(wrapper.vm, "handleBlur");
    await wrapper.vm.handleSubmit(resultValue);
    console.log("wrapper:", wrapper.html());
    expect(blurSpy).not.toHaveBeenCalled();
    expect(wrapper).not.toBe(null);
  });

  it("Метод компонента handleBlur вызывается", async () => {
    wrapper = mount(AutoComplete, {
      propsData: {
        data: dataPropsSet,
      },
      computed: {
        getCurrentValue() {
          return "Московская обл, г Балашиха, пр-кт Ленина, д 77, кв 56";
        },
      },
    });

    await wrapper.vm.handleBlur(resultValue);
    expect(wrapper.emitted().update).toBeTruthy();
  });
});
