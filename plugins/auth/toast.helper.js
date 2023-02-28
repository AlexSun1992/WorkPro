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
 * При наличии ORA в "errorMessage" возвращает текст после ORA, при отсутствии ORA дефолтный текст
 * @param {string} errorMessage Строка с ошибкой, содержащая ORA и квадратные скобки, или не содержащая таковых.
 * @returns {string}
 */

export function getErrorNumber(errorMessage) {
  const getDoubleCloseMistake = errorMessage.match(
    /^\s?ORA-\d{5}:\s?ORA-\d{5}/
  );
  if (getDoubleCloseMistake) {
    const getArrWithMistakes = errorMessage.match(/\s?ORA-\d{5}/g);
    const onlyPureMistakesName = getArrWithMistakes.filter(
      (item) => !item.includes("\n")
    );

    let compareNumber;
    if (onlyPureMistakesName.length >= 2) {
      [, compareNumber] = onlyPureMistakesName;
    }

    return compareNumber;
  }
  const getORAnumber = errorMessage.match(/\s?ORA-\d{5}/);
  return getORAnumber;
}

export function isCriticalError(errorMessage) {
  const errorNumber = getErrorNumber(errorMessage);
  if (MAX_ORA_ERROR > errorNumber) {
    return true;
  }
  return false;
}

export function getErrorMessage(errorMessage, h) {
  const [errMessageString] = convertErrorMessageToArray(errorMessage);
  const stringWithBrackets = errMessageString.match(/\[(.+)]/);

  const getORAnumber = errorMessage.match(/\s?ORA-\d{5}/);

  if (getORAnumber) {
    const errNumber = getErrorNumber(errorMessage);
    if (MAX_ORA_ERROR > errNumber) {
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
  }
  if (stringWithBrackets) {
    const getErrorTextWithBrackets = stringWithBrackets[0];
    const transformErrorTextToArray =
      getErrorTextWithBrackets.match(/\[.+?\]/g);

    const getStringFromErrorText = transformErrorTextToArray.join("");
    if (getErrorTextWithBrackets === getStringFromErrorText) {
      const getStringMessageWithErrBrackets = stringWithBrackets[0];
      const getArrWithErrBrackets =
        getStringMessageWithErrBrackets.match(/\[.+?\]/);
      const pureMessageText = getArrWithErrBrackets[0].match(/\[(.+)]/);

      return pureMessageText[1];
    }
    return stringWithBrackets[1];
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
