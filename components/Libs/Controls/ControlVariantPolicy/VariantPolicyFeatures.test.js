import { mount } from "@vue/test-utils";
import vueEasyTooltipEsm from "vue-easy-tooltip";
import VariantPolicyFeatures from "./VariantPolicyFeatures.vue";
import { featuresDataMock, featuresHintMock, featuresListMock } from "./VariantPolicyFaturesTestData";

const featuresData = featuresDataMock;
const featuresOrder = featuresListMock;

describe('VariantPolicyFeatures', () => {
  const wrapper = mount(VariantPolicyFeatures, {
    stubs: { vueEasyTooltip: vueEasyTooltipEsm },
    propsData: { featuresData, featuresOrder, featuresHintMock }
  });

  it('Total features count', () => {
    const features = wrapper.findAll('.variant-policy-feature>div');

    expect(features.length === featuresOrder.length).toBe(true);
  });

  it ('Valid features name', () => {
    for (const item of featuresOrder) {
      expect(wrapper.html()).toContain(featuresData[item]);
    }
  });
});
