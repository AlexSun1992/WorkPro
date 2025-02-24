import { variantPolicyUtils } from "./variantPolicyUtils";
import { variantPolicyUtilsTestData } from "./variantPolicyUtilsTestData";

const { order } = variantPolicyUtilsTestData;
const { hints } = variantPolicyUtilsTestData;

describe("VariantPolicyUtils", () => {
  test("getHintsListByName return Array of Objects if all is ok", () => {
    const result = variantPolicyUtils.getHintsListByName(order, hints);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(order.length);
    expect(Object.entries(result[0])[0].includes(hints[0])).toBeTruthy();
  });

  test("getHintsListByName return empty Array if order is not Array", () => {
    const result = variantPolicyUtils.getHintsListByName(null, hints);

    expect(result).toBe(null);
  });
});
