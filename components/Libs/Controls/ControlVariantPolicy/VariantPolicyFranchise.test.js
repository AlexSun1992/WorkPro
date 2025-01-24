import { mount } from "@vue/test-utils";
import VariantPolicyFranchise from "./VariantPolicyFranchise.vue";
import ControlDropdown from "../ControlDropdown/ControlDropdown.vue";
import { VariantPolicyFranchiseOptions } from "./VariantPolicyFranchiseTestData";
import { VariantPolicyStore } from "./VariantPolicyStore";

const options = VariantPolicyFranchiseOptions;
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
    const customStore = VariantPolicyStore();
    customStore.setFranchise(VariantPolicyFranchiseOptions.variants[0]);

    const wrapper = mount(VariantPolicyFranchise, {
      stubs: { ControlDropdown },
      propsData: {
        value: VariantPolicyFranchiseOptions.variants[0],
        options: options.variants,
        customStore
      }
    });

    expect(wrapper.vm.valueComputed.value).toBe(VariantPolicyFranchiseOptions.variants[0].value);
  });

  it('Plaint text as franchise value', () => {
    const wrapper = mount(VariantPolicyFranchise, {
      stubs: { ControlDropdown },
      propsData: {
        options: { value: options.text },
        customStore
      }
    });

    expect(wrapper.element.innerHTML).toMatch(VariantPolicyFranchiseOptions.text);
  })
});
