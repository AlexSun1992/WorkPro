const MAX_ORA_ERROR = "ORA-10000";
export const SYSTEM_ERROR_TEXT =
  "Приносим извинения, в Личном Кабинете что-то пошло не так.\nПросим обновить страницу или перейти на Главную Личного кабинета.";

/**
 * Разбивает строку в массив по регулярному выражению, содержащему ORA-\d{5}
 * @param {string} errorMessage Строка с ошибкой, содержащая ORA и квадратные скобки, или не содержащая таковых.
 * @returns {string[]} Отфильтрованный массив без пустых строк
 */
export function convertErrorMessageToArray(errorMessage) {
  const getArrayFromMess = errorMessage.split(/\s?ORA-\d{5}: /g);
  const arrWithoutEmptyString = getArrayFromMess.filter(
    (item) =>
      item !== "" && !item.includes("сбой распределенной операции обновления")
  );
  return arrWithoutEmptyString;
}

/**
 * При наличии ORA в "errorMessage" возвращает текст после ORA, при отсутствии ORA дефолтный текст
 * @param {string} errorMessage Строка с ошибкой, содержащая ORA и квадратные скобки, или не содержащая таковых.
 * @returns {string}
 */

export function getErrorMessage(errorMessage) {
  const [errMessageString] = convertErrorMessageToArray(errorMessage);

  const stringWithBrackets = errMessageString.match(/\[(.+)]/);

  const getORAnumber = errorMessage.match(/\s?ORA-\d{5}/);

  if (getORAnumber) {
    const getORAtext = errorMessage.match(/\s?ORA-\d{5}/)[0];
    if (MAX_ORA_ERROR > getORAtext) {
      const getLinkToMainPage = SYSTEM_ERROR_TEXT.match(
        /Главную Личного кабинета./
      );

      const removeLinkFromErrMsgText = SYSTEM_ERROR_TEXT.replace(
        /Главную Личного кабинета./,
        ""
      );

      const errorTextAndLink = {};
      errorTextAndLink.errorText = removeLinkFromErrMsgText;
      errorTextAndLink.errorLink = getLinkToMainPage[0];

      return errorTextAndLink;
    }
  }

  if (stringWithBrackets) {
    const getErrorTextWithBrackets = stringWithBrackets[0];

    const transformErrorTextToArray =
      getErrorTextWithBrackets.match(/\[.+?\]/g);

    const getStringFromErrorText = transformErrorTextToArray.join("");
    // проверяем нужно использовать ленивый квантификатор
    if (getErrorTextWithBrackets === getStringFromErrorText) {
      const getStringMessageWithErrBrackets = stringWithBrackets[0];
      const getArrWithErrBrackets =
        getStringMessageWithErrBrackets.match(/\[.+?\]/);
      const pureMessageText = getArrWithErrBrackets[0].match(/\[(.+)]/);

      return pureMessageText[1];
    }

    return stringWithBrackets[1];
  }

  return errMessageString;
}
