import { mount } from "@vue/test-utils";
import VariantPolicyFranchise from "./VariantPolicyFranchise.vue";
import VariantPolicyVariant from "./VariantPolicyVariant.vue";
import { cardMock, featuresListMock, variantsMock } from "./VariantPolicyVariantMockTestData";

const card = cardMock;
const featuresList = featuresListMock;
const variants = variantsMock;
const propsData = { variants, card, featuresList };

describe("VariantPolicy", () => {
  const wrapper = mount(VariantPolicyVariant, {
    stubs: { VariantPolicyFranchise },
    propsData,
  });

  it("Show data for current variant", () => {
    let cost = wrapper.find(".variant-cost").html();

    cost = cost ? cost.replaceAll("&nbsp;", "") : cost;

    expect(wrapper.find(".box-title").html()).toContain(card.SNAME);
    expect(cost).toContain(`${card.NPRICE}`);
  });

  it("Select variant", async () => {
    jest.spyOn(wrapper.vm, "updateVariant");

    expect(wrapper.vm.updateVariant).not.toBeCalled();

    await wrapper.find(".variant-policy").trigger("click");

    expect(wrapper.vm.updateVariant).toBeCalled();
  });
});
