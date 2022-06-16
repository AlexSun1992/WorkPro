import { data } from "./FilterBlock.helper.fixtures";
import getSameTypeUnitsCount from "./FilterBlock.helper";

describe("Подсчет количества полисов", () => {
  it("считает количество полисов каждого типа", () => {
    const TEST_DATA = [...data];
    const eachTypeUnitCount = getSameTypeUnitsCount(TEST_DATA, "ОСАГО");
    expect(typeof eachTypeUnitCount).toBe("number");
  });
  it("сравнение количества полисов", () => {
    const TEST_DATA = [...data];
    const eachTypeUnitCount = getSameTypeUnitsCount(TEST_DATA, "ДМС");
    expect(eachTypeUnitCount).toBe(6);
  });
});
