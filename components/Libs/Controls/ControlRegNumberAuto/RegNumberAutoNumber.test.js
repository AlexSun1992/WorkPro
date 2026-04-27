import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import Vue from "vue";
import RegNumberAutoNumber from "./RegNumberAutoNumber.vue";
import { clientCarsPropsData } from "./RegNumberAutoNumberTestData";
import * as dataCard from "@/store/data_card";

const clientCars = clientCarsPropsData;

describe("RegNumberAutoNumber", () => {
  let wrapper;

  const createWrapper = (props = {}, options = {}) =>
    mount(RegNumberAutoNumber, {
      propsData: {
        clientCars: [],
        value: null,
        data: { name: "SREGNUM", type: "RegNumberAuto" },
        ...props,
      },

      ...options,
    });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("Initial state", () => {
    it("renders correctly with default props", () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('input[placeholder="А 000 АА"]').exists()).toBe(true);
      expect(wrapper.find('input[placeholder="000"]').exists()).toBe(true);
    });

    it("shows moto placeholder when field relation is moto", () => {
      wrapper = createWrapper(
        {
          data: {
            fieldRelation: "someField",
          },
        },
        {
          computed: {
            fieldsRelationsValue: () => 2, // MOTO_MASK_ID
          },
        }
      );
      expect(wrapper.find('input[placeholder="0000 AA"]').exists()).toBe(true);
      expect(wrapper.find('input[placeholder="000"]').exists()).toBe(true);
    });
  });

  describe("Number input", () => {
    it("formats auto number correctly", async () => {
      wrapper = createWrapper();
      const numberInput = wrapper.find('input[placeholder="А 000 АА"]');

      await numberInput.setValue("a123aa");
      expect(wrapper.vm.numberValue).toBe("A 123 AA");
    });

    it("formats moto number correctly", async () => {
      wrapper = createWrapper(
        {
          data: {
            fieldRelation: "someField",
          },
        },
        {
          computed: {
            fieldsRelationsValue: () => 2, // MOTO_MASK_ID
          },
        }
      );
      const numberInput = wrapper.find('input[placeholder="0000 AA"]');

      await numberInput.setValue("1234aa");
      expect(wrapper.vm.numberValue).toBe("1234 AA");
    });

    it("prevents invalid characters", async () => {
      wrapper = createWrapper();
      const numberInput = wrapper.find('input[placeholder="А 000 АА"]');

      await numberInput.trigger("focus");
      numberInput.element.selectionStart = 0;

      const inputValue = "a12!3aa";
      for (let i = 0; i < inputValue.length; i++) {
        const char = inputValue[i];
        // Создаем событие keydown
        const keydownEvent = new KeyboardEvent("keydown", {
          key: char,
          cancelable: true,
        });

        // Триггерим обработчик вручную
        wrapper.vm.numberKeydown(keydownEvent);

        // Продолжаем ввод только если событие не было отменено
        if (!keydownEvent.defaultPrevented) {
          // Обновляем значение input
          const currentValue = numberInput.element.value;
          numberInput.element.value =
            currentValue.substring(0, numberInput.element.selectionStart) +
            char +
            currentValue.substring(numberInput.element.selectionStart);

          // Эмулируем событие input
          numberInput.trigger("input");
        }

        // Обновляем позицию курсора
        numberInput.element.selectionStart++;
      }

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.numberValue).toBe("A 123 AA");
    });

    it("focuses code input when number is complete", async () => {
      wrapper = createWrapper();
      const numberInput = wrapper.find('input[placeholder="А 000 АА"]');
      const codeInput = wrapper.find('input[placeholder="000"]');
      codeInput.element.focus = jest.fn();

      await numberInput.setValue("a123aa");
      expect(codeInput.element.focus).toHaveBeenCalled();
    });
  });

  describe("Code input", () => {
    it("accepts only digits", async () => {
      wrapper = createWrapper();
      const codeInput = wrapper.find('input[placeholder="000"]');
      const numberInput = wrapper.find('input[placeholder="А 000 АА"]');

      await codeInput.setValue("12a3");
      await codeInput.trigger("blur");
      await numberInput.trigger("blur");

      expect(wrapper.vm.codeValue).toBe("");
    });

    it("limits to 3 digits", async () => {
      wrapper = createWrapper();
      const codeInput = wrapper.find('input[placeholder="000"]');
      const numberInput = wrapper.find('input[placeholder="А 000 АА"]');

      // Эмулируем ввод
      await codeInput.setValue("1234");
      await numberInput.trigger("blur");
      await codeInput.trigger("blur");

      expect(wrapper.vm.codeValue).toBe("123");
    });

    it("focuses back to number input when empty", async () => {
      wrapper = createWrapper();
      const numberInput = wrapper.find('input[placeholder="А 000 АА"]');
      const codeInput = wrapper.find('input[placeholder="000"]');
      numberInput.element.focus = jest.fn();

      await codeInput.setValue("123");
      await codeInput.setValue("");
      expect(numberInput.element.focus).toHaveBeenCalled();
    });
  });

  describe("Validation", () => {
    it("shows error when number is invalid", async () => {
      wrapper = createWrapper();
      const numberInput = wrapper.find('input[placeholder="А 000 АА"]');
      const codeInput = wrapper.find('input[placeholder="000"]');

      await numberInput.setValue("а12");
      await numberInput.trigger("blur");
      await codeInput.trigger("blur");

      expect(wrapper.find(".invalid-feedback").exists()).toBe(true);
      expect(wrapper.find(".invalid-feedback").text()).toContain("Пожалуйста, введите корректно госномер");
    });

    it("shows valid state when both fields are correct", async () => {
      wrapper = createWrapper();
      const numberInput = wrapper.find('input[placeholder="А 000 АА"]');
      const codeInput = wrapper.find('input[placeholder="000"]');

      await numberInput.setValue("a123aa");
      await codeInput.setValue("123");
      await numberInput.trigger("blur");
      await codeInput.trigger("blur");

      expect(wrapper.vm.isValid).toBe(true);
    });
  });

  describe("Without number checkbox", () => {
    it("disables inputs when checked", async () => {
      wrapper = createWrapper();
      const checkbox = wrapper.find("b-checkbox");

      await checkbox.trigger("change");

      expect(wrapper.vm.regNumberDisabled).toBe(true);
      expect(wrapper.find('input[placeholder="А 000 АА"]').attributes("disabled")).toBe("disabled");
      expect(wrapper.find('input[placeholder="000"]').attributes("disabled")).toBe("disabled");
    });
  });

  describe("Paste handling", () => {
    it("handles full number paste correctly", async () => {
      wrapper = createWrapper();
      const numberInput = wrapper.find('input[placeholder="А 000 АА"]');

      const pasteEvent = {
        clipboardData: {
          getData: () => "A123AA123",
        },
        preventDefault: jest.fn(),
      };

      await numberInput.trigger("paste", pasteEvent);

      expect(wrapper.vm.numberValue).toBe("A 123 AA");
      expect(wrapper.vm.codeValue).toBe("123");
    });
  });

  describe("Customer car numbers", () => {
    it("displays customer car numbers", () => {
      wrapper = createWrapper({
        clientCars: [{ SNAME: "А123БВ123" }, { SNAME: "В456УК321" }],
      });

      const buttons = wrapper.findAll(".car-number-button");
      expect(buttons.length).toBe(2);
      expect(buttons.at(0).text()).toContain("А123БВ123");
      expect(buttons.at(1).text()).toContain("В456УК321");
    });

    it("sets car number when clicked", async () => {
      wrapper = createWrapper({
        clientCars: [{ SNAME: "A123AA123" }],
      });

      const button = wrapper.findAll(".car-number-button");
      await button.trigger("click");

      expect(wrapper.vm.numberValue).toBe("A 123 AA");
      expect(wrapper.vm.codeValue).toBe("123");
    });
  });
});

