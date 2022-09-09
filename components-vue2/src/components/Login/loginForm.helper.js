///

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
///
// /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

export function removeNotNumberElements(phoneNumber) {
  const getOnlyNumbers = phoneNumber.replace(/\D/g, "");
  return getOnlyNumbers;
}

export function isValid(phoneNumber) {
  const testPhone =
    /^(\+7|7|8)?[\s\-]?\(?[9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  const isValidPhoneNumber = testPhone.test(phoneNumber);

  return isValidPhoneNumber;
}

///
export function isMobilePhoneValid(inputPastedValue) {
  const testPhoneRegex =
    /^(\+7|7|8)?[\s\-]?\(?[9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

  const getOnlyNumbers = removeNotNumberElements(inputPastedValue);
  const isValidPhoneNumber = testPhoneRegex.test(getOnlyNumbers);

  if (isValidPhoneNumber) {
    const universeType = bringToUniverseType(getOnlyNumbers);
    return universeType;
  }

  return isValidPhoneNumber;
}
