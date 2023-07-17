import {
  getArrayDiffValueWithoutNegativeNumbers,
  getMinValueFromArray,
  getAmountOfClosestValues,
  getMinValueIndex,
  getClosestValue,
} from "./ControlRange.helper";

describe("Получение ближайшего значения из массива к введенному значению", () => {
  it("Получаем массив со значениями разниц между вводимым значением и имеющимися значениями", () => {
    const arrayOfValues = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const insertValue = 1700000;
    const newArrayOfValues = getArrayDiffValueWithoutNegativeNumbers(
      arrayOfValues,
      insertValue
    );

    const isNegativeNumberInValues = Boolean(
      newArrayOfValues.find((item) => item < 0)
    );

    expect(isNegativeNumberInValues).toBe(false);
  });

  it("Получаем миимальное значение из массива", () => {
    const arrayOfValues = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const insertValue = 1700000;

    const newArrayOfValues = getArrayDiffValueWithoutNegativeNumbers(
      arrayOfValues,
      insertValue
    );

    const minValue = getMinValueFromArray(arrayOfValues, insertValue);

    const isValueLessThanMinValue = newArrayOfValues.find(
      (item) => item < minValue
    );

    expect(Boolean(isValueLessThanMinValue)).toBe(false);
  });

  it("Получаем количесвтво ближайших значений(Должны получить одно значение)", () => {
    const arrayOfValues = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const insertValue = 1700000;

    const getAmountOfClosestValue = getAmountOfClosestValues(
      arrayOfValues,
      insertValue
    );

    expect(getAmountOfClosestValue.length).toBe(1);
  });
  it("Получаем количесвтво ближайших значений(Должны получить два значения)", () => {
    const arrayOfValues = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const insertValue = 1650000;
    const newArrayOfValues = getArrayDiffValueWithoutNegativeNumbers(
      arrayOfValues,
      insertValue
    );

    const minValue = getMinValueFromArray(arrayOfValues, insertValue);

    const getAmountOfClosestValue = newArrayOfValues.filter(
      (item) => item === minValue
    );

    expect(getAmountOfClosestValue.length).toBe(2);
  });

  it("Получаем индекс юлижайшего значения(минимальное)", () => {
    const arrayOfValues = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const insertValue = 1650000;
    const getIndexOfMinValue = getMinValueIndex(arrayOfValues, insertValue);

    expect(getIndexOfMinValue).toBe(0);
  });
  it("Получаем индекс юлижайшего значения(максимальное)", () => {
    const arrayOfValues = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const insertValue = 1700000;
    const getIndexOfMinValue = getMinValueIndex(arrayOfValues, insertValue);

    expect(getIndexOfMinValue).toBe(1);
  });

  it("Получаем ближайшее значение ко введенному", () => {
    const arrayOfValues = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const insertValue = 1700000;
    const getNearestValue = getClosestValue(arrayOfValues, insertValue);
    expect(getNearestValue).toBe(1800000);
  });
});
