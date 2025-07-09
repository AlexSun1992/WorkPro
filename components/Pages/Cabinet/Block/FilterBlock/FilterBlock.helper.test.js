import { data } from "./FilterBlock.helper.fixtures";
import { getSameTypeUnitsCount } from "./FilterBlock.helper";

describe("FilterBlock", () => {
  it("считает количество полисов каждого типа", () => {
    const TEST_DATA = [...data];
    const eachTypeUnitCount = getSameTypeUnitsCount(TEST_DATA, "ОСАГО");
    expect(typeof eachTypeUnitCount).toBe("number");
  });
  it("корректно считает количество полисов", () => {
    const TEST_DATA = [...data];
    const eachTypeUnitCount = getSameTypeUnitsCount(TEST_DATA, "ДМС");
    expect(eachTypeUnitCount).toBe(6);
  });
});
