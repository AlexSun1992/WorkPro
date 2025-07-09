import {
  getCopyOfServerFilterBlockData,
  convertingServerFilterBlockData,
  rebuildArrayOfServerFilterBlockData,
  getUniqueArraysOfServerFilters,
  uniqueServerFilters,
  interSectionBetweenDropListServerFilters,
  elementDateWasChoosenByUser,
} from "./ServerFilterBlock.helper";
import { serverFilters, selectOptionItems, serverFilterUsers, list } from "./ServerFilterBlock.helper.fixtures";

describe("Модуль определения данных, необходимых для кэширования", () => {
  ///  dataBlocks тесты со значениями серверных фильтров из store геттер serverFilters (моковые данные)
  it("копия массива объектов серверных фильтров", () => {
    const SERVER_FILTER_ARRAY = [...serverFilters];
    const getCopy = getCopyOfServerFilterBlockData(SERVER_FILTER_ARRAY);
    expect(typeof getCopy === "object").toBe(true);
  });

  it("проверяем длину полученной копии", () => {
    const SERVER_FILTER_ARRAY = [...serverFilters];
    const getDeepCopy = getCopyOfServerFilterBlockData(SERVER_FILTER_ARRAY);
    expect(getDeepCopy.length > 0).toBe(true);
  });

  it("преобразование значений серверных фильтров в массив массивов", () => {
    const SERVER_FILTER_ARRAY = [...serverFilters];
    const arrayOServerFilterBlockData = convertingServerFilterBlockData(SERVER_FILTER_ARRAY);
    expect(typeof arrayOServerFilterBlockData === "object").toBe(true);
  });

  it("упрощаем структуру данных серверных фильтров, избавляемся от вложения массивов", () => {
    const SERVER_FILTER_ARRAY = [...serverFilters];
    const optimizedServerFilterBlockData = rebuildArrayOfServerFilterBlockData(SERVER_FILTER_ARRAY);
    expect(typeof optimizedServerFilterBlockData === "object").toBe(true);
  });

  it("сравниваем длинну массива серверных фильтров после конкатенации вложенных массивов с исходной длинной массива", () => {
    const SERVER_FILTER_ARRAY = [...serverFilters];
    const arrayOfFiltersChoosenByUser = convertingServerFilterBlockData(SERVER_FILTER_ARRAY);
    const organizedFilterStructure = rebuildArrayOfServerFilterBlockData(SERVER_FILTER_ARRAY);

    expect(organizedFilterStructure.length > arrayOfFiltersChoosenByUser.length).toBe(true);
  });

  it("массив уникальных массивов значений серверных фильтров", () => {
    const SERVER_FILTER_ARRAY = [...serverFilters];
    const filteredServerFilters = getUniqueArraysOfServerFilters(SERVER_FILTER_ARRAY);
    expect(typeof filteredServerFilters === "object").toBe(true);
  });

  it("сравнение длинны массива уникальных значений серверных фильтров с исходным массивом", () => {
    const SERVER_FILTER_ARRAY = [...serverFilters];
    const reducedArray = rebuildArrayOfServerFilterBlockData(SERVER_FILTER_ARRAY);
    const filteredArray = getUniqueArraysOfServerFilters(SERVER_FILTER_ARRAY);
    expect(reducedArray.length > filteredArray.length).toBe(true);
  });

  it("получение отфильтрованного масcива уникальных значений Серверных фильтров", () => {
    const SERVER_FILTER_ARRAY = [...serverFilters];
    const serverFiltersUnique = uniqueServerFilters(SERVER_FILTER_ARRAY);
    expect(typeof serverFiltersUnique === "object").toBe(true);
  });

  // Тесты со значениями из списка застрахованных;
  //  Тесты со значениями из property dictionary (моковые данные);

  it("копия массива объектов выпадающего списка компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...selectOptionItems];
    const dropListCopy = getCopyOfServerFilterBlockData(DICTIONARY_ARRAY);
    expect(typeof dropListCopy === "object").toBe(true);
  });

  it("преобразование массива объектов выпадающего списка компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...selectOptionItems];
    const dropListArray = convertingServerFilterBlockData(DICTIONARY_ARRAY);
    expect(typeof dropListArray === "object").toBe(true);
  });

  it("получение массива с объединенными внутренними объектами выпадающего списка компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...selectOptionItems];
    const rebuildedDropListStructured = rebuildArrayOfServerFilterBlockData(DICTIONARY_ARRAY);
    expect(typeof rebuildedDropListStructured === "object").toBe(true);
  });

  it("получение уникальных массивов dropList ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...selectOptionItems];
    const getUniqueArraysDataDropList = getUniqueArraysOfServerFilters(DICTIONARY_ARRAY);
    expect(typeof getUniqueArraysDataDropList === "object").toBe(true);
  });

  it("получение массива неуникальных значений выпадающего списка компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...selectOptionItems];
    const uniqueElements = uniqueServerFilters(DICTIONARY_ARRAY);
    expect(typeof uniqueElements === "object").toBe(true);
  });

  // Тесты со значениями из списка застрахованных

  it("копия массива объектов списка пользователей компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...list];
    const dropListCopy = getCopyOfServerFilterBlockData(DICTIONARY_ARRAY);
    expect(typeof dropListCopy === "object").toBe(true);
  });

  it("преобразование массива объектов списка пользователей компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...list];
    const dropListArray = convertingServerFilterBlockData(DICTIONARY_ARRAY);
    expect(typeof dropListArray === "object").toBe(true);
  });

  it("получение массива с объединенными внутренними объектами списка пользователей компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...list];
    const rebuildedDropListStructured = rebuildArrayOfServerFilterBlockData(DICTIONARY_ARRAY);
    expect(typeof rebuildedDropListStructured === "object").toBe(true);
  });

  it("получение уникальных массивов списка пользователей ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...list];
    const getUniqueArraysDataDropList = getUniqueArraysOfServerFilters(DICTIONARY_ARRAY);
    expect(typeof getUniqueArraysDataDropList === "object").toBe(true);
  });

  it("получение массива неуникальных значений списка пользователей компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...list];
    const uniqueElements = uniqueServerFilters(DICTIONARY_ARRAY);
    expect(typeof uniqueElements === "object").toBe(true);
  });

  // Значения списка serverFilters
  it("копия массива объектов списка пользователей компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...serverFilterUsers];
    const dropListCopy = getCopyOfServerFilterBlockData(DICTIONARY_ARRAY);
    expect(typeof dropListCopy === "object").toBe(true);
  });

  it("преобразование массива объектов списка пользователей компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...serverFilterUsers];
    const dropListArray = convertingServerFilterBlockData(DICTIONARY_ARRAY);
    expect(typeof dropListArray === "object").toBe(true);
  });

  it("получение массива с объединенными внутренними объектами списка пользователей компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...serverFilterUsers];
    const rebuildedDropListStructured = rebuildArrayOfServerFilterBlockData(DICTIONARY_ARRAY);
    expect(typeof rebuildedDropListStructured === "object").toBe(true);
  });

  it("получение уникальных массивов списка пользователей ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...serverFilterUsers];
    const getUniqueArraysDataDropList = getUniqueArraysOfServerFilters(DICTIONARY_ARRAY);
    expect(typeof getUniqueArraysDataDropList === "object").toBe(true);
  });

  it("получение массива неуникальных значений списка пользователей компонента ServerFilterBlock", () => {
    const DICTIONARY_ARRAY = [...serverFilterUsers];
    const uniqueElements = uniqueServerFilters(DICTIONARY_ARRAY);
    expect(typeof uniqueElements === "object").toBe(true);
  });
  //

  // Пересекающийся элемент массивов (этот элемент выбрал пользователь)

  it("получение пересекающегося элемента массивов, (тип данных массив)", () => {
    const DICTIONARY_ARRAY = [...selectOptionItems];
    const SERVER_FILTER_ARRAY = [...serverFilters];
    const elementShouldBeCashedArray = interSectionBetweenDropListServerFilters(DICTIONARY_ARRAY, SERVER_FILTER_ARRAY);
    expect(typeof elementShouldBeCashedArray === "object").toBe(true);
  });

  it("получение пересекающегося элемента между пользователями и фильтрами , (тип данных массив)", () => {
    const DICTIONARY_ARRAY = [...list];
    const SERVER_FILTER_ARRAY = [...serverFilterUsers];

    const elementShouldBeCashedArray = interSectionBetweenDropListServerFilters(DICTIONARY_ARRAY, SERVER_FILTER_ARRAY);

    expect(typeof elementShouldBeCashedArray === "object").toBe(true);
  });

  it("Проверка массива на количество элементов", () => {
    const DICTIONARY_ARRAY = [...selectOptionItems];
    const SERVER_FILTER_ARRAY = [...serverFilters];
    const interSection = interSectionBetweenDropListServerFilters(DICTIONARY_ARRAY, SERVER_FILTER_ARRAY);

    expect(interSection).toHaveLength(1);
  });

  it("Возвращаем выбранного пользователя", () => {
    const listUsers = [...list];
    const serverFiltersUsers = [...serverFilterUsers];

    const propertyshouldBeFind = elementDateWasChoosenByUser(listUsers, serverFiltersUsers);

    expect(typeof propertyshouldBeFind === "object").toBe(true);
  });

  it("корректно выбирает фильтр из списка", () => {
    const datashouldBeCashed = elementDateWasChoosenByUser(selectOptionItems, serverFilters);
    expect(datashouldBeCashed).toMatchInlineSnapshot(`
      Object {
        "text": "За пол года: 29.12.2021",
        "value": "2021-12-29",
      }
    `);
  });

  it("проверка объекта на наличие необходимого свойства", () => {
    const DICTIONARY_ARRAY = [...selectOptionItems];
    const SERVER_FILTER_ARRAY = [...serverFilters];
    const propertyshouldBeFind = elementDateWasChoosenByUser(DICTIONARY_ARRAY, SERVER_FILTER_ARRAY);
    expect(propertyshouldBeFind).toHaveProperty("text");
  });

  it("проверка на отсутствие выбранного элемента", () => {
    const DICTIONARY_ARRAY = [];
    const SERVER_FILTER_ARRAY = [];
    const propertyshouldBeFind = elementDateWasChoosenByUser(DICTIONARY_ARRAY, SERVER_FILTER_ARRAY);
    expect(propertyshouldBeFind).toBe(undefined);
  });

  // =======
  it("корректно выбирает фильтр из списка", () => {
    const propertyshouldBeFind = elementDateWasChoosenByUser(selectOptionItems, serverFilters);

    expect(propertyshouldBeFind).toHaveProperty("text");
    expect(propertyshouldBeFind.text).toBe("За пол года: 29.12.2021");
  });

  it("sum func", () => {
    /**
     *
     * @param {Number} a
     * @param {Number} b
     * @returns Number
     */
    function sum(a, b) {
      if (typeof a !== "number") {
        throw new Error(`a not number`);
      }
      return a + b;
    }
    expect(() => sum("1", 3)).toThrowError("not number");
    expect(sum(1, 3)).toBe(4);
  });
});
