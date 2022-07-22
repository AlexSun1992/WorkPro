import {
  errorDataMessage,
  errorDataMessageWithoutORA,
} from "./toast.helper.fixtures";
import {
  convertErrorMessageToArray,
  isORAexist,
  getErrorMessage,
} from "./toast.helper";

describe("Модуль вывода сообщения об ошибке", () => {
  it("Преобразуем данные об ошибке из строки в массив", () => {
    const errorMessageConvertToArray =
      convertErrorMessageToArray(errorDataMessage);
    expect(Array.isArray(errorMessageConvertToArray)).toBe(true);
  });

  it("Определяем наличие ORA в массиве", () => {
    const arrayFromErrorMessage = convertErrorMessageToArray(errorDataMessage);
    const errorMessageWithORA = isORAexist(arrayFromErrorMessage);
    expect(errorMessageWithORA).not.toBe(undefined);
  });

  it("Получаем сообщение об ошибке", () => {
    const errorMessageWithoutORA = getErrorMessage(errorDataMessage);
    expect(typeof errorMessageWithoutORA).toBe("string");
  });
  ///
  it("Преобразуем данные об ошибке из строки в массив", () => {
    const errorMessageConvertToArray = convertErrorMessageToArray(
      errorDataMessageWithoutORA
    );
    expect(Array.isArray(errorMessageConvertToArray)).toBe(true);
  });

  it("Определяем наличие ORA в массиве", () => {
    const arrayFromErrorMessage = convertErrorMessageToArray(
      errorDataMessageWithoutORA
    );
    const errorMessageWithORA = isORAexist(arrayFromErrorMessage);
    expect(errorMessageWithORA).not.toBe(undefined);
  });

  it("Получаем сообщение об ошибке", () => {
    const errorMessageWithoutORA = getErrorMessage(errorDataMessageWithoutORA);
    expect(typeof errorMessageWithoutORA).toBe("string");
  });
});
