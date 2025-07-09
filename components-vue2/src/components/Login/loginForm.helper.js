export function removeSuitableSymbols(pastedValue) {
  const purePhoneNumber = pastedValue.replace(/[\(\)+-.\s]/g, "");
  return purePhoneNumber;
}

export function isPhoneNumberLengthLarger(pastedValue) {
  const purePhoneNumber = removeSuitableSymbols(pastedValue);
  if (purePhoneNumber.length > 11) {
    return true;
  }
  return false;
}

export function transformValueToArray(pastedValue) {
  const purePhoneNumber = pastedValue.replace(/[\(\)+-.\s]/g, "");
  const arrayFromInputValue = purePhoneNumber.split("");
  return arrayFromInputValue;
}

export function getFirstSymbol(pastedValue) {
  const getArray = transformValueToArray(pastedValue);
  const [firstSymbol] = getArray;
  return firstSymbol;
}

export function bringToUniverseType(pastedValue) {
  const firstSymbol = getFirstSymbol(pastedValue);
  const pureNunber = pastedValue.replace(/[\(\)+-.\s]/g, "");
  let universeTypeForm;

  const plus = "+";
  const plusSeven = "+7";

  if (firstSymbol === "7") {
    universeTypeForm = plus.concat("", pureNunber);
    return universeTypeForm;
  }

  if (firstSymbol === "8") {
    universeTypeForm = pureNunber.replace("8", "+7");
    return universeTypeForm;
  }

  if (firstSymbol !== "7" && firstSymbol !== "8") {
    universeTypeForm = plusSeven.concat("", pureNunber);
    return universeTypeForm;
  }
  return pureNunber;
}

export function removeNotNumberElements(phoneNumber) {
  const getOnlyNumbers = phoneNumber.replace(/\D/g, "");
  return getOnlyNumbers;
}

export function isPhoneNumberValid(phoneNumber) {
  const onlyNumbersInPhoneNumber = removeNotNumberElements(phoneNumber);
  const testPhone = /^(\+7|7|8)?[\s\-]?\(?[9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  const isValidPhoneNumber = testPhone.test(onlyNumbersInPhoneNumber);
  return isValidPhoneNumber;
}

export function getRestructuredPhoneNumber(inputPastedValue) {
  const getOnlyNumbers = removeNotNumberElements(inputPastedValue);
  const isPastedNumber = isPhoneNumberValid(inputPastedValue);
  if (isPastedNumber) {
    const universeType = bringToUniverseType(getOnlyNumbers);
    return universeType;
  }

  return isPastedNumber;
}
