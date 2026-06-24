import { mount } from "@vue/test-utils";
import ControlDynamicDepend from "./ControlDynamicDepend.vue";
import { paymentText, propsData } from "./ControlDynamicDepend.helper.fixtures";

describe("ControlDynamicDepend", () => {
  it("Отображается value ", () => {
    const wrapper = mount(ControlDynamicDepend, {
      propsData,
    });

    const finalPrice = wrapper.text().replace(/[\s\uOOAO]/g, "");

    expect(Number(finalPrice)).toBe(propsData.data.value);
  });

  describe("isStatePay", () => {
    test(`НЕ отображается сообщение ${paymentText}`, () => {
      const porData = JSON.parse(JSON.stringify(propsData));
      porData.data.options = [
        {
          SCOMMENT_DYNAMIC: "Стоимость полиса ОСАГО: 36,935 ₽",
          SNAME: 36935,
          LSTATEPAY: false,
          ID: 36935,
          text: "36935",
          value: 36935,
        },
      ];
      const wrapper = mount(ControlDynamicDepend, {
        propsData: porData,
      });

      expect(wrapper.html()).not.toContain(paymentText);
    });

    test(`Отображается сообщение ${paymentText}`, () => {
      const porData = JSON.parse(JSON.stringify(propsData));
      porData.data.options = [
        {
          SCOMMENT_DYNAMIC: "Стоимость полиса ОСАГО: 36,935 ₽",
          SNAME: 36935,
          LSTATEPAY: true,
          ID: 36935,
          text: "36935",
          value: 36935,
        },
      ];
      const wrapper = mount(ControlDynamicDepend, {
        propsData: porData,
      });

      expect(wrapper.html()).toContain(paymentText);
    });
  });
});
