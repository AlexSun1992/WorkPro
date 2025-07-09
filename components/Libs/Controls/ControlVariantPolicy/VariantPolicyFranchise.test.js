import { mount } from "@vue/test-utils";
import VariantPolicyFranchise from "./VariantPolicyFranchise.vue";
import ControlDropdown from "../ControlDropdown/ControlDropdown.vue";
import { VariantPolicyFranchiseOptionsA } from "./VariantPolicyFranchiseTestData";

const options = VariantPolicyFranchiseOptionsA;

describe("VariantPolicyFranchise", () => {
  it("Empty value after component init", () => {
    const wrapper = mount(VariantPolicyFranchise, {
      stubs: { ControlDropdown },
      propsData: {
        options,
      },
    });

    expect(wrapper.vm.value).toBe(null);
  });

  it("Init value after component init", () => {
    const wrapper = mount(VariantPolicyFranchise, {
      stubs: { ControlDropdown },
      propsData: {
        value: VariantPolicyFranchiseOptionsA.variants[0],
        options: options.variants,
      },
    });

    expect(wrapper.vm.valueComputed).toBe(VariantPolicyFranchiseOptionsA.variants.list[0].id);
  });

  it("Plain text as franchise value", () => {
    const wrapper = mount(VariantPolicyFranchise, {
      stubs: { ControlDropdown },
      propsData: {
        options: { value: options.text },
      },
    });

    expect(wrapper.element.innerHTML).toMatch(VariantPolicyFranchiseOptionsA.text);
  });

  it("Currency format for dropdown", () => {
    const wrapper = mount(VariantPolicyFranchise, {
      stubs: { ControlDropdown },
      propsData: {
        options: options.variants,
      },
    });

    expect(wrapper.vm.optionsComputed[0].text).toBe("30\u00A0000\u00A0₽");
    expect(wrapper.vm.optionsComputed[1].text).toBe("60\u00A0000\u00A0₽");
  });

  it("Init component with default value", () => {
    const wrapper = mount(VariantPolicyFranchise, {
      stubs: { ControlDropdown },
      propsData: {
        options: options.variants,
        defaultValue: 3,
      },
    });

    expect(wrapper.vm.valueComputed).toBe(3);
  });
});
