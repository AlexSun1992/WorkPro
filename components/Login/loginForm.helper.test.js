import {
  isPhoneNumberLengthLarger,
  removeSuitableSymbols,
  transformValueToArray,
  getFirstSymbol,
  bringToUniverseType,
  isPhoneNumberValid,
  removeNotNumberElements,
  getRestructuredPhoneNumber,
} from "./loginForm.helper";
import {
  invalidPhoneNumbers,
  pastedInputValue,
  pastedValuePlusSeven,
  pastetValueLargerLength,
  pastedValueBeginWithNine,
  pastedValueBeginWithPlus,
} from "./loginForm.helper.fixtures";

describe("Модуль тестирования телефонных номеров", () => {
  it("Убираем символы (+-.'')", () => {
    const purePhone = removeSuitableSymbols(pastedValuePlusSeven);
    expect(purePhone === "79051111111").toBe(true);
  });

  it("Убираем символы (+-.'')", () => {
    const purePhone = removeSuitableSymbols(pastedInputValue);
    expect(purePhone === "89114551111").toBe(true);
  });

  it("Убираем символы (+-.'')", () => {
    const purePhone = removeSuitableSymbols(pastetValueLargerLength);
    expect(purePhone === "3750291111111").toBe(true);
  });

  it("Убираем символы (+-.'')", () => {
    const purePhone = removeSuitableSymbols(pastedValueBeginWithNine);
    expect(purePhone === "9271111111").toBe(true);
  });

  it("Убираем символы (+-.'')", () => {
    const purePhone = removeSuitableSymbols(pastedValueBeginWithPlus);
    expect(purePhone === "79051111111").toBe(true);
  });

  it("Проверяем длину очищенного вставленного значения", () => {
    const purePhoneLength = isPhoneNumberLengthLarger(pastedValuePlusSeven);
    expect(purePhoneLength).toBe(false);
  });

  it("Проверяем длину очищенного вставленного значения", () => {
    const purePhoneLength = isPhoneNumberLengthLarger(pastedInputValue);
    expect(purePhoneLength).toBe(false);
  });

  it("Проверяем длину очищенного вставленного значения", () => {
    const purePhoneLength = isPhoneNumberLengthLarger(pastetValueLargerLength);
    expect(purePhoneLength).toBe(true);
  });

  it("Проверяем длину очищенного вставленного значения", () => {
    const purePhoneLength = isPhoneNumberLengthLarger(pastedValueBeginWithNine);
    expect(purePhoneLength).toBe(false);
  });

  it("Проверяем длину очищенного вставленного значения", () => {
    const purePhoneLength = isPhoneNumberLengthLarger(pastedValueBeginWithPlus);
    expect(purePhoneLength).toBe(false);
  });

  it("Трансформируем вставленное значение в массив", () => {
    const getArrayFromInput = transformValueToArray(pastedValuePlusSeven);
    expect(Array.isArray(getArrayFromInput)).toBe(true);
  });

  it("Трансформируем вставленное значение в массив", () => {
    const getArrayFromInput = transformValueToArray(pastedInputValue);
    expect(Array.isArray(getArrayFromInput)).toBe(true);
  });

  it("Трансформируем вставленное значение в массив", () => {
    const getArrayFromInput = transformValueToArray(pastedValueBeginWithNine);
    expect(Array.isArray(getArrayFromInput)).toBe(true);
  });

  it("Получаем первый символ из массива", () => {
    const getFirstSign = getFirstSymbol(pastedValuePlusSeven);
    expect(getFirstSign === "7").toBe(true);
  });

  it("Получаем первый символ из массива", () => {
    const getFirstSign = getFirstSymbol(pastedInputValue);
    expect(getFirstSign === "8").toBe(true);
  });

  it("Получаем первый символ из массива", () => {
    const getFirstSign = getFirstSymbol(pastedValueBeginWithNine);
    expect(getFirstSign === "9").toBe(true);
  });

  it("Преобразуем номер телефона к типовому виду", () => {
    const tipicalPhoneNumber = bringToUniverseType(pastedValuePlusSeven);
    expect(tipicalPhoneNumber === "+79051111111").toBe(true);
  });

  it("Преобразуем номер телефона к типовому виду", () => {
    const tipicalPhoneNumber = bringToUniverseType(pastedInputValue);
    expect(tipicalPhoneNumber === "+79114551111").toBe(true);
  });

  it("Преобразуем номер телефона к типовому виду", () => {
    const tipicalPhoneNumber = bringToUniverseType(pastedValueBeginWithNine);

    expect(tipicalPhoneNumber === "+79271111111").toBe(true);
  });

  it("Преобразуем номер телефона к типовому виду", () => {
    const tipicalPhoneNumber = bringToUniverseType(pastedValueBeginWithPlus);
    expect(tipicalPhoneNumber === "+79051111111").toBe(true);
  });

  it("Оставляем толкьо цифры", () => {
    const result = removeNotNumberElements(pastedInputValue);
    expect(result === "89114551111").toBe(true);
  });

  test.each(invalidPhoneNumbers)("check phone '%s'", (phoneNumber, isRigth) => {
    const isRightNumberType = isPhoneNumberValid(phoneNumber);
    expect(isRightNumberType).toBe(isRigth);
  });

  it("Проверка единичной записи", () => {
    const isValidPhone = getRestructuredPhoneNumber(pastetValueLargerLength);
    expect(isValidPhone).toBe(false);
  });
});
