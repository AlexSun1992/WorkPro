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
    customStore.setFranchise(VariantPolicyFranchiseOptions[0]);

    const wrapper = mount(VariantPolicyFranchise, {
      stubs: { ControlDropdown },
      propsData: {
        options,
        customStore
      }
    });

    wrapper.vm.$nextTick();

    expect(wrapper.vm.value.value).toBe(VariantPolicyFranchiseOptions[0].value);
  });
});
