// Функция возвращает объект разностей между вводимым значением и массивом из справочника
export function getArrayDiffValueWithoutNegativeNumbers(arrOfValues, insertValue) {
  const differenceBetweenValuesInsertValue = arrOfValues.map((item) => item - insertValue);
  const arrayWithoutNegativeNumbers = differenceBetweenValuesInsertValue.map((item) => Math.abs(item));
  return arrayWithoutNegativeNumbers;
}

// Возвращаеи минимальную разницу между вводимым числом и значениеми из массива
export function getMinValueFromArray(arrOfValues, insertValue) {
  const arrayOfValues = getArrayDiffValueWithoutNegativeNumbers(arrOfValues, insertValue);
  const getMinValue = Math.min(...arrayOfValues);
  return getMinValue;
}

// На случай если есть два одинковые разности ( 1500000 <- 16500000 -> 1800000 )
export function getAmountOfClosestValues(arrOfValues, insertValue) {
  const differenceBetweenValuesInsertValue = getArrayDiffValueWithoutNegativeNumbers(arrOfValues, insertValue);

  const minValue = getMinValueFromArray(arrOfValues, insertValue);

  const amountOfValues = differenceBetweenValuesInsertValue.filter((item) => item === minValue);
  return amountOfValues;
}

// Получаем индекс числа от которого была минимальная разница
export function getMinValueIndex(arrOfValues, insertValue) {
  const differenceBetweenValuesInsertValue = getArrayDiffValueWithoutNegativeNumbers(arrOfValues, insertValue);
  const getMinValue = getMinValueFromArray(arrOfValues, insertValue);
  return differenceBetweenValuesInsertValue.indexOf(getMinValue);
}

// Возвращаем минимальное ближайшее число и массива (округление происходит в большую сторону)
export function getClosestValue(arrOfValues, insertValue) {
  const amountOfValues = getAmountOfClosestValues(arrOfValues, insertValue);

  if (amountOfValues.length === 2) {
    const getMaxValue = arrOfValues[getMinValueIndex(arrOfValues, insertValue) + 1];
    return getMaxValue;
  }

  const getIndexOfClosestValue = getMinValueIndex(arrOfValues, insertValue);

  return arrOfValues[getIndexOfClosestValue];
}
//
/**
 * Из массива значений получаем объект с промежутками между значениями
 * @param {array} rangeValues массив значений, отображаемых на ползунке
 * @returns
 */
export function getRangeValue(rangeValues) {
  const objOfIntervals = rangeValues.reduce((object, value, index) => {
    return {
      ...object,
      [index]: `${
        rangeValues[index + 1] === undefined
          ? `${rangeValues[index - 1]}-${value}`
          : `${value}-${rangeValues[index + 1]}`
      }`,
    };
  }, {});
  return objOfIntervals;
}
//
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
