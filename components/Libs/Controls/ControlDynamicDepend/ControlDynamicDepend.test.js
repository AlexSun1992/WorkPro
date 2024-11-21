import { mount } from "@vue/test-utils";
import ControlDynamicDepend from "./ControlDynamicDepend.vue";
import { propsData } from "./ControlDynamicDepend.helper.fixtures";

describe("ControlDynamicDepend", () => {
  it("Отображается value ", () => {
    const wrapper = mount(ControlDynamicDepend, {
      propsData,
    });

    const finalPrice = wrapper.text().replace(/[\s\uOOAO]/g, "");

    expect(Number(finalPrice)).toBe(propsData.data.value);
  });
});
