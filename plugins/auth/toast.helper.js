// import { h } from "vue";

const MAX_ORA_ERROR = "ORA-10000";

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
 * Получает номер ошибки вида ORA-00000 c максимальным значением (исключая обёртку в юзерскую)
 * @param {string} errorMessage Строка с ошибкой, содержащая ORA
 * @returns {string}
 */
export function getMaxErrorNumber(errorMessage) {
  /**
   * Фильтрация элементов массива поиска
   * @param {RegExpMatchArray} regExpItem
   * @param {number} currentItemIndex
   * @param {RegExpMatchArray[]} fullList
   * @returns
   */
  function filterLastSibling(regExpItem, currentItemIndex, fullList) {
    const currentItemPosition = regExpItem.index;
    const nextItemPosition = fullList[currentItemIndex + 1]?.index || 0;
    const isNextSiblingNear = currentItemPosition + 11 === nextItemPosition;
    if (isNextSiblingNear) {
      return false;
    }
    return true;
  }

  const ORA_PATTERN = /ORA-\d{5}/g;
  const oraPatterns = [...String(errorMessage).matchAll(ORA_PATTERN)]
    .filter(filterLastSibling)
    .map(([oraError]) => oraError)
    .sort((a, b) => (a < b ? -1 : 1));

  return oraPatterns.pop();
}

/**
 * Критичной является ошибка с ORA меньше константы
 */
export function isCriticalError(errorMessage) {
  const errorString = String(errorMessage);
  const maxErrorNumber = getMaxErrorNumber(errorString);
  if (maxErrorNumber < MAX_ORA_ERROR) {
    return true;
  }
  const isWAF = errorString.includes("Request Blocked");
  if (isWAF) {
    return true;
  }
  return false;
}

export function getErrorMessage(errorMessage, h) {
  if (isCriticalError(errorMessage)) {
    if (h) {
      const vnode = h("div", {
        domProps: {
          innerHTML:
            "<p>Приносим извинения, в личном кабинете что-то пошло не так.\n" +
            "Просим обновить страницу или перейти на <a href='/cabinet'>главную личного кабинета.</a></p>",
        },
      });
      return [vnode];
    }
    return "Приносим извинения, в Личном Кабинете что-то пошло не так.";
  }

  const [errMessageString] = convertErrorMessageToArray(errorMessage);
  const stringWithBrackets = errMessageString.match(/\[(.+)\]/s);

  if (stringWithBrackets) {
    const getErrorTextWithBrackets = stringWithBrackets[0];
    const transformErrorTextToArray =
      getErrorTextWithBrackets.match(/\[.+?\]/gs);

    const getStringFromErrorText = transformErrorTextToArray.join("");

    if (
      getErrorTextWithBrackets === getStringFromErrorText ||
      getErrorTextWithBrackets.replace(" \n", "") === getStringFromErrorText
    ) {
      const getStringMessageWithErrBrackets = stringWithBrackets[0];
      const getArrWithErrBrackets =
        getStringMessageWithErrBrackets.match(/\[.+?\]/s);
      const pureMessageText = getArrWithErrBrackets[0].match(/\[(.+)\]/s);

      return pureMessageText[1].trim();
    }
    return stringWithBrackets[1].trim();
  }

  if (
    errMessageString.includes("\n") &&
    errMessageString.match(/^\s?ORA-\d{5}:\s?ORA-\d{5}/) === null
  ) {
    const errorMessageText = errMessageString.replace(/\[|\]/g, "");
    return errorMessageText.trim();
  }
  return errMessageString;
}
