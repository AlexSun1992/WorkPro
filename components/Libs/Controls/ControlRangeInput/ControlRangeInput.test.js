import { mount, shallowMount } from "@vue/test-utils";
import {
  dataMockSeveralItems,
  dataMockTwolItems,
} from "./ControlRangeInput.fixtures";
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

    const add = wrapper.find("#add");
    add.trigger("click");

    const substract = wrapper.find("#subtract");
    substract.trigger("click");
    substract.trigger("click");
  });
});
