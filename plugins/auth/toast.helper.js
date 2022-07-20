export function getCopy(errorMessage) {
  //   const copyErrorMessage = JSON.parse(JSON.stringify(errorMessage));
  return errorMessage;
}

export function convertErrorMessageToArray(errorMessage) {
  const result = errorMessage.split("\n");
  return result;
}

export function isORAexist(errorMessage) {
  const result = errorMessage.find((item) => item.includes("ORA"));
  return result;
}

export function getErrorMessage(errorMessage) {
  const result = errorMessage.split(":")[1];
  return result;
}
