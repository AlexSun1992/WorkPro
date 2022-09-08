export function checkPastedValue(data) {
  const getFiltered = data.filter((item) => item.find((elem) => elem === true));
  return getFiltered;
}

export function arrayWithoutBoolean(data) {
  const checkedValue = checkPastedValue(data);
  const concatArray = [].concat(...checkedValue);
  return concatArray;
}

export function getfilteredArrayStringsOnly(data) {
  const noBooleanArray = arrayWithoutBoolean(data);
  const getFilteredArray = noBooleanArray.filter(
    (item) => typeof item === "string"
  );
  return getFilteredArray;
}

export function removeSuitableSigns(data) {
  const onlyStringsArray = getfilteredArrayStringsOnly(data);
  const arrOfPhoneNumbersWithoutSuitableSigns = onlyStringsArray.map((item) => {
    return item.replace(/[\(\)+-.\s]/g, "");
  });
  return arrOfPhoneNumbersWithoutSuitableSigns;
}

export function isForbiddenSignsInPhoneNumberExist(data) {
  const phonesWithOutSigns = removeSuitableSigns(data);
  const pattern = /\D/;
  const filteredArray = phonesWithOutSigns.filter((item) => {
    return !pattern.test(item);
  });
  return filteredArray;
}

// export function compareArr(firstArr, secondArr) {
//   if (firstArr.length === secondArr.length) {
//     return true;
//   }
//   return false;
// }

export function rebuildStringToArr(data) {
  const forbiddenSigns = isForbiddenSignsInPhoneNumberExist(data);
  const arrOfArray = forbiddenSigns.map((item) => item.split(""));
  return arrOfArray;
}

export function arrayStartWithEigth(data) {
  const phoneAsArray = rebuildStringToArr(data);
  const groupOfArray = phoneAsArray.filter((item) => item[0] === "8");
  return groupOfArray;
}

export function arrayStartWithSeven(data) {
  const phoneAsArray = rebuildStringToArr(data);
  const groupOfArray = phoneAsArray.filter((item) => item[0] === "7");
  return groupOfArray;
}

export function arrayStartWithRandomNumber(data) {
  const phoneAsArray = rebuildStringToArr(data);
  const groupOfArray = phoneAsArray.filter(
    (item) => item[0] !== "7" && item[0] !== "8"
  );
  return groupOfArray;
}
//
export function addPlus(data) {
  const arrSevenTh = arrayStartWithSeven(data);
  const result = arrSevenTh.map((item) => {
    return item.join("");
  });

  const test = result.map((item) => {
    return "+" + item;
  });

  return test;
}

export function addSevenPlus(data) {
  const arrRandomSign = arrayStartWithRandomNumber(data);
  const result = arrRandomSign.map((item) => {
    return item.join("");
  });

  const test = result.map((item) => {
    return "+7" + item;
  });

  return test;
}

export function addSevenPlusToNumberStartingWithEigth(data) {
  const test = arrayStartWithEigth(data);
  const result = test.map((item) => {
    return item.join("");
  });

  const arrPhone = result.map((item) => {
    return item.replace("8", "+7");
  });

  return arrPhone;
}
///
export function addAllNumbersToArr(data) {
  const addSevenPlusToEigth = addSevenPlusToNumberStartingWithEigth(data);
  const addSevenAndPlus = addSevenPlus(data);
  const addPlusToSign = addPlus(data);

  const arrayOfPhoneNumber = [].concat(
    ...addSevenPlusToEigth,
    ...addSevenAndPlus,
    ...addPlusToSign
  );
  return arrayOfPhoneNumber;
}

export function isWrongNumber(data) {
  const combineObject = addAllNumbersToArr(data);
  // const pattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
  const pattern = /(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)/;
  const wrongNumber = combineObject.find((item) => {
    return !pattern.test(item);
  });

  if (typeof wrongNumber === "string") {
    return false;
  }
  return true;
}

// export function test(data) {
//   // "+7903111вЂ“11вЂ“11";
//   const testus = data.find((item) => item === "+7903111вЂ“11вЂ“11");
//   return testus;
// }
