import { getSuggestionsWithFilters } from "./controlDadataSelect.helper";
import { getSuggestionsWithOutFilters } from "./controlDadataSelect.helper";

describe("сравнение значений возвращаемых из справочника dadata", () => {
  it("получение данных с фильтрами", async () => {
    const suggestionsWithFilters = await getSuggestionsWithFilters();

    expect(suggestionsWithFilters.length).toBe(0);
  });
  it("получение данных без фильтров", async () => {
    const suggestionsWithOutFilters = await getSuggestionsWithOutFilters();
    const isBus = suggestionsWithOutFilters.find((item) =>
      item.value.includes("АВТОБУС")
    );

    expect(typeof isBus).toBe("object");
  });
});
