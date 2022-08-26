import { fetchSuggestions } from "./dadata.helper";

import { suggestionsSurnames } from "./dadata.helper.fixtures";
import { createParamsForRequest } from "./dadata.helper";
import { revealGender } from "./dadata.helper";
import { userSurnameGender } from "./dadata.helper";
import { userGender } from "./dadata.helper";
import { userPatronymicGender } from "./dadata.helper";
import { paramsSurname } from "./dadata.helper.fixtures";
import { suggestionsNames } from "./dadata.helper.fixtures";
import { paramsName } from "./dadata.helper.fixtures";
import { suggestionsPatronymic } from "./dadata.helper.fixtures";
import { paramsPatronymic } from "./dadata.helper.fixtures";
import { getSuggestionsFIO } from "./dadata.helper";
import { getSuggestions } from "./dadata.helper";
import { isEnoughDataForGenderDefine, isFieldFIOValid } from "./dadata.helper";
import { fetch, Response } from "node-fetch";
import { jest } from "@jest/globals";

describe("Модуль тестирования подсказок по ФИО dadata", () => {
  it("Выявляем очищены ли поля с запросом к dadata на ФИО", () => {
    const checkFIOFields = revealGender("", "", "");
    expect(checkFIOFields).toBe(true);
  });

  it("Выявляем пол по фамилии пользователя", () => {
    const checkGender = userGender(suggestionsSurnames, "Антонов");
    expect(checkGender).toBe("MALE");
  });

  it("Выявляем пол по имени пользователя", () => {
    const checkGender = userGender(suggestionsNames, "Александр");
    expect(checkGender).toBe("MALE");
  });

  it("Выявляем пол по отчеству пользователя", () => {
    const checkGender = userGender(suggestionsPatronymic, "Константинович");
    expect(checkGender).toBe("MALE");
  });

  it("собирем подсказки в массив", () => {});
  const emptyArr = [];
  const testResult = getSuggestions(suggestionsSurnames, emptyArr);
  expect(Array.isArray(testResult)).toBe(true);

  it("Определить достаточно ли данных для определения гендера", () => {
    const isGenderDefine = isEnoughDataForGenderDefine("", "");
    expect(isGenderDefine).toBe(true);
  });
  it("Определить достаточно ли данных для определения гендера", () => {
    const isGenderDefine = isEnoughDataForGenderDefine("", "Петровна");
    expect(isGenderDefine).toBe(false);
  });

  it("Валидируем водимый текст в поля ФИО", () => {
    const fieldFIOValue = isFieldFIOValid("ан", /^[а-яА-Я- ]*$/);
    expect(fieldFIOValue).toBe(false);
  });
  it("Валидируем водимый текст в поля ФИО", () => {
    const fieldFIOValue = isFieldFIOValid("test", /^[а-яА-Я- ]*$/);
    expect(fieldFIOValue).toBe(true);
  });
  it("Валидируем водимый текст в поля ФИО", () => {
    const fieldFIOValue = isFieldFIOValid("!!!1111 --", /^[а-яА-Я- ]*$/);
    expect(fieldFIOValue).toBe(true);
  });
});
