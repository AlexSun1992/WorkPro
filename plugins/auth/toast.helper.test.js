import { errorDataMessage } from "./toast.helper.fixtures";
import {
  convertErrorMessageToArray,
  isORAexist,
  getErrorMessage,
  getCopy,
} from "./toast.helper";

describe("Модуль вывода сообщения об ошибке", () => {
  //   it("Получаем глубокую копию объекта с данными об ошибке", () => {
  //     const getCopyDataErrorMessage = getCopy(errorData);

  //     expect(getCopyDataErrorMessage).toBe("object");
  //   });

  it("Преобразуем данные об ошибке из строки в массив", () => {
    const errorMessageConvertToArray =
      convertErrorMessageToArray(errorDataMessage);
    console.log("errorMessageConvertToArray:", errorMessageConvertToArray);
    expect(Array.isArray(errorMessageConvertToArray)).toBe(true);
  });

  it("Определяем наличие ORA в массиве", () => {
    const err = convertErrorMessageToArray(errorDataMessage);
    const test = isORAexist(err);
    console.log("test:", test);
    expect(test).not.toBe(undefined);
  });

  it("Получаем сообщение об ошибке", () => {
    const err = convertErrorMessageToArray(errorDataMessage);
    const isRes = isORAexist(err);
    const resultErr = getErrorMessage(isRes);
    console.log("resultErr:", resultErr);
    expect(typeof resultErr).toBe("string");
  });
});
