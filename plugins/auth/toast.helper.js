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
    const errorMessageWithoutORA = errorMessageWithORA.split(":")[1];
    const errorMessageWithoutExtraSymbols = errorMessageWithoutORA.replace(
      /[^a-zа-яё0-9\s]/gi,
      " "
    );
    const errorMessageWithoutORAtrimed = errorMessageWithoutExtraSymbols.trim();
    return errorMessageWithoutORAtrimed;
  }
  return errorMessage;
}
