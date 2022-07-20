import { getSuggestionsWithFilters } from "./controlDadataSelect.helper";
import { bodyWithFilters } from "./controlDadataSelect.helper.fixtures";
import { bodyWithOutFilters } from "./controlDadataSelect.helper.fixtures";

describe("сравнение значений возвращаемых из справочника dadata", () => {
  it("получение данных с фильтрами", async () => {
    const suggestionsWithFilters = await getSuggestionsWithFilters(
      bodyWithFilters
    );
    const objectWithValueIncludesBus = suggestionsWithFilters.find((item) =>
      item.value.includes("АВТОБУС")
    );
    expect(objectWithValueIncludesBus).toBe(undefined);
  });
  it("получение данных без фильтров", async () => {
    const suggestionsWithFilters = await getSuggestionsWithFilters(
      bodyWithOutFilters
    );
    const objectWithValueIncludesBus = suggestionsWithFilters.find((item) =>
      item.value.includes("АВТОБУС")
    );

    const isBusExist = objectWithValueIncludesBus.value.includes("АВТОБУС");

    expect(isBusExist).toBe(true);
  });
});
