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
  const isAxiosResponse = response.hasOwnProperty("data");
  if (isAxiosResponse) {
    const getObjWithMessage = getObjWithTextMessage(response);
    const message = getObjWithMessage?.MESSAGE;
    return message;
  }

  throw new Error("Невозможно обработать axiosResponse");
}

export function getMessageFromMessageCode(errorCode) {
  if (errorCode === 201) {
    return "В Личном кабинете уже есть профиль с данным номером телефона";
  }
  if (errorCode === 202) {
    return "В Личном кабинете уже есть профиль с данным номером телефона";
  }
  if (errorCode === 203) {
    return "В Личном кабинете отсутствует профиль с данным номером телефона";
  }
  if (errorCode === 204) {
    return "В Личном кабинете уже есть профиль с данным номером телефона";
  }

  return "";
}

export function isAlertShouldBeShown(modeType, loginType, errCode) {
  if (errCode === 203 && modeType === "RECOVERY" && loginType === "phone") {
    return true;
  }
  if (errCode === 105 && modeType === "REG" && loginType === "phone") {
    return true;
  }
  return false;
}
