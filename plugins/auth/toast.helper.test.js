import { errorData } from "./toast.helper.fixtures";
import { checkIfORAExist, getCopy } from "./toast.helper";

describe("Модуль вывода сообщения об ошибке", () => {
  it("Получаем глубокую копию объекта с данными об ошибке", () => {
    const getCopyDataErrorMessage = getCopy(errorData);
    expect(getCopyDataErrorMessage).toBe("object");
  });

  //   it("Преобразуем данные об ошибке из строки в массив", () => {
  //   });
});
