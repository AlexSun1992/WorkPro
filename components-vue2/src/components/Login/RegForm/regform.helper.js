/** Минимальная длина пароля */
export const minLengthPassword = 6;
/** Максимальная длина пароля */
export const maxLengthPassword = 20;
/** Текст подсказки для валидации пароля */
export const tooltipText = `Пароль должен содержать от ${minLengthPassword} до ${maxLengthPassword} символов. Пароль должен содержать, как минимум, одну цифру и одну букву. Пароль не должен содержать русских букв и специальных символов.`;

const forbiddenRussianSign = /^[^а-яА-ЯёЁ]*$/i;
const alpha = /[a-z]/i;
const numeric = /[0-9]/i;
const forbiddeCharacters = /^[^!"#$%&'()*+,-./:;|<=>?@[_`{}~]*$/i;
/** Функция создания ошибок валидации пароля */
function createErrorMessage(errorValue) {
  return {
    errorText: errorValue,
  };
}
/** Функция валидации пароля
 * @param {string} password
 * @returns {array} errorMessagepasswordValidation
 */
export function passwordValidation(password) {
  /** Массив ошибок для пароля
   * @param {Array} errorMessagepasswordValidation
   */
  const errorMessagepasswordValidation = [];
  if (
    password.length < minLengthPassword ||
    password.length > maxLengthPassword
  ) {
    errorMessagepasswordValidation.push(
      createErrorMessage("Пароль должен содержать от 6 до 20 символов.")
    );
  }
  if (alpha.test(password) === false || numeric.test(password) === false) {
    if (password !== "") {
      errorMessagepasswordValidation.push(
        createErrorMessage(
          "Новый пароль должен содержать, как минимум, одну цифру и одну букву."
        )
      );
    }
  }
  if (
    forbiddeCharacters.test(password) === false ||
    forbiddenRussianSign.test(password) === false
  ) {
    errorMessagepasswordValidation.push(
      createErrorMessage(
        "Пароль не должен содержать русских букв в специальных символов."
      )
    );
  }
  return errorMessagepasswordValidation;
}
