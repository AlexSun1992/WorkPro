import { mount } from "@vue/test-utils";
import VueSlickCarousel from "vue-slick-carousel";
import ControlVariantPolicy from "./ControlVariantPolicy.vue";
import VariantPolicyVariant from "./VariantPolicyVariant.vue";
import VariantPolicyFeatures from "./VariantPolicyFeatures.vue";
import { ControlVariantPolicyProps } from "./ControlVariantPolicyMockTestData";
import { VariantPolicyStore } from "./VariantPolicyStore";

const propsData = { data: ControlVariantPolicyProps };
const customStore = new VariantPolicyStore();

describe('ControlVariantPolicy', () => {
  const wrapper = mount(ControlVariantPolicy, {
    stubs: { VueSlickCarousel, VariantPolicyVariant, VariantPolicyFeatures },
    propsData,
    data: () => ({ customStore })
  });

  it('Custom store mounted', () => {
    expect(wrapper.vm.customStore?.state).toBeTruthy();
  });

  it('Variant selected from data props', () => {
    expect(wrapper.vm.customStore?.state.selectedVariant.IDVARIANT).toBeTruthy();
  });
});
