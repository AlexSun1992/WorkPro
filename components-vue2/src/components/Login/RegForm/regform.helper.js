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
  const errorMessagepasswordValidation = [
    {
      errorText: `Пароль должен содержать от ${minLengthPassword} до ${maxLengthPassword} символов.`,
      isError: true,
      id: 0,
      indicator: 40,
    },
    {
      errorText:
        "Новый пароль должен содержать, как минимум, одну цифру, одну прописную и строчную букву.",
      isError: true,
      id: 1,
      indicator: 20,
    },
    {
      errorText: "Пароль не должен содержать пробел.",
      isError: true,
      id: 2,
      indicator: 20,
    },
    {
      errorText:
        "Пароль не должен содержать русских букв в специальных символов.",
      isError: true,
      id: 3,
      indicator: 20,
    },
  ];

  if (
    password.length < minLengthPassword ||
    password.length > maxLengthPassword
  ) {
    errorMessagepasswordValidation[0].isError = false;
    errorMessagepasswordValidation[0].indicator = 0;
  }
  if (
    uppercaseLetter.test(password) === false ||
    numeric.test(password) === false ||
    lowercaseLetter.test(password) === false
  ) {
    if (password !== " ") {
      errorMessagepasswordValidation[1].isError = false;
      errorMessagepasswordValidation[1].indicator = 0;
    }
    if (password !== "") {
      errorMessagepasswordValidation[1].isError = false;
      errorMessagepasswordValidation[1].indicator = 0;
    }
  }
  if (space.test(password) === true) {
    errorMessagepasswordValidation[2].isError = false;
    errorMessagepasswordValidation[2].indicator = 0;
  }
  if (
    forbiddeCharacters.test(password) === false ||
    forbiddenRussianSign.test(password) === false
  ) {
    errorMessagepasswordValidation[3].isError = false;
    errorMessagepasswordValidation[3].indicator = 0;
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
  const isError = passwordValidationDetail(password).map((item) => {
    if (item.isError === false) {
      return true;
    }
    return false;
  });
  const isErrorSort = isError.filter((i) => i === true);

  if (isErrorSort.length !== 0) {
    errorMessagepasswordValidation.push(
      createErrorMessage(
        `Требования к паролю: от ${minLengthPassword} до ${maxLengthPassword} символов. Пароль должен состоять из латинских букв, содержать минимум одну цифру, одну заглавную и одну строчную буквы; также можно использовать спецсимволы: !#$%^*()-=+[]{};,.|/? (пробел исключён)`
      )
    );
  }
  return errorMessagepasswordValidation;
}
