import { scrollToCardHead } from "@/utils/scroll";

export function eventHandler(data, item) {
  const SNUMBER_DOC = data.find((f) => f.name === "SNUMBER_DOC");
  const IDTYPE = data.find((f) => f.name === "IDTYPE");
  const SNUMBER_STS = data.find((f) => f.name === "SNUMBER_STS");
  const IDCOUNTRY = data.find((f) => f.name === "IDCOUNTRY");
  const IDCOUNTRY_STS = data.find((f) => f.name === "IDCOUNTRY_STS");

  const specSymbols = /[^A-Za-zА-Яа-яЁё0-9]/;
  // любые буквы ( любой алфавит)
  const regPTSLetterDigit = /^[\p{L}\p{N}]{10}$/u;
  const regEPTSLetterDigit = /^[\p{L}\p{N}]{15}$/u;
  const regOnlyLettersDigits = /^[\p{L}\p{N}]+$/u;

  function setError(field, curField, errorField) {
    field.state = false;

    if (specSymbols.test(curField.value)) {
      field.error = "Введите корректные значения";
    } else {
      field.error = errorField;
    }
  }

  // Работаем с ПТС

  if (item.name === "SNUMBER_DOC") {
    // Приводим ПТС к верхнему регистру

    SNUMBER_DOC.value = SNUMBER_DOC.value.toUpperCase();

    // Выбрана Россия
    if (IDCOUNTRY.value === 179) {
      // Выбран ПТС
      if (regPTSLetterDigit.test(item.value) && IDTYPE.value === 1) {
        SNUMBER_DOC.state = true;
        SNUMBER_DOC.error = null;
      }

      if (!regPTSLetterDigit.test(item.value) && IDTYPE.value === 1) {
        setError(SNUMBER_DOC, item, "Поле должно содержать 10 символов");
      }

      // Выбран ЭПТС
      if (regEPTSLetterDigit.test(item.value) && IDTYPE.value === 5) {
        SNUMBER_DOC.state = true;
        SNUMBER_DOC.error = null;
      }

      if (!regEPTSLetterDigit.test(item.value) && IDTYPE.value === 5) {
        setError(SNUMBER_DOC, item, "Поле должно содержать 15 символов");
      }
    }

    // Выбрана не Россия
    if (IDCOUNTRY.value !== 179) {
      // Выбран ПТС
      if (regOnlyLettersDigits.test(item.value) && IDTYPE.value === 1) {
        SNUMBER_DOC.state = true;
        SNUMBER_DOC.error = null;
      }

      if (specSymbols.test(item.value) && IDTYPE.value === 1) {
        setError(SNUMBER_DOC, item, "Введите корректные значения");
      }

      // Выбран ЭПТС
      if (regOnlyLettersDigits.test(item.value) && IDTYPE.value === 5) {
        SNUMBER_DOC.state = true;
        SNUMBER_DOC.error = null;
      }

      if (!regOnlyLettersDigits.test(item.value) && IDTYPE.value === 5) {
        setError(SNUMBER_DOC, item, "Введите корректные значения");
      }
    }
  }

  // При переключении ПТС на ЭПТС валидируем поле
  function validateFieldAmountAndSymbols(SNUMBER_DOC, regLetters, regSymbols, amountSymbolsError) {
    if (regLetters.test(SNUMBER_DOC.value)) {
      SNUMBER_DOC.state = true;
      SNUMBER_DOC.error = null;
    } else {
      SNUMBER_DOC.state = false;
      if (regSymbols.test(SNUMBER_DOC.value)) {
        SNUMBER_DOC.error = "Введите корректные значения";
      } else {
        SNUMBER_DOC.error = `Поле должно содержать ${amountSymbolsError} символов`;
      }
    }
  }

  function validateFieldSpecialSymbols(SNUMBER, regOnlyLettersDigits) {
    if (regOnlyLettersDigits.test(SNUMBER.value)) {
      SNUMBER.state = true;
      SNUMBER.error = null;
    } else {
      SNUMBER.state = false;

      if (SNUMBER.value !== "") {
        SNUMBER.error = "Введите корректные значения";
      }

      if (SNUMBER.value === "") {
        SNUMBER.error = "Обязательное поле";
      }
    }
  }

  //
  if ((item.name === "IDTYPE" && SNUMBER_DOC.value) || SNUMBER_DOC.state === false) {
    if (IDCOUNTRY.value === 179) {
      // Выбран ЭПТС
      if (IDTYPE.value === 5) {
        validateFieldAmountAndSymbols(SNUMBER_DOC, regEPTSLetterDigit, specSymbols, 15);
      }
      // Выбран ПТС
      if (IDTYPE.value === 1) {
        validateFieldAmountAndSymbols(SNUMBER_DOC, regPTSLetterDigit, specSymbols, 10);
      }
    }
    // Выбрана не Россия
    if (IDCOUNTRY.value !== 179) {
      // Выбран ЭПТС
      if (IDTYPE.value === 5) {
        validateFieldAmountAndSymbols(SNUMBER_DOC, regEPTSLetterDigit, specSymbols, 15);
      }

      // Выбран ПТС
      if (IDTYPE.value === 1) {
        validateFieldAmountAndSymbols(SNUMBER_DOC, regPTSLetterDigit, specSymbols, 10);
      }
    }
  }

  // Переключение страны при заполненном ПТС
  if ((item.name === "IDCOUNTRY" && SNUMBER_DOC.value) || SNUMBER_DOC.state === false) {
    if (IDCOUNTRY.value === 179) {
      // Выбран ЭПТС
      if (IDTYPE.value === 5) {
        validateFieldAmountAndSymbols(SNUMBER_DOC, regEPTSLetterDigit, specSymbols, 15);
      }

      // Выбран ПТС
      if (IDTYPE.value === 1) {
        validateFieldAmountAndSymbols(SNUMBER_DOC, regPTSLetterDigit, specSymbols, 10);
      }
    }

    // Выбрана не Россия
    if (IDCOUNTRY.value !== 179) {
      // Выбран ЭПТС или ПТС

      if (IDTYPE.value === 5 || IDTYPE.value === 1) {
        validateFieldSpecialSymbols(SNUMBER_DOC, regOnlyLettersDigits);
      }
    }
  }

  // Ошибка валидации СТС при прямом вводе
  if (item.name === "SNUMBER_STS") {
    if (IDCOUNTRY_STS.value === 179) {
      if (regPTSLetterDigit.test(item.value)) {
        SNUMBER_STS.state = true;
        SNUMBER_STS.error = null;
      } else {
        SNUMBER_STS.state = false;

        if (specSymbols.test(SNUMBER_STS.value)) {
          SNUMBER_STS.error = "Введите корректные значения";
        } else {
          SNUMBER_STS.error = "Поле должно содержать 10 символов";
        }
      }
    }
    if (IDCOUNTRY_STS.value !== 179) {
      if (regOnlyLettersDigits.test(item.value)) {
        SNUMBER_STS.state = true;
        SNUMBER_STS.error = null;
      } else {
        SNUMBER_STS.state = false;

        if (specSymbols.test(SNUMBER_STS.value)) {
          SNUMBER_STS.error = "Введите корректные значения";
        }
      }
    }
  }

  // Переключение страны при заполненом СТС
  if ((item.name === "IDCOUNTRY_STS" && SNUMBER_STS.value) || SNUMBER_STS.state === false) {
    // Выбрана Россия
    if (IDCOUNTRY_STS.value === 179) {
      validateFieldAmountAndSymbols(SNUMBER_STS, regPTSLetterDigit, specSymbols, 10);
    }
    // Выбрана не Россия
    if (IDCOUNTRY_STS.value !== 179) {
      validateFieldSpecialSymbols(SNUMBER_STS, regOnlyLettersDigits);
    }
  }

  return data;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  const IDCOUNTRY_STS = data.find((f) => f.name === "IDCOUNTRY_STS");
  const SNUMBER_STS = data.find((f) => f.name === "SNUMBER_STS");
  const DDOC_DATE_STS = data.find((f) => f.name === "DDOC_DATE_STS");

  if (IDCOUNTRY_STS.value) {
    IDCOUNTRY_STS.state = true;
    IDCOUNTRY_STS.error = null;
  }

  if (SNUMBER_STS.value) {
    SNUMBER_STS.state = true;
    SNUMBER_STS.error = null;
  }

  if (DDOC_DATE_STS.value) {
    DDOC_DATE_STS.state = true;
    DDOC_DATE_STS.error = null;
  }

  return data;
}
