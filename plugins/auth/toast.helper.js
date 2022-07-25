/**
 * Разбивает строку в массив по "\n"
 * @param {string} errorMessage Строка с ошибкой, содержащая ORA и квадратные скобки
 * @returns {string[]}
 */
export function convertErrorMessageToArray(errorMessage) {
  const getArrayFromErrorTextMessageString = errorMessage.split("\n");
  return getArrayFromErrorTextMessageString;
}

/**
 * @param {Array} arrayFromErrorMessage Массив, полученный из сообщения об ошибке
 * @returns {(string|undefined)} @type {string} при наличии ORA в массиве, @type {undefined} при отсутсвии ORA в массиве
 */
export function isORAexist(errorMessage) {
  const getStringWithORA = errorMessage.find((item) => item.includes("ORA"));
  return getStringWithORA;
}

/**
 * @param {string} errorMessage Строка с ошибкой, содержащая ORA и квадратные скобки
 * @returns {string } При наличии ORA в "errorMessage" :cтрока, содержащая только сообщение об ошибке(без квадратных скобок и пробелов по краям)
 * При отсутствии ORA: возвращается null
 */
export function getErrorMessage(errorMessage) {
  const arrayFromErrorMessage = convertErrorMessageToArray(errorMessage);
  const errorMessageWithORA = isORAexist(arrayFromErrorMessage);

  if (errorMessageWithORA) {
    const errorWithORAandSymbols = errorMessageWithORA.replace(
      /[^а-яё:,\s]/gi,
      ""
    );

    const pureError = errorWithORAandSymbols.slice(1);

    const again = pureError.trim();

    return again;
  }
  return errorMessage;
}
