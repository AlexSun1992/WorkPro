import { mount } from "@vue/test-utils";
import vueEasyTooltipEsm from "vue-easy-tooltip";
import VariantPolicyFeatures from "./VariantPolicyFeatures.vue";
import { VariantPolicyStore } from "./VariantPolicyStore";
import { featuresDataMock, featuresListMock } from "./VariantPolicyFaturesTestData";

const customStore = VariantPolicyStore();
const featuresData = featuresDataMock;
const featuresList = featuresListMock;

describe('VariantPolicyFeatures', () => {
  const wrapper = mount(VariantPolicyFeatures, {
    stubs: { vueEasyTooltip: vueEasyTooltipEsm },
    propsData: { customStore, featuresData, featuresList }
  });

  it('Total features count', () => {
    const features = wrapper.findAll('.variant-policy-feature>div');

    expect(features.length === featuresList.length).toBe(true);
  });

  it ('Valid features name', () => {
    for (const item of featuresList) {
      expect(wrapper.html()).toContain(featuresData[item]);
    }
  });
});
