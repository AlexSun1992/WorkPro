import { getRangeValue } from "../ControlRange/ControlRange.helper";

/**
 * Оставляем только уникальные значения в объекте
 * @param {array} rangeValues массив значений, отображаемых на шкале
 * @returns
 */
export function getOnlyUniqueIntervals(rangeValues) {
  const getArrayOfValues = getRangeValue(rangeValues);
  const getArrayFromObject = Object.values(getArrayOfValues);
  const getArrayUniqueValues = Array.from(new Set(getArrayFromObject));
  const getObjectFromArr = { ...getArrayUniqueValues };
  return getObjectFromArr;
}

/**
 * Функция возвращает длину объекта с уникальными интервалами шкалы
 * @param {array} rangeValues массив значений, отображаемых на шкале
 * @returns
 */
export function getLengthOfObject(rangeValues) {
  const intervals = getOnlyUniqueIntervals(rangeValues);
  return Object.keys(intervals).length;
}

/**
 * Функция соединяет два массив и массив массивов в объект
 * @param {array} firstArr Массив содержит ключи для создаваемого объекта
 * @param {*} secondArr Массив содержит значения для создаваемого объекта
 * @returns
 */
export function addOneItemToKeyNumber(firstArr, secondArr) {
  const newObject = {};
  for (let i = 0; i < firstArr.length; i += 1) {
    newObject[firstArr[i]] = secondArr[i];
  }
  return newObject;
}

/**
 * Функция возвращает объект с промежутками (ключи начинаются с единицы)
 * @param {Object} объект со значениями промежутков (ключи начинаются с 0)
 * @returns
 */
export function objectKeysBeginFromOne(obj) {
  const getKeys = Object.keys(obj);
  const getValues = Object.values(obj);
  const rebuildKeys = getKeys.map((item) => Number(item) + 1);
  const rebuildValues = getValues.map((item) => item.split("-"));
  const getRebuildKeysObjectOfIntervals = addOneItemToKeyNumber(rebuildKeys, rebuildValues);
  return getRebuildKeysObjectOfIntervals;
}

/**
 * Функция создает массив с виртуальными отметками, используя заданный интервал
 * @param {Number} pointsAmount Количество отметок на ползунке
 * @param {Number} step значение интервала между отметками
 * @returns
 */
export function createArrayOfVirtualPoints(pointsAmount, step) {
  return Array(pointsAmount + 1)
    .fill(() => null)
    .map((_, idx) => idx * step);
}

/**
 * Функция получает значение для Input при перемещении ползунка
 * @param {Array} rangeValues массив со значениями на шкале позунка
 * @param {Number} target Длинна шкалы ползунка в пикселях
 * @param {Number} val Значение, получаемое при перемещении ползунка
 * @returns
 */
export function computedValue(rangeValues, target, val) {
  const intervalsOfInputRange = getOnlyUniqueIntervals(rangeValues);
  const IntervalsAmount = getLengthOfObject(rangeValues);
  const eachIntervalValueEqual = target / IntervalsAmount;
  const getObjectKeysStartFromOne = objectKeysBeginFromOne(intervalsOfInputRange);
  const newObjKeys = Object.keys(getObjectKeysStartFromOne);
  const currentInterval = newObjKeys.find((elem) => elem * eachIntervalValueEqual >= val);
  const getCurrentInterval = getObjectKeysStartFromOne[currentInterval];

  const getDifferenceBetweenMaxMin = Math.max(...getCurrentInterval) - Math.min(...getCurrentInterval);
  const getMultiplyCoeff = getDifferenceBetweenMaxMin / eachIntervalValueEqual;
  const getIndexMinus = Object.keys(intervalsOfInputRange).find((elem) => Number(elem) === currentInterval - 1);
  const getMinValue = Math.min(...getCurrentInterval);
  const revealValue = (val - getIndexMinus * eachIntervalValueEqual) * getMultiplyCoeff + getMinValue;
  return revealValue;
}

/**
 * Функция возвращает индекс промежутка, который содержит введенное значение
 * @param {*} rangeValues Значения, отображаемые на шкале позунка
 * @param {*} insertValue Введенное значение в input
 * @returns
 */
export function getIntervalContainsValue(rangeValues, insertValue) {
  const getObjectWithUniqueProperties = getOnlyUniqueIntervals(rangeValues);
  const getArray = Object.values(getObjectWithUniqueProperties);

  const getIntervals = getArray.map((item) => item.split("-"));

  const getCurrentInterval = getIntervals.find(
    (item) => Number(item[0]) <= insertValue && Number(item[1]) >= insertValue
  );
  const getIntervalString = getCurrentInterval.join("-");

  const getEntries = Object.entries(getObjectWithUniqueProperties);

  const getNumber = getEntries.find((elem) => elem.find((item) => item === getIntervalString));
  const getIntervalNumber = Number(getNumber[0]);
  return getIntervalNumber;
}

