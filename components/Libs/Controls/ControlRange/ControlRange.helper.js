export function getArrayDiffValueWithoutNegativeNumbers(
  arrOfValues,
  insertValue
) {
  const differenceBetweenValuesInsertValue = arrOfValues.map(
    (item) => item - insertValue
  );
  const arrayWithoutNegativeNumbers = differenceBetweenValuesInsertValue.map(
    (item) => Math.abs(item)
  );
  return arrayWithoutNegativeNumbers;
}

export function getMinValueFromArray(arrOfValues, insertValue) {
  const arrayOfValues = getArrayDiffValueWithoutNegativeNumbers(
    arrOfValues,
    insertValue
  );
  const getMinValue = Math.min(...arrayOfValues);
  return getMinValue;
}

export function getAmountOfClosestValues(arrOfValues, insertValue) {
  const differenceBetweenValuesInsertValue =
    getArrayDiffValueWithoutNegativeNumbers(arrOfValues, insertValue);

  const minValue = getMinValueFromArray(arrOfValues, insertValue);

  const amountOfValues = differenceBetweenValuesInsertValue.filter(
    (item) => item === minValue
  );
  return amountOfValues;
}

export function getMinValueIndex(arrOfValues, insertValue) {
  const differenceBetweenValuesInsertValue =
    getArrayDiffValueWithoutNegativeNumbers(arrOfValues, insertValue);
  const getMinValue = getMinValueFromArray(arrOfValues, insertValue);

  return differenceBetweenValuesInsertValue.indexOf(getMinValue);
}

export function getClosestValue(arrOfValues, insertValue) {
  const amountOfValues = getAmountOfClosestValues(arrOfValues, insertValue);

  if (amountOfValues.length === 2) {
    const getMaxValue =
      arrOfValues[getMinValueIndex(arrOfValues, insertValue) + 1];
    return getMaxValue;
  }

  const getIndexOfClosestValue = getMinValueIndex(arrOfValues, insertValue);

  return arrOfValues[getIndexOfClosestValue];
}
