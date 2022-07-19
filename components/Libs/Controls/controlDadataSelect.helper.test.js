import { getSuggestions } from "./controlDadataSelect.helper";

describe("сравнение значений возвращаемых из справочника dadata", () => {
  it("получение данных с фильтрами", async () => {
    const result = await getSuggestions();
    expect(result.length).toBe(1);
  });
});
