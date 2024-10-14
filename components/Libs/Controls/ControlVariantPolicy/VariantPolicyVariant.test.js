import { mount } from "@vue/test-utils";
import VariantPolicyFranchise from "./VariantPolicyFranchise.vue";
import VariantPolicyVariant from "./VariantPolicyVariant.vue";
import { cardMock, featuresListMock, variantsMock } from "./VariantPolicyVariantMockTestData";
import { VariantPolicyStore } from "./VariantPolicyStore";

const card = cardMock;
const featuresList = featuresListMock;
const customStore = new VariantPolicyStore();
const variants = variantsMock;
const propsData = { variants, customStore, card, featuresList };

describe('VariantPolicy', () => {
  const wrapper = mount(VariantPolicyVariant, {
    stubs: { VariantPolicyFranchise },
    propsData
  });

  it('Show data for current variant', () => {
    let cost = wrapper.find('.variant-cost').html();

    cost = cost ? cost.replaceAll('&nbsp;', '') : cost;

    expect(wrapper.find('.box-title').html()).toContain(card.SNAME);
    expect(cost).toContain(`${card.NPRICE}`);
  });

  it('Select variant', async () => {
    await wrapper.find('.variant-policy').trigger('click');

    expect(wrapper.vm.customStore.state.selectedVariant.IDVARIANT).toBe(card.ID);
  });
});
