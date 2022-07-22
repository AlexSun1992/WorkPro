export function convertErrorMessageToArray(errorMessage) {
  const getArrayFromErrorTextMessageString = errorMessage.split("\n");
  return getArrayFromErrorTextMessageString;
}

export function isORAexist(errorMessage) {
  const getStringWithORA = errorMessage.find((item) => item.includes("ORA"));
  return getStringWithORA;
}

export function getErrorMessage(errorMessage) {
  const arrayFromErrorMessage = convertErrorMessageToArray(errorMessage);
  const errorMessageWithORA = isORAexist(arrayFromErrorMessage);
  const errorMessageWithoutORA = errorMessageWithORA?.split(":")[1];
  return errorMessageWithoutORA;
}
