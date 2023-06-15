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
const numeric = /[0-9]/;
const space = /[\s]/;
const forbiddeCharacters = /^[^':<>_`~@&"]*$/i;

/** Функция создания ошибок валидации пароля */
function createErrorMessage(errorText) {
  return {
    errorText,
  };
}

export function passwordValidationWindow(password) {
  const passwordValidator = {
    lengthValidation: {
      errorText: `Пароль должен содержать от ${minLengthPassword} до ${maxLengthPassword} символов.`,
      isError: (pass) =>
        pass.length < minLengthPassword || pass.length > maxLengthPassword,
      id: 0,
      indicator: 40,
    },
    customValidation: {
      errorText:
        "Новый пароль должен содержать, как минимум, одну цифру, одну прописную и строчную букву.",
      isError: (pass) =>
        uppercaseLetter.test(pass) === false ||
        numeric.test(pass) === false ||
        lowercaseLetter.test(pass) === false,
      id: 1,
      indicator: 20,
    },
    spaceValidation: {
      errorText: "Пароль не должен содержать пробел.",
      isError: (pass) => space.test(pass),
      id: 2,
      indicator: 20,
    },
    russianSignValidation: {
      errorText:
        "Пароль не должен содержать русских букв в специальных символов.",
      isError: (pass) =>
        forbiddeCharacters.test(pass) === false ||
        forbiddenRussianSign.test(pass) === false,
      id: 3,
      indicator: 20,
    },
  };

  const validationTuple = Object.entries(passwordValidator).map(
    ([key, item]) => [
      key,
      {
        errorText: item.errorText,
        isError: item.isError(password),
        indicator: item.isError(password) ? item.indicator : 0,
      },
    ]
  );

  return Object.fromEntries(validationTuple);
}

export function passwordValidationDetail(password) {
  return Object.entries(passwordValidationWindow(password))
    .map(([, item]) => item)
    .filter((item) => item.isError)
    .map((item) => createErrorMessage(item.errorText));
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
