/**
 * Разбивает строку в массив по регулярному выражению, содержащему ORA-\d{5}
 * @param {string} errorMessage Строка с ошибкой, содержащая ORA и квадратные скобки, или не содержащая таковых.
 * @returns {string[]} Отфильтрованный массив без пустых строк
 */
export function convertErrorMessageToArray(errorMessage) {
  const getArrayFromMess = errorMessage.split(/\s?ORA-\d{5}: /g);
  const arrWithoutEmptyString = getArrayFromMess.filter((item) => item !== "");
  return arrWithoutEmptyString;
}

/**
 * @param {string} errorMessage Строка с ошибкой, содержащая ORA и квадратные скобки, или не содержащая таковых.
 * @returns {string } При наличии ORA в "errorMessage" возвращает текст после ORA, при отсутствии ORA дефолтный текст
 */
export function getErrorMessage(errorMessage) {
  const arrayFromErrorMessage = convertErrorMessageToArray(errorMessage);
  return arrayFromErrorMessage[0].replace(/[^a-zа-яё:,-\s]/gi, "");
}
