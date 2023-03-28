import {
  suggestionsSurnames,
  suggestionsPatronymic,
  suggestionsNames,
} from "./dadata.helper.fixtures";

import {
  isEnoughDataForGenderDefine,
  isFieldFIONotValid,
  getArrayWithClass,
  isGenderReveal,
  userGender,
  getSuggestions,
} from "./dadata.helper";
import { fetch, Response } from "node-fetch";
import { jest } from "@jest/globals";

describe("Модуль тестирования подсказок по ФИО dadata", () => {
  it("Выявляем очищены ли поля с запросом к dadata на ФИО", () => {
    const checkFIOFields = isGenderReveal("", "", "");
    expect(checkFIOFields).toBe(false);
  });

  it("Выявляем очищены ли поля с запросом к dadata на ФИО,при заполненных", () => {
    const checkFIOFields = isGenderReveal("", "", "test");
    expect(checkFIOFields).toBe(true);
  });

  it("Выявляем очищены ли поля с запросом к dadata на ФИО,при заполненных", () => {
    const checkFIOFields = isGenderReveal("test", "", "");
    expect(checkFIOFields).toBe(true);
  });
  it("Выявляем очищены ли поля с запросом к dadata на ФИО,при заполненных", () => {
    const checkFIOFields = isGenderReveal("", "test", "");
    expect(checkFIOFields).toBe(true);
  });

  it("Выявляем пол по фамилии пользователя", () => {
    const checkGender = userGender(suggestionsSurnames, "Антонов");
    expect(checkGender).toBe("MALE");
  });

  it("Выявляем пол по фамилии пользователя", () => {
    const checkGender = userGender(suggestionsSurnames, "Антонова");
    expect(checkGender).toBe("FEMALE");
  });

  it("Выявляем пол по имени пользователя", () => {
    const checkGender = userGender(suggestionsNames, "Александр");
    expect(checkGender).toBe("MALE");
  });

  it("Выявляем пол по имени пользователя", () => {
    const checkGender = userGender(suggestionsNames, "Александра");
    expect(checkGender).toBe("FEMALE");
  });

  it("Выявляем пол по отчеству пользователя", () => {
    const checkGender = userGender(suggestionsPatronymic, "Константинович");
    expect(checkGender).toBe("MALE");
  });

  it("Выявляем пол по отчеству пользователя", () => {
    const checkGender = userGender(suggestionsPatronymic, "Константиновна");
    expect(checkGender).toBe("FEMALE");
  });

  it("собирем подсказки в массив", () => {
    const emptyArr = [];
    const testResult = getSuggestions(suggestionsSurnames, emptyArr);
    expect(Array.isArray(testResult)).toBe(true);
  });

  it("собираем подсказки в массив при очищенном поле поиска", () => {
    const emptyArr = [];
    const fieldContent = "";
    const suggestions = getSuggestions(
      suggestionsSurnames,
      emptyArr,
      fieldContent
    );
    expect(suggestions.length === 0).toBe(true);
  });

  it("Собираем подсказки в массив при абортированном запросе", () => {
    const fieldContent = "test";
    const emptyArr = [];
    const fetchedSuggestions = null;
    const getSuggestionsData = getSuggestions(
      fetchedSuggestions,
      emptyArr,
      fieldContent
    );
    expect(getSuggestionsData === null).toBe(true);
  });

  it("Определить достаточно ли данных для определения гендера", () => {
    const isGenderDefine = isEnoughDataForGenderDefine("", "");
    expect(isGenderDefine).toBe(false);
  });
  it("Определить достаточно ли данных для определения гендера", () => {
    const isGenderDefine = isEnoughDataForGenderDefine("", "Петровна");
    expect(isGenderDefine).toBe(true);
  });

  it("Валидируем водимый текст в поля ФИО", () => {
    const fieldFIOValue = isFieldFIONotValid("ан", /^[а-яёАЁ-Я- ]*$/);
    expect(fieldFIOValue).toBe(false);
  });
  it("Валидируем водимый текст в поля ФИО", () => {
    const fieldFIOValue = isFieldFIONotValid("test", /^[а-яёАЁ-Я- ]*$/);
    expect(fieldFIOValue).toBe(true);
  });
  it("Валидируем водимый текст в поля ФИО", () => {
    const fieldFIOValue = isFieldFIONotValid("!!!1111 --", /^[а-яёАЁ-Я- ]*$/);
    expect(fieldFIOValue).toBe(true);
  });

  it("Очищаем массив и добавляем новый класс", () => {
    const arrayWithClasses = getArrayWithClass([], "is-invalid");
    expect(arrayWithClasses.length > 0).toBe(true);
  });
});
