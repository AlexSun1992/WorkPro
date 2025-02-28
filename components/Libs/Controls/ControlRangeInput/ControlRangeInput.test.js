import { mount } from "@vue/test-utils";
import { dataMockSeveralItems } from "./ControlRangeInput.fixtures";
import ControlRangeInput from "./ControlRangeInput.vue";

describe("ControlRangeInput", () => {
  let wrapper;
  const createComponent = (elements) => {
    wrapper = mount(ControlRangeInput, elements);
  };

  it("отображение компонента", () => {
    const spy = jest.spyOn(document, "getElementById");
    spy.mockReturnValue((id) => {
      if (id === "inp") {
        return { clientWidth: 840 };
      }
      return null;
    });
    createComponent(dataMockSeveralItems);
    const inputSelectorTel = "[type=tel]";
    const getInputTel = wrapper.find(inputSelectorTel);

    getInputTel.setValue("3000000");

    const inputSelectorRange = "[type=range]";
    const getInputrange = wrapper.find(inputSelectorRange);

    expect(getInputrange.exists()).toBe(true);
  });
  it("+/-", () => {
    const spy = jest.spyOn(document, "getElementById");
    spy.mockReturnValue((id) => {
      if (id === "inp") {
        return { clientWidth: 840 };
      }
      return null;
    });
    createComponent(dataMockSeveralItems);
    const inputSelectorTel = "[type=tel]";
    const getInputTel = wrapper.find(inputSelectorTel);

    expect(getInputTel.exists()).toBe(true);
    const add = wrapper.find("#add");
    add.trigger("click");

    const substract = wrapper.find("#subtract");
    substract.trigger("click");
    substract.trigger("click");
  });

  it("+/-", () => {
    const spy = jest.spyOn(document, "getElementById");
    spy.mockReturnValue((id) => {
      if (id === "inp") {
        return { clientWidth: 840 };
      }
      return null;
    });
    createComponent(dataMockSeveralItems);
    const inputSelectorTel = "[type=tel]";
    const getInputTel = wrapper.find(inputSelectorTel);

    expect(getInputTel);
    const add = wrapper.find("#add");
    add.trigger("click");

    const subtract = wrapper.find("#subtract");
    subtract.trigger("click");
    subtract.trigger("click");
  });

  it("Check the correct min value", async () => {
    const minValue = wrapper.vm.getMinValueFromPricesValue;
    const maxValue = wrapper.vm.getMaxValueFromPricesValue;
    dataMockSeveralItems.propsData.data.value = minValue - 50;
    createComponent(dataMockSeveralItems);
    expect(minValue).toBeLessThan(maxValue);
    expect(wrapper.vm.valueTypeNumber).toBe(minValue);
  });

  it("Check the correct max value", async () => {
    const maxValue = wrapper.vm.getMaxValueFromPricesValue;
    dataMockSeveralItems.propsData.data.value = maxValue + 50;
    createComponent(dataMockSeveralItems);

    expect(wrapper.vm.valueTypeNumber).toBe(maxValue);
  });
});
