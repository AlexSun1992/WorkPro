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
  ///////// dataBlocks значения серверных фильтров из store

  it("копия массива объектов", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const result = getCopyArrayOfObjects(SERVER_FILTER_ARRAY);
    expect(typeof result === "object").toBe(true);
  });

  it("преобразование массива объектов в массив массивов", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const arrayOfObjects =
      convertingArrayOfObjectsToArrayOfArrays(SERVER_FILTER_ARRAY);
    expect(Array.isArray(arrayOfObjects));
  });

  it("получение массива с объединенными внутренними массивами(упрощаем структуру, избавляемся от лишних массивов)", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const reducedArray = makingArrayOfConcatArrays(SERVER_FILTER_ARRAY);
    expect(Array.isArray(reducedArray));
  });

  it("получение отфильтрованного массива,(массив уникальных массивов)", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const filteredArray = filterInnerArrays(SERVER_FILTER_ARRAY, "filter");
    expect(Array.isArray(filteredArray));
  });

  it("получение отфильтрованного масcива уникальных значений", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const uniqueElements = createArrayOfUniqueElements(
      SERVER_FILTER_ARRAY,
      "filter"
    );

    expect(Array.isArray(uniqueElements));
  });

  /////////// dictionary значения из property dictionary

  it("копия массива объектов", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const result = getCopyArrayOfObjects(DICTIONARY_ARRAY);
    expect(typeof result === "object").toBe(true);
  });

  it("преобразование массива объектов", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const arrayOfObjects =
      convertingArrayOfObjectsToArrayOfArrays(DICTIONARY_ARRAY);
    expect(Array.isArray(arrayOfObjects));
  });

  it("получение массива с объединенными внутренними объетами", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const reducedArray = makingArrayOfConcatArrays(DICTIONARY_ARRAY);
    expect(Array.isArray(reducedArray));
  });

  it("получение отфильтрованного масива", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const filteredArray = filterInnerArrays(DICTIONARY_ARRAY, "value");
    expect(Array.isArray(filteredArray));
  });

  it("получение отфильтрованного масива", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const uniqueElements = createArrayOfUniqueElements(
      DICTIONARY_ARRAY,
      "value"
    );
    // console.log("Value uniqueElements:", uniqueElements);
    expect(Array.isArray(uniqueElements));
  });

  ////// пересекающийся элемент массивов

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
});
