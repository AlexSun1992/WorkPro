import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import Vue from "vue";
import {
  BButton,
  BCol,
  BFormCheckbox,
  BFormGroup,
  BFormInvalidFeedback,
  BInputGroup,
  BLink,
  BRow,
} from "bootstrap-vue";
import RegNumberAutoNumber from "./RegNumberAutoNumber.vue";
import { clientCarsPropsData } from "./RegNumberAutoNumberTestData";
import * as dataCard from "@/store/data_card";

const clientCars = clientCarsPropsData;

describe("RegNumberAutoNumber", () => {
  Vue.use(Vuex);
  const store = new Vuex.Store({
    modules: {
      data_card: {
        ...dataCard,
        namespaced: true,
      },
    },
  });
  const wrapper = mount(RegNumberAutoNumber, {
    stubs: {
      BInputGroup,
      BCol,
      BFormGroup,
      BRow,
      BFormInvalidFeedback,
      BCheckbox: BFormCheckbox,
      BButton,
      BLink,
    },
    propsData: { clientCars, value: null },
    mocks: {
      $store: store,
    },
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

  it("Disable number input", () => {
    /* wrapper.findComponent(BFormCheckbox).setChecked();
    wrapper.vm.$nextTick(); */
    wrapper.vm.goWithoutCarNumber(true);

    expect(wrapper.vm.regNumberDisabled).toBe(true);
  });

  it("Only 3 Reg Numbers on form", () => {
    expect(wrapper.vm.clientCars.length).toBeGreaterThan(3);
    expect(wrapper.vm.customerCarNumbers.length).toBe(3);
  });

  it('Disabled if Rest return "N" value as Number', () => {
    const wrapper = mount(RegNumberAutoNumber, {
      stubs: {
        BInputGroup,
        BCol,
        BFormGroup,
        BRow,
        BFormInvalidFeedback,
        BCheckbox: BFormCheckbox,
        BButton,
        BLink,
      },
      propsData: { clientCars, value: "N" },
      mocks: {
        $store: store,
      },
    });

    expect(wrapper.vm.isWithoutCarNumber).toBe(true);
    expect(wrapper.vm.regNumberDisabled).toBe(true);
    expect(wrapper.vm.valueComputed).toBe("N");
  });
});
