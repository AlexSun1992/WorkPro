import {
  checkPastedValue,
  arrayWithoutBoolean,
  getfilteredArrayStringsOnly,
  removeSuitableSigns,
  isForbiddenSignsInPhoneNumberExist,
  compareArr,
  phoneNumberSplit,
  deleteNotNumber,
  checkPhoneNumberLength,
  addToPhoneNumber,
  rebuildStringToArr,
  arrayStartWithEigth,
  arrayStartWithSeven,
  arrayStartWithRandomNumber,
  addPlusToPhoneNumber,
  test,
  addPlus,
  addSevenPlus,
  addSevenPlusToNumberStartingWithEigth,
  addAllNumbersToArr,
  isWrongNumber,
} from "./loginForm.helper";
import { invalidPhoneNumbers } from "./loginForm.helper.fixtures";

describe("Модуль тестирования телефонных номеров", () => {
  it("Фильтруем массив с массивами номеров", () => {
    const filteredArray = checkPastedValue(invalidPhoneNumbers);
    console.log("filteredArray:", filteredArray);
    expect(Array.isArray(filteredArray)).toBe(true);
  });

  it("Оставляем только строки в массивах", () => {
    const onlyStringsInArray = arrayWithoutBoolean(invalidPhoneNumbers);
    console.log("onlyStringsInArray:", onlyStringsInArray);
    expect(Array.isArray(onlyStringsInArray)).toBe(true);
  });

  it("Оставляем только строки в массиве", () => {
    const getFilteredArr = getfilteredArrayStringsOnly(invalidPhoneNumbers);
    console.log("getFilteredArr", getFilteredArr);
    expect(Array.isArray(getFilteredArr)).toBe(true);
  });

  it("Убираем символы, допустимые в номере телефона", () => {
    const suitableSymbolsRemoved = removeSuitableSigns(invalidPhoneNumbers);
    console.log("suitableSymbolsRemoved:", suitableSymbolsRemoved);
    expect(Array.isArray(suitableSymbolsRemoved)).toBe(true);
  });

  it("Проверяем номера телефона на наличие недопустимых нецифровых значений", () => {
    const isForbiddenSigns =
      isForbiddenSignsInPhoneNumberExist(invalidPhoneNumbers);
    console.log("isForbiddenSigns:", isForbiddenSigns);
    expect(Array.isArray(isForbiddenSigns)).toBe(true);
  });

  it("превращаем номер телефона в массив", () => {
    const rebuildToArr = rebuildStringToArr(invalidPhoneNumbers);
    console.log("rebuildToArr:", rebuildToArr);
    expect(Array.isArray(rebuildToArr)).toBe(true);
  });

  it("Собираем массив телефонов, начинающихся с 8", () => {
    const result = addSevenPlusToNumberStartingWithEigth(invalidPhoneNumbers);
    console.log("result:", result);
    expect(Array.isArray(result)).toBe(true);
  });

  it("Собираем массив телефонов, начинающихся с 7", () => {
    const addPlustoPhoneNumber = addPlus(invalidPhoneNumbers);
    console.log("addPlustoPhoneNumber:", addPlustoPhoneNumber);
    expect(Array.isArray(addPlustoPhoneNumber)).toBe(true);
  });

  it("Собираем массив телефонов, начинающихся не с 7 и не с 8", () => {
    const addSevenPlusToPhoneNumber = addSevenPlus(invalidPhoneNumbers);
    console.log("addSevenPlusToPhoneNumber:", addSevenPlusToPhoneNumber);
    expect(Array.isArray(addSevenPlusToPhoneNumber)).toBe(true);
  });

  it("Собираем массив телефонов после преобразования", () => {
    const getToOneArray = addAllNumbersToArr(invalidPhoneNumbers);
    console.log("getToOneArray:", getToOneArray);
    expect(Array.isArray(getToOneArray)).toBe(true);
  });

  it("Проверяем получившийся массив на наличие неправильного номера", () => {
    const isWrongItem = isWrongNumber(invalidPhoneNumbers);
    console.log("isWrongItem:", isWrongItem);
    expect(isWrongItem).toBe(true);
  });
});
