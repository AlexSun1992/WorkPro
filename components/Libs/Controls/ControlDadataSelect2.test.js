import Vue from "vue";
import Vuex from "vuex";
import { mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import AutoComplete from "./ControlDadataSelect2.vue";

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
});
