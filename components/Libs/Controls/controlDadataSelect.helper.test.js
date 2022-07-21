import { getBrandmodelSuggestions } from "./controlDadataSelect.helper";

describe("сравнение значений возвращаемых из справочника dadata", () => {
  it("получение данных с фильтрами", async () => {
    const suggestionsWithFilters = await getBrandmodelSuggestions("автобус", [
      {
        car_type: "Л",
      },
      {
        car_type: "Д",
      },
      {
        car_type: "МА",
      },
      {
        car_type: "МЛ",
      },
    ]);
    const isBusExist = Boolean(
      suggestionsWithFilters.find((item) => item.value.includes("АВТОБУС"))
    );

    expect(isBusExist).toBe(false);
  });
  it("получение данных без фильтров", async () => {
    const suggestionsWithFilters = await getBrandmodelSuggestions("автобус");
    const isBusExist = Boolean(
      suggestionsWithFilters.find((item) => item.value.includes("АВТОБУС"))
    );

    expect(isBusExist).toBe(true);
  });
});
