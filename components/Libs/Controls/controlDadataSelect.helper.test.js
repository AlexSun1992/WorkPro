import { getSuggestionsWithFilters } from "./controlDadataSelect.helper";
import { getSuggestionsWithOutFilters } from "./controlDadataSelect.helper";

describe("сравнение значений возвращаемых из справочника dadata", () => {
  it("получение данных с фильтрами", async () => {
    const suggestionsWithFilters = await getSuggestionsWithFilters();
    const objectWithValueIncludesBus = suggestionsWithFilters.find((item) =>
      item.value.includes("АВТОБУС")
    );
    expect(objectWithValueIncludesBus).toBe(undefined);
  });
  it("получение данных без фильтров", async () => {
    const suggestionsWithOutFilters = await getSuggestionsWithOutFilters();
    const objectWithValueIncludesBus = suggestionsWithOutFilters.find((item) =>
      item.value.includes("АВТОБУС")
    );

    const isBusExist = objectWithValueIncludesBus.value.includes("АВТОБУС");
    expect(isBusExist).toBe(true);
  });
});
