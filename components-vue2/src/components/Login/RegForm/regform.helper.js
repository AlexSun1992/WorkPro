/** Минимальная длина пароля */
export const minLengthPassword = 8;
/** Максимальная длина пароля */
export const maxLengthPassword = 20;
/** Текст подсказки для валидации пароля */
export const tooltipTextForDetailFunc = `Пароль должен содержать от ${minLengthPassword} до ${maxLengthPassword} символов. Пароль должен состоять из латинских букв, содержать минимум одну цифру, одну заглавную и одну строчную буквы; также можно использовать спецсимволы: !#$%^*()-=+[]{};,.|/? (пробел исключён)`;
export const tooltipText = `Требования к паролю: от ${minLengthPassword} до ${maxLengthPassword} символов. Пароль должен состоять из латинских букв, содержать минимум одну цифру, одну заглавную и одну строчную буквы; также можно использовать спецсимволы: !#$%^*()-=+[]{};,.|/? (пробел исключён)`;

const forbiddenRussianSign = /^[^а-яА-ЯёЁ]*$/i;
const uppercaseLetter = /[A-Z]/;
const lowercaseLetter = /[a-z]/;
const numeric = /[0-9]/i;
const space = /[\s]/;
const forbiddeCharacters = /^[^':<>_`~@&"]*$/i;

/** Функция создания ошибок валидации пароля */
function createErrorMessage(errorValue) {
  return {
    errorText: errorValue,
  };
}

export function passwordValidationDetail(password) {
  /** Массив ошибок для пароля */
  const errorMessagepasswordValidation = [];
  if (
    password.length < minLengthPassword ||
    password.length > maxLengthPassword
  ) {
    errorMessagepasswordValidation.push(
      createErrorMessage(
        `Пароль должен содержать от ${minLengthPassword} до ${maxLengthPassword} символов.`
      )
    );
  }
  if (
    uppercaseLetter.test(password) === false ||
    numeric.test(password) === false ||
    lowercaseLetter.test(password) === false
  ) {
    if (password !== "") {
      errorMessagepasswordValidation.push(
        createErrorMessage(
          "Новый пароль должен содержать, как минимум, одну цифру, одну прописную и строчную букву."
        )
      );
    }
  }
  if (space.test(password) === true) {
    errorMessagepasswordValidation.push(
      createErrorMessage("Пароль не должен содержать пробел.")
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

  return errorMessagepasswordValidation;
}

/**
 * Функция валидации пароля
 * @param {string} password входящая переменная
 * @return {{errorText: string}[]}
 */
export function passwordValidation(password) {
  /** Массив ошибок для пароля */
  const errorMessagepasswordValidation = [];

  if (passwordValidationDetail(password).length > 0) {
    errorMessagepasswordValidation.push(
      createErrorMessage(
        `Требования к паролю: от ${minLengthPassword} до ${maxLengthPassword} символов. Пароль должен состоять из латинских букв, содержать минимум одну цифру, одну заглавную и одну строчную буквы; также можно использовать спецсимволы: !#$%^*()-=+[]{};,.|/? (пробел исключён)`
      )
    );
  }

  return errorMessagepasswordValidation;
}
