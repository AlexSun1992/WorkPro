import {
  getCopyFiltersFromServerFilters,
  getArrayOfArrays,
  concatArrays,
  filterInnerArrays,
  uniqueElementsOfArray,
  interSectionElement,
  elementShoudBeChoosen,
} from "./ServerFilterBlock.helper";
import { dataBlocks, dictionary } from "./ServerFilterBlock.helper.fixtures";

describe("Модуль подготовки данных", () => {
  ///////// dataBlocks

  it("копия массива объектов", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const result = getCopyFiltersFromServerFilters(SERVER_FILTER_ARRAY);
    expect(typeof result === "object").toBe(true);
  });

  it("преобразование массива объектов", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const arrayOfObjects = getArrayOfArrays(SERVER_FILTER_ARRAY);
    expect(Array.isArray(arrayOfObjects));
  });

  it("получение массива с объединенными внутренними объетами", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const reducedArray = concatArrays(SERVER_FILTER_ARRAY);
    expect(Array.isArray(reducedArray));
  });

  it("получение отфильтрованного масива", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const filteredArray = filterInnerArrays(SERVER_FILTER_ARRAY, "filter");
    expect(Array.isArray(filteredArray));
  });

  it("получение отфильтрованного масива", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const uniqueElements = uniqueElementsOfArray(SERVER_FILTER_ARRAY, "filter");
    // console.log("Filter uniqueElements:", uniqueElements);
    expect(Array.isArray(uniqueElements));
  });

  /////////// dictionary

  it("копия массива объектов", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const result = getCopyFiltersFromServerFilters(DICTIONARY_ARRAY);
    expect(typeof result === "object").toBe(true);
  });

  it("преобразование массива объектов", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const arrayOfObjects = getArrayOfArrays(DICTIONARY_ARRAY);
    expect(Array.isArray(arrayOfObjects));
  });

  it("получение массива с объединенными внутренними объетами", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const reducedArray = concatArrays(DICTIONARY_ARRAY);
    expect(Array.isArray(reducedArray));
  });

  it("получение отфильтрованного масива", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const filteredArray = filterInnerArrays(DICTIONARY_ARRAY, "value");
    expect(Array.isArray(filteredArray));
  });

  it("получение отфильтрованного масива", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const uniqueElements = uniqueElementsOfArray(DICTIONARY_ARRAY, "value");
    // console.log("Value uniqueElements:", uniqueElements);
    expect(Array.isArray(uniqueElements));
  });

  ////// пересекающийся элемент массивов

  it("получение пересекающегося элемента", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const interSection = interSectionElement(
      DICTIONARY_ARRAY,
      SERVER_FILTER_ARRAY,
      "value",
      "filter"
    );
    console.log("interSection:", ...interSection);
    expect(typeof interSection === "object").toBe(true);
  });

  it("получение пересекающегося элемента !!!!!", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const element = elementShoudBeChoosen(
      DICTIONARY_ARRAY,
      SERVER_FILTER_ARRAY,
      "value",
      "filter"
    );
    // console.log("element:", ...element);
    expect(typeof element === "object").toBe(true);
  });
});
