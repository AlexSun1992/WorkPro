import axios from "axios";
import { getBrandmodelSuggestions } from "./controlDadataSelect.helper";

jest.mock("axios");
describe("сравнение значений возвращаемых из справочника dadata", () => {
  it("получение данных с фильтрами", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({ data: { suggestions: [] } })
    );

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
    axios.mockImplementationOnce(() =>
      Promise.resolve({ data: { suggestions: [{ value: "АВТОБУС" }] } })
    );
    const suggestionsWithFilters = await getBrandmodelSuggestions("автобус");
    const isBusExist = Boolean(
      suggestionsWithFilters.find((item) => item.value.includes("АВТОБУС"))
    );

    expect(isBusExist).toBe(true);
  });
});