/**
 * Функция заполняет значения input по клику на цифре шкалы ползунка
 * @param {array} rangeValues массив содержащий значения шкалы ползунка
 * @param {number} revealValue выбранное значение шкалы
 * @returns
 */
export function moveToCurrentComputedValueTypeNumber(rangeValues, revealValue) {
  const intervals = getOnlyUniqueIntervals(rangeValues);
  const currentIntrevalNumber = getIntervalContainsValue(rangeValues, revealValue);
  const getCurrentIntervalRange = intervals[currentIntrevalNumber];
  const getArrayOFirstLastValueFromIntervalRange = getCurrentIntervalRange.split("-");

  const getCurrentValue = getArrayOFirstLastValueFromIntervalRange.find((item) => Number(item) === revealValue);
  return Number(getCurrentValue);
}

/**
 * Функция возвращает значение для ползунка по клику на значение шкалы
 * @param {*} rangeValues массив содержащий значения шкалы ползунка
 * @param {*} htmlEl Длина HTML элемента в пикселях
 * @param {*} revealValue выбранное значение шкалы
 * @returns
 */
export function moveRangeToComputedValueNumber(rangeValues, htmlEl, revealValue) {
  const intervals = getOnlyUniqueIntervals(rangeValues);

  const elementsLength = getLengthOfObject(rangeValues);

  const equalInterval = htmlEl / elementsLength;

  const getOnlyValues = Object.values(intervals);
  const getArraysFromStringsInterval = getOnlyValues.map((item) => item.split("-"));
  const getSpreadArray = getArraysFromStringsInterval.flat(Infinity);
  const uniqueItems = new Set(getSpreadArray);
  const getOnlyValuesFromInterval = Array.from(uniqueItems);
  const getIndex = getOnlyValuesFromInterval.indexOf(`${revealValue}`);
  const rangeValue = getIndex * equalInterval;
  return rangeValue;
}
/**
 * Функция возвращает значение для ползунка, при введении значения в input
 * @param {*} rangeValues массив содержащий значения шкалы ползунка
 * @param {*} val ВВеденное значение в input
 * @param {*} htmlElWidth Длина HTML элемента в пикселях
 * @returns
 */
export function inputValue(rangeValues, val, htmlElWidth) {
  const intervals = getOnlyUniqueIntervals(rangeValues);
  const intervalsAmount = getLengthOfObject(rangeValues);
  const equalInterval = htmlElWidth / intervalsAmount;
  const getKeysFromIntervalsObject = Object.keys(intervals);
  const getValuesFromIntervalObject = Object.values(intervals);
  const turnStringsToNumberObjectKeys = getKeysFromIntervalsObject.map((item) => Number(item));
  const turnValuesFromStringsToArray = getValuesFromIntervalObject.map((item) => item.split("-"));

  const getDifferenseBetweenIntervals = turnValuesFromStringsToArray.map(
    ([firstItem, secondItem]) => Number(secondItem) - Number(firstItem)
  );

  const getCoefficients = getDifferenseBetweenIntervals.map((item) => Math.round(item / equalInterval));
  const objectOfMinMaxvalue = {};
  for (let i = 0; i < turnStringsToNumberObjectKeys.length; i += 1) {
    objectOfMinMaxvalue[turnStringsToNumberObjectKeys[i]] = turnValuesFromStringsToArray[i].map((item) => Number(item));
  }

  const getIntervalContainValue = Object.keys(objectOfMinMaxvalue).find(
    (item) => Math.min(...objectOfMinMaxvalue[item]) <= val && val <= Math.max(...objectOfMinMaxvalue[item])
  );

  if (getIntervalContainValue !== undefined) {
    const getCurrentEl = objectOfMinMaxvalue[getIntervalContainValue];
    const getDifference = val - Math.min(...getCurrentEl);
    const valuePosition =
      equalInterval * getIntervalContainValue + getDifference / getCoefficients[getIntervalContainValue];
    return valuePosition;
  }

  if (getIntervalContainValue === undefined) {
    if (Math.min(...rangeValues) > val) {
      return 0;
    }
    if (Math.max(...rangeValues) < val) {
      return htmlElWidth;
    }
  }
  return null;
}
