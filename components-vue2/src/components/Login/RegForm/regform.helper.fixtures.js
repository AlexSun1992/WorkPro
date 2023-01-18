/** Минимальная длина пароля */
export const minLengthPassword = 6;
/** Максимальная длина пароля */
export const maxLengthPassword = 20;

const forbiddenRussianSign = /^[^а-яА-ЯёЁ]*$/i;
const alpha = /^[a-z]*$/i;
const numeric = /^[0-9]*$/i;
const forbiddeCharacters = /^[^!"#$%&'()*+,-./:;|<=>?@[_`{}~]*$/i;
/** Функция создания ошибок валидации пароля */
function createErrorMessage(errorValue) {
  return {
    errorText: errorValue,
  };
}
/** Функция валидации пароля */
export function passwordValidation(password) {
  const errorMessagepasswordValidation = [];
  if (
    password.length < minLengthPassword ||
    password.length > maxLengthPassword
  ) {
    errorMessagepasswordValidation.push(
      createErrorMessage("Пароль должен содержать от 6 до 20 символов.")
    );
  }
  if (alpha.test(password) === true || numeric.test(password) === true) {
    errorMessagepasswordValidation.push(
      createErrorMessage(
        "Новый пароль должен содержать, как минимум, одну цифру и одну букву."
      )
    );
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
  console.log(alpha.test(password), "alpha.test(password)");
  console.log(numeric.test(password), "numeric.test(password)");
  return errorMessagepasswordValidation;
}
