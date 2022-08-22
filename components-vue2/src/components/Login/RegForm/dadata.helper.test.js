import { fetchSuggestions } from "./dadata.helper";

import { suggestionsSurnames } from "./dadata.helper.fixtures";
import { createParamsForRequest, getSuggestions } from "./dadata.helper";
import { revealGender } from "./dadata.helper";
import { paramsSurname } from "./dadata.helper.fixtures";
import { suggestionsNames } from "./dadata.helper.fixtures";
import { paramsName } from "./dadata.helper.fixtures";
import { suggestionsPatronymic } from "./dadata.helper.fixtures";
import { paramsPatronymic } from "./dadata.helper.fixtures";

import { fetch, Response } from "node-fetch";
import { jest } from "@jest/globals";

describe("Модуль тестирования подсказок по ФИО dadata", () => {
  it("создаем mock для fetch запроса на подсказки по фамилии к dadata", async () => {
    const suggestionsDataSurnames = suggestionsSurnames;
    const mockFn = jest
      .fn()
      .mockImplementation(() => Promise.resolve(suggestionsDataSurnames));
    const result = await mockFn();
    expect(typeof result === "object").toBe(true);
  });

  it("тестируем параметры запроса функции fetchSuggestions при запросе для получения фамилий ", () => {
    const requestParams = createParamsForRequest();
    expect(typeof requestParams === "object").toBe(true);
  });

  it("Выявляем очищены ли поля с запросом к dadata на ФИО", () => {
    const checkFIOFields = revealGender("", "", "");
    expect(checkFIOFields).toBe(false);
  });

  //   it("Получение конкретных подсказок", async () => {
  //     const suggestions = await getSuggestions();
  //     console.log(suggestions);
  //     expect(typeof suggestions === "object").toBe(true);
  //   });
});
