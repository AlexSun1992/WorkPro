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

  const errMessageString = arrayFromErrorMessage[0];

  const regexp = /\[.+]/g;

  if (errMessageString.match(regexp)) {
    const textInsideBrackets = errMessageString.match(regexp)[0];

    const removeOpenBracket = textInsideBrackets.replace(/\[/, "");
    const removeCloseBracket = removeOpenBracket.replace(/\]$/, "");

    return removeCloseBracket;
  }

  const arrayFromErrorMessageWithOutExtremeBrackets = errMessageString.replace(
    /\[|]$/g,
    ""
  );
  return arrayFromErrorMessageWithOutExtremeBrackets;
}
