import { shallowMount } from "@vue/test-utils";
import { BFormGroup } from "bootstrap-vue";
import ControlSelectButton from "./ControlSelectButton.vue";

describe("ControlSelectButton test", () => {
  const dataProps = {
    label: "<b>Автомобили из ваших расчетов</b>",
    options: [
      { ID: 1, SNAME: "Audi", text: "Audi", value: 1 },
      { ID: 2, SNAME: "LADA", text: "LADA", value: 2 },
      { ID: 3, SNAME: "BMW", text: "BMW", value: 3 },
    ],
    name: "IDOBJECT",
    type: "SelectButton",
    fieldId: 62054,
  };
  const wrapper = shallowMount(ControlSelectButton, {
    components: { BFormGroup },
    propsData: {
      data: dataProps,
    },
  });

  it("Проверяем отображение компонента", () => {
    expect(wrapper).not.toBe(null);
  });

  it("Проверяем количество кнопок", () => {
    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(dataProps.options.length);
  });

  it("Проверяем текст кнопки", () => {
    const firstButton = wrapper.findAll("button").at(0);
    expect(firstButton.text()).toBe(dataProps.options.at(0).SNAME);
  });
});

describe("ControlSelectButton test without objects", () => {
  const dataProps = {
    label: "<b>Автомобили из ваших расчетов</b>",
    options: [],
    name: "IDOBJECT",
    type: "SelectButton",
    fieldId: 62054,
  };
  const wrapper = shallowMount(ControlSelectButton, {
    components: { BFormGroup },
    propsData: {
      data: dataProps,
    },
  });

  it("Проверяем отображение что компонент не отобразился", () => {
    expect(wrapper.isVisible()).toBe(false);
    expect(wrapper.find("label").exists()).toBe(false);
    expect(wrapper.find("button").exists()).toBe(false);
  });
});
