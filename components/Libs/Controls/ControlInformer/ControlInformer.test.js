import { mount } from "@vue/test-utils";
import { propsData } from "./ControlInformer.helper.fixtures";

import ControlInformer from "./ControlInformer.vue";

describe("ControlInformer", () => {
  let wrapper;

  const createComponent = (dataSet) => {
    wrapper = mount(ControlInformer, {
      propsData: {
        data: dataSet,
      },
    });
  };

  it("Проверяем наличие класса (Warning)", () => {
    const copyDataSet = JSON.parse(JSON.stringify(propsData));
    copyDataSet.name = "SINFORMER_WARNING";

    createComponent(copyDataSet);

    const wrapperDIV = wrapper.find("div");

    expect(wrapperDIV.classes()).toContain("htmlStyleWarning");
  });

  it("Проверяем наличие класса (Succes)", () => {
    const copyDataSet = JSON.parse(JSON.stringify(propsData));
    copyDataSet.name = "SINFORMER_SUCCESS";

    createComponent(copyDataSet);

    const wrapperDIV = wrapper.find("div");

    expect(wrapperDIV.classes()).toContain("htmlStyleSuccess");
  });

  it("Проверяем наличие класса (Error)", () => {
    const copyDataSet = JSON.parse(JSON.stringify(propsData));

    copyDataSet.name = "SINFORMER_ERROR";

    createComponent(copyDataSet);

    const wrapperDIV = wrapper.find("div");

    expect(wrapperDIV.classes()).toContain("htmlStyleError");
  });
});
