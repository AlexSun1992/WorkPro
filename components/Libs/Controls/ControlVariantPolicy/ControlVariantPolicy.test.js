import { mount } from "@vue/test-utils";
import VueSlickCarousel from "vue-slick-carousel";
import ControlVariantPolicy from "./ControlVariantPolicy.vue";
import VariantPolicyVariant from "./VariantPolicyVariant.vue";
import VariantPolicyFeatures from "./VariantPolicyFeatures.vue";
import { ControlVariantPolicyProps } from "./ControlVariantPolicyMockTestData";

const propsData = { data: ControlVariantPolicyProps };

describe('ControlVariantPolicy', () => {
  const wrapper = mount(ControlVariantPolicy, {
    stubs: { VueSlickCarousel, VariantPolicyVariant, VariantPolicyFeatures },
    propsData,
    data: () => ({  })
  });

  test("Some test", () => {
    expect(wrapper.vm).toBeTruthy();
  })
});
