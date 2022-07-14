export function getResponseEntries(response) {
  const responseEntries = Object.entries(response);
  return responseEntries;
}

export function getArrayContainMessage(response) {
  const responseEntries = getResponseEntries(response);
  const getArraysOfArrays = responseEntries.find((item) =>
    item.includes("data")
  );
  return getArraysOfArrays;
}

export function getRestructuredArrayContainMessage(response) {
  const arrOfArray = getArrayContainMessage(response);
  const getOnlyObj = arrOfArray.filter((item) => typeof item === "object");
  return getOnlyObj;
}

export function getArrayWithObjectContainMessage(response) {
  const getObjects = getRestructuredArrayContainMessage(response);
  const getObjectsConcatenated = [].concat(...getObjects);
  return getObjectsConcatenated;
}

export function getObjWithTextMessage(response) {
  const concatObj = getArrayWithObjectContainMessage(response);
  const getObjWithMessage = concatObj.find((item) =>
    item.hasOwnProperty("MESSAGE")
  );
  return getObjWithMessage;
}

export function getMessageFromSuccessResponse(response) {
  const getObjWithMessage = getObjWithTextMessage(response);
  const message = getObjWithMessage?.MESSAGE;
  return message;
}
