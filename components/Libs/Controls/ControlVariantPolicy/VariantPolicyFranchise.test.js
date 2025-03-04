import { mount } from "@vue/test-utils";
import VariantPolicyFranchise from "./VariantPolicyFranchise.vue";
import ControlDropdown from "../ControlDropdown/ControlDropdown.vue";
import { VariantPolicyFranchiseOptionsA } from "./VariantPolicyFranchiseTestData";
import { VariantPolicyStore } from "./VariantPolicyStore";

const options = VariantPolicyFranchiseOptionsA;
const customStore = VariantPolicyStore();

describe('VariantPolicyFranchise', () => {
  it('Empty value after component init', () => {
    const wrapper = mount(VariantPolicyFranchise, {
      stubs: { ControlDropdown },
      propsData: {
        options,
        customStore
      }
    });

    expect(wrapper.vm.value).toBe(null);
  });

  it('Init value after component init', () => {
    customStore.setFranchise(VariantPolicyFranchiseOptionsA.variants[0]);

    const wrapper = mount(VariantPolicyFranchise, {
      stubs: { ControlDropdown },
      propsData: {
        value: VariantPolicyFranchiseOptionsA.variants[0],
        options: options.variants,
        customStore
      }
    });

    expect(wrapper.vm.valueComputed).toBe(VariantPolicyFranchiseOptionsA.variants.list[0].id);
  });

  it('Plain text as franchise value', () => {
    const wrapper = mount(VariantPolicyFranchise, {
      stubs: { ControlDropdown },
      propsData: {
        options: { value: options.text },
        customStore
      }
    });

    expect(wrapper.element.innerHTML).toMatch(VariantPolicyFranchiseOptionsA.text);
  });

  it("Currency format for dropdown", () => {
    const wrapper = mount(VariantPolicyFranchise, {
      stubs: { ControlDropdown },
      propsData: {
        options: options.variants,
        customStore
      }
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
        customStore
      }
    });

    expect(wrapper.vm.valueComputed).toBe(3);
  });
});
