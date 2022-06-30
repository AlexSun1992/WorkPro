import {
  getCopyOfServerFilterBlockData,
  convertingServerFilterBlockData,
  rebuildArrayOfServerFilterBlockData,
  getUniqueArraysOfServerFilters,
  uniqueServerFilters,
  interSectionBetweenDropListServerFilters,
  elementDateWasChoosenByUser,
} from "./ServerFilterBlock.helper";
import { dataBlocks, dictionary } from "./ServerFilterBlock.helper.fixtures";

describe("Модуль определения данных, необходимых для кэширования", () => {
  ///  dataBlocks тесты со значениями серверных фильтров из store геттер serverFilters (моковые данные)

  it("копия массива объектов серверных фильтров", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const getCopy = getCopyOfServerFilterBlockData(SERVER_FILTER_ARRAY);
    expect(typeof getCopy === "object").toBe(true);
  });

  it("проверяем длину полученной копии", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const getDeepCopy = getCopyOfServerFilterBlockData(SERVER_FILTER_ARRAY);
    expect(getDeepCopy.length > 0).toBe(true);
  });

  it("преобразование значений серверных фильтров в массив массивов", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const arrayOServerFilterBlockData =
      convertingServerFilterBlockData(SERVER_FILTER_ARRAY);
    expect(typeof arrayOServerFilterBlockData === "object").toBe(true);
  });

  it("упрощаем структуру данных серверных фильтров, избавляемся от вложения массивов", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const optimizedServerFilterBlockData =
      rebuildArrayOfServerFilterBlockData(SERVER_FILTER_ARRAY);
    expect(typeof optimizedServerFilterBlockData === "object").toBe(true);
  });

  it("сравниваем длинну массива серверных фильтров после конкатенации вложенных массивов с исходной длинной массива", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const arrayOfFiltersChoosenByUser =
      convertingServerFilterBlockData(SERVER_FILTER_ARRAY);
    const organizedFilterStructure =
      rebuildArrayOfServerFilterBlockData(SERVER_FILTER_ARRAY);
    console.log();
    expect(
      organizedFilterStructure.length > arrayOfFiltersChoosenByUser.length
    ).toBe(true);
  });

  it("массив уникальных массивов значений серверных фильтров", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const filteredServerFilters = getUniqueArraysOfServerFilters(
      SERVER_FILTER_ARRAY,
      "filter"
    );
    expect(typeof filteredServerFilters === "object").toBe(true);
  });

  it("сравнение длинны массива уникальных значений серверных фильтров с исходным массивом", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const reducedArray =
      rebuildArrayOfServerFilterBlockData(SERVER_FILTER_ARRAY);
    const filteredArray = getUniqueArraysOfServerFilters(
      SERVER_FILTER_ARRAY,
      "filter"
    );
    expect(reducedArray.length > filteredArray.length).toBe(true);
  });

  it("получение отфильтрованного масcива уникальных значений Серверных фильтров", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const serverFilters = uniqueServerFilters(SERVER_FILTER_ARRAY, "filter");
    expect(typeof serverFilters === "object").toBe(true);
  });

  it("проверка полученного массива ServerFiletrBlock на наличие элемента", () => {
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const uniqueElements = uniqueServerFilters(SERVER_FILTER_ARRAY, "filter");
    expect(uniqueElements).toContain("filter");
  });

  //  Тесты со значениями из property dictionary (моковые данные)

  it("копия массива объектов выпадающего списка компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const dropListCopy = getCopyOfServerFilterBlockData(DICTIONARY_ARRAY);
    expect(typeof dropListCopy === "object").toBe(true);
  });

  it("преобразование массива объектов выпадающего списка компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const dropListArray = convertingServerFilterBlockData(DICTIONARY_ARRAY);
    expect(typeof dropListArray === "object").toBe(true);
  });

  it("получение массива с объединенными внутренними объектами выпадающего списка компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const rebuildedDropListStructured =
      rebuildArrayOfServerFilterBlockData(DICTIONARY_ARRAY);
    expect(typeof rebuildedDropListStructured === "object").toBe(true);
  });

  it("получение уникальных массивов dropList ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const getUniqueArraysDataDropList = getUniqueArraysOfServerFilters(
      DICTIONARY_ARRAY,
      "value"
    );
    expect(typeof getUniqueArraysDataDropList === "object").toBe(true);
  });

  it("получение массива неуникальных значений выпадающего списка компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const uniqueElements = uniqueServerFilters(DICTIONARY_ARRAY, "value");
    expect(typeof uniqueElements === "object").toBe(true);
  });

  it("проверка массива на наличие элемента", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const uniqueElements = uniqueServerFilters(DICTIONARY_ARRAY, "value");
    expect(uniqueElements).toContain("value");
  });

  // ////// пересекающийся элемент массивов (этот элемент выбрал пользователь)

  it("получение пересекающегося элемента массивов, (тип данных массив)", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const elementShouldBeCashedArray = interSectionBetweenDropListServerFilters(
      DICTIONARY_ARRAY,
      SERVER_FILTER_ARRAY,
      "value",
      "filter"
    );
    expect(typeof elementShouldBeCashedArray === "object").toBe(true);
  });

  it("Проверка массива на количество элементов", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const interSection = interSectionBetweenDropListServerFilters(
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
    const datashouldBeCashed = elementDateWasChoosenByUser(
      DICTIONARY_ARRAY,
      SERVER_FILTER_ARRAY,
      "value",
      "filter"
    );
    expect(typeof datashouldBeCashed === "object").toBe(true);
  });

  it("проверка объекта на наличие необходимого свойства", () => {
    const DICTIONARY_ARRAY = [...dictionary];
    const SERVER_FILTER_ARRAY = [...dataBlocks];
    const propertyshouldBeFind = elementDateWasChoosenByUser(
      DICTIONARY_ARRAY,
      SERVER_FILTER_ARRAY,
      "value",
      "filter"
    );
    expect(propertyshouldBeFind).toHaveProperty("text");
  });
});
