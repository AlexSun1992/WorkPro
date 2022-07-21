import { errorDataMessage } from "./toast.helper.fixtures";
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
    const err = convertErrorMessageToArray(errorDataMessage);
    const test = isORAexist(err);
    expect(test).not.toBe(undefined);
  });

  it("Получаем сообщение об ошибке", () => {
    const resultErr = getErrorMessage(errorDataMessage);
    console.log("resultErr:", resultErr);
    expect(typeof resultErr).toBe("string");
  });
});
