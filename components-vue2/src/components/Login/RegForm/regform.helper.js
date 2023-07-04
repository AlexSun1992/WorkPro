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
const forbiddeCharacters = /^[^':№\\<>_`~@&"]*$/i;

/**
 * @type {import("./regform.helper.types").PasswordValidator}
 */
export const passwordValidator = {
  spaceAndForbiddeCharactersValidation: {
    errorText: "без пробела и недопустимых спецсимволов",
    isError: (pass) => {
      if (
        pass.length > 0 &&
        !space.test(pass) &&
        forbiddeCharacters.test(pass)
      ) {
        return false;
      }
      return true;
    },
    indicator: 12,
  },

  numberValidation: {
    errorText: "минимум одна цифра",
    isError: (pass) => numeric.test(pass) === false,
    indicator: 12,
  },

  uppercaseLetterValidation: {
    errorText: "минимум одна заглавная буква",
    isError: (pass) => uppercaseLetter.test(pass) === false,
    indicator: 12,
  },

  lowercaseLetterValidation: {
    errorText: "минимум одна строчная буква",
    isError: (pass) => lowercaseLetter.test(pass) === false,
    indicator: 12,
  },

  russianSignValidation: {
    errorText: "только латинские буквы",
    isError: (pass) => {
      if (pass.length === 0) {
        return true;
      }
      if (
        (!uppercaseLetter.test(pass) &&
          !lowercaseLetter.test(pass) &&
          !forbiddenRussianSign.test(pass)) ||
        (!uppercaseLetter.test(pass) &&
          !lowercaseLetter.test(pass) &&
          forbiddenRussianSign.test(pass))
      ) {
        return true;
      }
      if (pass.length > 0 && !forbiddenRussianSign.test(pass)) {
        return true;
      }
      return false;
    },
    indicator: 12,
  },

  lengthValidation: {
    errorText: `от ${minLengthPassword} до ${maxLengthPassword} символов`,
    isError: (pass) =>
      pass.length < minLengthPassword || pass.length > maxLengthPassword,
    indicator: 40,
  },
};

/** Функция создания ошибок валидации пароля */
function createErrorMessage(errorText) {
  return {
    errorText,
  };
}

export function passwordValidationWindow(password) {
  const validationTuple = Object.entries(passwordValidator).map(
    ([key, item]) => [
      key,
      {
        errorText: item.errorText,
        isError: item.isError(password),
        indicator: item.isError(password) ? 0 : item.indicator,
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
