import {
  computedValue,
  getOnlyUniqueIntervals,
  getLengthOfObject,
  addOneItemToKeyNumber,
  createArrayOfVirtualPoints,
  moveToCurrentComputedValueTypeNumber,
  inputValue,
  objectKeysBeginFromOne,
  moveRangeToComputedValueNumber,
} from "./ControlRangeInput.helper";
import { getRangeValue } from "../ControlRange/ControlRange.helper";

describe("Неравномерные интервалы для ползунка", () => {
  it("Получаем объект со значениями интервалов", () => {
    const pointsOfRange = [0, 500000, 1000000, 1500000];

    const objectIntervals = {
      0: "0-500000",
      1: "500000-1000000",
      2: "1000000-1500000",
      3: "1000000-1500000",
    };

    const test = getRangeValue(pointsOfRange);

    expect(test).toStrictEqual(objectIntervals);
  });

  it("Превращаем массив в объект", () => {
    const pointsOfRange = [0, 500000, 1000000, 1500000];

    const objectUniqueIntervals = {
      0: "0-500000",
      1: "500000-1000000",
      2: "1000000-1500000",
    };
    const getUniqueValues = getOnlyUniqueIntervals(pointsOfRange);
    expect(getUniqueValues).toEqual(objectUniqueIntervals);
  });

  it("Получаем длину объекта", () => {
    const arrayOfValues = [
      0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000,
    ];
    const amountOfObjectProperties = getLengthOfObject(arrayOfValues);

    expect(amountOfObjectProperties).toBe(6);
  });

  it("Получаем массив из строки", () => {
    const result = ["1000000", "1500000"];
    const currentInterval = "1000000-1500000";
    const arr = currentInterval.split("-");
    expect(arr).toStrictEqual(result);
  });

  it("пересобираем объект(свойства начинаются с 1)", () => {
    const arrayWithPropertyNumbers = [1, 2, 3, 4, 5, 6];
    const arrayWithPropertyValues = [
      ["0", "500000"],
      ["500000", "1000000"],
      ["1000000", "1500000"],
      ["1500000", "2000000"],
      ["2000000", "2500000"],
      ["2500000", "3000000"],
    ];
    const newObject = {
      1: ["0", "500000"],
      2: ["500000", "1000000"],
      3: ["1000000", "1500000"],
      4: ["1500000", "2000000"],
      5: ["2000000", "2500000"],
      6: ["2500000", "3000000"],
    };
    const objPropertyStartFromOne = addOneItemToKeyNumber(
      arrayWithPropertyNumbers,
      arrayWithPropertyValues
    );
    expect(objPropertyStartFromOne).toStrictEqual(newObject);
  });

  it("Перестраиваем ключи объекта, чтобы начинались с 1", () => {
    const objectKeyStartFromZero = {
      0: "0-500000",
      1: "500000-1000000",
      2: "1000000-1500000",
      3: "1500000-2000000",
      4: "2000000-2500000",
      5: "2500000-3000000",
    };
    const objectShouldBeGetted = {
      1: ["0", "500000"],
      2: ["500000", "1000000"],
      3: ["1000000", "1500000"],
      4: ["1500000", "2000000"],
      5: ["2000000", "2500000"],
      6: ["2500000", "3000000"],
    };
    const objectKeysStartFromOne = objectKeysBeginFromOne(
      objectKeyStartFromZero
    );
    expect(objectKeysStartFromOne).toStrictEqual(objectShouldBeGetted);
  });

  it("создаем массив с виртуальными значениями(используем STEP)", () => {
    const newVirtualValues = createArrayOfVirtualPoints(6, 500000);

    expect(newVirtualValues).toStrictEqual([
      0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000,
    ]);
  });

  it("Кликаем по цифре на шкале", () => {
    const realValuesOfRange = [
      0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000,
    ];
    const choosenValue = 1000000;
    const result = moveToCurrentComputedValueTypeNumber(
      realValuesOfRange,
      choosenValue
    );
    expect(result).toBe(1000000);
  });

  it("Получаем значения, двигая ползунок", () => {
    const virtualValues = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const rangePointMax = 660;
    const currentValuePoint = 11;

    const realValue = computedValue(
      virtualValues,
      rangePointMax,
      currentValuePoint
    );
    expect(realValue).toBe(1525000);
  });

  it("Получаем значения, двигая ползунок (0 значение)", () => {
    const virtualValues = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const rangePointMax = 660;
    const currentValuePoint = 0;

    const realValue = computedValue(
      virtualValues,
      rangePointMax,
      currentValuePoint
    );
    expect(realValue).toBe(1500000);
  });

  it("Получаем значения, двигая ползунок (максимальное значение)", () => {
    const virtualValues = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const rangePointMax = 660;
    const currentValuePoint = 660;
    const realValue = computedValue(
      virtualValues,
      rangePointMax,
      currentValuePoint
    );
    expect(realValue).toBe(4100000);
  });

  it("Получаем значения, двигая ползунок (среднее значение)", () => {
    const virtualValues = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const rangePointMax = 660;
    const currentValuePoint = 336;
    const realValue = computedValue(
      virtualValues,
      rangePointMax,
      currentValuePoint
    );
    expect(Math.round(realValue)).toBe(2272727);
  });

  it("Вводим значение в input, получаем значение ползунка", () => {
    const realValuesOfRange = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const insertValue = 2000000;
    const htmlElClientWidth = 840;
    const result = inputValue(
      realValuesOfRange,
      insertValue,
      htmlElClientWidth
    );
    expect(Math.round(result)).toBe(336);
  });

  it("Вводим значение в input, получаем значение ползунка(максимальное значение)", () => {
    const realValuesOfRange = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const insertValue = 4100000;
    const htmlElClientWidth = 840;
    const result = inputValue(
      realValuesOfRange,
      insertValue,
      htmlElClientWidth
    );
    expect(Math.round(result)).toBe(840);
  });

  // Тестируем ключевые функции
  it("Вводим значение в input, получаем значение ползунка(второе значение)", () => {
    const realValuesOfRange = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const insertValue = 1800000;
    const htmlElClientWidth = 840;
    const result = inputValue(
      realValuesOfRange,
      insertValue,
      htmlElClientWidth
    );
    expect(Math.round(result)).toBe(168);
  });

  it("Вводим значение в input, получаем значение ползунка(минимальное значение)", () => {
    const realValuesOfRange = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const insertValue = 1500000;
    const htmlElClientWidth = 840;
    const result = inputValue(
      realValuesOfRange,
      insertValue,
      htmlElClientWidth
    );
    expect(Math.round(result)).toBe(0);
  });

  it("Вводим значение в input, получаем значение ползунка(третье значение)", () => {
    const realValuesOfRange = [
      1500000, 1800000, 2000000, 2500000, 3000000, 4100000,
    ];
    const insertValue = 2500000;
    const htmlElClientWidth = 840;
    const result = inputValue(
      realValuesOfRange,
      insertValue,
      htmlElClientWidth
    );
    expect(Math.round(result)).toBe(504);
  });
  it("Положение ползунка при клике по цифре на шкале позунка", () => {
    const pointOfRange = [
      0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000,
    ];
    const htmlWidth = 840;
    const choosenValue = 500000;
    const sliderPosition = moveRangeToComputedValueNumber(
      pointOfRange,
      htmlWidth,
      choosenValue
    );
    expect(sliderPosition).toBe(140);
  });
});