describe("RegNumberAutoNumber", () => {
  Vue.use(Vuex);
  const wrapper = mount(RegNumberAutoNumber, {
    propsData: { clientCars, value: null, data: { mask: "Y###YY" } },
  });

  it("Set Reg Number is valid", () => {
    const numbers = ["A111AA333", "B123AA11"];

    for (const num of numbers) {
      wrapper.vm.setCarNumber(num);
      wrapper.vm.$nextTick();

      expect(wrapper.vm.isValid).toBe(true);
    }
  });

  it("Set Reg Number is Invalid", () => {
    const numbers = ["Ф111AA123", "A", "123456789", "asdfqwezx", ""];

    for (const num of numbers) {
      wrapper.vm.setCarNumber(num);
      wrapper.vm.$nextTick();

      expect(wrapper.vm.isValid).toBe(false);
    }
  });
  it("By default, placeholder is set for cars", () => {
    const input = wrapper.find("input");

    expect(input.element.placeholder).toBe("А 000 АА");
  });

  it("Changing placeholder for motorcycles", () => {
    const wrapper = mount(RegNumberAutoNumber, {
      propsData: { clientCars, value: null, data: { mask: "" } },
      computed: {
        fieldsRelationsValue: () => 2,
      },
    });

    const input = wrapper.find("input");
    expect(input.element.placeholder).toBe("0000 AA");
  });

  it("Change the placeholder to any", () => {
    const wrapper = mount(RegNumberAutoNumber, {
      propsData: { clientCars, value: null, data: { fieldRelation: "IDREGNUMBER" } },
      computed: {
        fieldsRelationsValue: () => 3,
        fieldsRelations: () => [{ value: 3 }],
      },
    });

    const input = wrapper.find("input");
    expect(input.element.placeholder).toBe("");
  });

  it("Only 3 Reg Numbers on form", () => {
    expect(wrapper.vm.clientCars.length).toBeGreaterThan(3);
    expect(wrapper.vm.customerCarNumbers.length).toBe(3);
  });

  it('Disabled if Rest return "N" value as Number', () => {
    const wrapper = mount(RegNumberAutoNumber, {
      propsData: { clientCars, value: "N", data: { mask: "Y###YY" } },
    });

    expect(wrapper.vm.isWithoutCarNumber).toBe(true);
    expect(wrapper.vm.regNumberDisabled).toBe(true);
    expect(wrapper.vm.valueComputed).toBe("N");
  });
});
