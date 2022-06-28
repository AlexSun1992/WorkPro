import {
  getCopyArrayOfObjects,
  convertingArrayOfObjectsToArrayOfArrays,
  makingArrayOfConcatArrays,
  filterInnerArrays,
  createArrayOfUniqueElements,
  interSectionElementArray,
  elementDateWasChoosenByUser,
} from "./ServerFilterBlock.helper";
import { dataBlocks, dictionary } from "./ServerFilterBlock.helper.fixtures";

describe("Модуль подготовки данных", () => {
  /////////  dataBlocks тесты со значениями серверных фильтров из store геттер serverFilters (моковые данные)

  it("копия массива объектов", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const getCopy = getCopyArrayOfObjects(SERVER_FILTER_ARRAY);
    expect(typeof getCopy === "object").toBe(true);
  });

  it("проверяем длину полученной копии", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const getCopy = getCopyArrayOfObjects(SERVER_FILTER_ARRAY);
    expect(getCopy.length > 0).toBe(true);
  });

  it("преобразование массива объектов в массив массивов", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const arrayOfObjects =
      convertingArrayOfObjectsToArrayOfArrays(SERVER_FILTER_ARRAY);
    expect(typeof arrayOfObjects === "object").toBe(true);
  });

  it("получение массива с объединенными внутренними массивами(упрощаем структуру, вложения массивов)", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const reducedArray = makingArrayOfConcatArrays(SERVER_FILTER_ARRAY);
    expect(typeof reducedArray === "object").toBe(true);
  });

  it("сравниваем длинну массива после конкатенации вложенных массивов с исходной длинной массива", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const arrayOfObjects =
      convertingArrayOfObjectsToArrayOfArrays(SERVER_FILTER_ARRAY);
    const reducedArray = makingArrayOfConcatArrays(SERVER_FILTER_ARRAY);
    expect(reducedArray.length > arrayOfObjects.length).toBe(true);
  });

  it("получение отфильтрованного массива,(массив уникальных массивов)", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const filteredArray = filterInnerArrays(SERVER_FILTER_ARRAY, "filter");
    expect(typeof filteredArray === "object").toBe(true);
  });

  it("сравнение длинны массива уникальных значений с исходным массивом", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const reducedArray = makingArrayOfConcatArrays(SERVER_FILTER_ARRAY);
    const filteredArray = filterInnerArrays(SERVER_FILTER_ARRAY, "filter");
    expect(reducedArray.length > filteredArray.length).toBe(true);
  });

  it("получение отфильтрованного масcива уникальных значений", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const uniqueElements = createArrayOfUniqueElements(
      SERVER_FILTER_ARRAY,
      "filter"
    );
    expect(typeof uniqueElements === "object").toBe(true);
  });

  it("проверка полученного массива на наличие элемента", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const uniqueElements = createArrayOfUniqueElements(
      SERVER_FILTER_ARRAY,
      "filter"
    );
    expect(uniqueElements).toContain("filter");
  });

  /////////// Тесты со значениями из property dictionary (моковые данные)

  it("копия массива объектов", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const result = getCopyArrayOfObjects(DICTIONARY_ARRAY);
    expect(typeof result === "object").toBe(true);
  });

  it("преобразование массива объектов", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const arrayOfObjects =
      convertingArrayOfObjectsToArrayOfArrays(DICTIONARY_ARRAY);
    expect(typeof arrayOfObjects === "object").toBe(true);
  });

  it("получение массива с объединенными внутренними объетами", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const reducedArray = makingArrayOfConcatArrays(DICTIONARY_ARRAY);
    expect(typeof reducedArray === "object").toBe(true);
  });

  it("получение отфильтрованного масива", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const filteredArray = filterInnerArrays(DICTIONARY_ARRAY, "value");
    expect(typeof filteredArray === "object").toBe(true);
  });

  it("получение отфильтрованного масива", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const uniqueElements = createArrayOfUniqueElements(
      DICTIONARY_ARRAY,
      "value"
    );
    expect(typeof uniqueElements === "object").toBe(true);
  });

  it("проверка массива на наличие элемента", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const uniqueElements = createArrayOfUniqueElements(
      DICTIONARY_ARRAY,
      "value"
    );
    expect(uniqueElements).toContain("value");
  });

  ////// пересекающийся элемент массивов (этот элемент выбрал пользователь)

  it("получение пересекающегося элемента массивов, (тип данных массив)", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const interSection = interSectionElementArray(
      DICTIONARY_ARRAY,
      SERVER_FILTER_ARRAY,
      "value",
      "filter"
    );
    expect(typeof interSection === "object").toBe(true);
  });

  it("Проверка массива на количество элементов", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const interSection = interSectionElementArray(
      DICTIONARY_ARRAY,
      SERVER_FILTER_ARRAY,
      "value",
      "filter"
    );
    expect(interSection).toHaveLength(1);
  });

  it("получение пересекающегося элемента двух массивов, (тип данных объект)", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const element = elementDateWasChoosenByUser(
      DICTIONARY_ARRAY,
      SERVER_FILTER_ARRAY,
      "value",
      "filter"
    );
    expect(typeof element === "object").toBe(true);
  });

  it("проверка объекта на наличие необходимого свойства", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const element = elementDateWasChoosenByUser(
      DICTIONARY_ARRAY,
      SERVER_FILTER_ARRAY,
      "value",
      "filter"
    );
    expect(element).toHaveProperty("text");
  });
});
