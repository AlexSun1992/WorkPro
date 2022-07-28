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

  const arrayFromErrorMessageWithOutExtremeBrackets =
    arrayFromErrorMessage[0].replace(/\[|]$/, "");

  const arrayFromErrorMessageWithoutBracketsFollowText =
    arrayFromErrorMessageWithOutExtremeBrackets.replace(/\].+$/, "");

  const arrayFromErrorMessageWithoutBracketsFollowTextCompletely =
    arrayFromErrorMessageWithoutBracketsFollowText.replace(/.+\[/, "");

  return arrayFromErrorMessageWithoutBracketsFollowTextCompletely;

  // const turnMessageToArray =
  //   arrayFromErrorMessageWithOutExtremeBrackets.split("");

  // const openBracket = turnMessageToArray.indexOf(
  //   turnMessageToArray.find((item) => item === "[")
  // );

  // const arrWithoutPreviousText = turnMessageToArray.filter((item, i) => {
  //   return i > openBracket;
  // });

  // const arrWithoutPreviousTextReversed = arrWithoutPreviousText
  //   .reverse()
  //   .join("");

  // const closeBracket = arrWithoutPreviousTextReversed.indexOf(
  //   arrWithoutPreviousTextReversed.find((item) => item === "]")
  // );

  // const arrWithoutTextAfterBeforeBrackets =
  //   arrWithoutPreviousTextReversed.filter((item, i) => {
  //     return i > closeBracket;
  //   });

  // const backReversed = arrWithoutTextAfterBeforeBrackets.reverse().join("");

  // const arrayFromErrorMessageWithOutExtremeBrackets =
  //   arrayFromErrorMessage[0].replace(/\[|]$/g, "");

  // const arrayFromErrorMessageWithoutBracketsFollowText =
  //   arrayFromErrorMessageWithOutExtremeBrackets.replace(/\].+$/, "");

  // const arrayFromErrorMessageWithoutBracketsFollowTextCompletely =
  //   arrayFromErrorMessageWithoutBracketsFollowText.replace(/^.+\[/, "");

  // return arrayFromErrorMessageWithoutBracketsFollowTextCompletely;
  /////
  // const arrayFromErrorMessageWithoutBracketsFollowText =
  //   arrayFromErrorMessage[0].replace(/\]$/, "");

  // const arrayFromErrorMessageWithoutBracketsFollowTextCompletely =
  //   arrayFromErrorMessageWithoutBracketsFollowText.replace(/\[/, "");

  //return arrayFromErrorMessageWithoutBracketsFollowTextCompletely;
}
//
