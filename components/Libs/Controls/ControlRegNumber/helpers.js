const isLetterValid = (value) => {
  const availableLetters = "АВЕКМНОРСТУХABEHKMOPCTYX";
  return (
    (value.length === 1 || value.length === 5 || value.length === 6) &&
    availableLetters.includes(value[value.length - 1])
  );
};

const isDigitValid = (value) => {
  return (
    value.length >= 2 && value.length <= 4 && /\d/.test(value[value.length - 1])
  );
};

const isValid = (value) => {
  const formatValue = value.toUpperCase();
  return isLetterValid(formatValue) || isDigitValid(formatValue);
};

const isCodeValid = (value) => {
  if (/^\d+$/iu.test(value) && value.length > 1) {
    return true;
  }
  return false;
};

const isNumberValid = (value) => {
  if (
    /^[АВЕКМНОРСТУХABEHKMNOPCTYX]\d{3}[АВЕКМНОРСТУХABEHKMOPCTYX]{2}$/iu.test(
      value
    )
  ) {
    return true;
  }
  if (/^[АВЕКМНОРСТУХABEHKMOPCTYX]{2}\d{3}$/iu.test(value)) {
    return true;
  }
  if (/^[АВЕКМНОРСТУХABEHKMOPCTYX]{2}\d{4}$/iu.test(value)) {
    return true;
  }
  if (/^\d{4}[АВЕКМНОРСТУХABEHKMOPCTYX]{2}$/iu.test(value)) {
    return true;
  }
  if (
    /^[АВЕКМНОРСТУХABEHKMOPCTYX]{2}\d{3}[АВЕКМНОРСТУХABEHKMOPCTYX]$/iu.test(
      value
    )
  ) {
    return true;
  }
  if (/^Т[АВЕКМНОРСТУХABEHKMOPCTYX]{2}\d{3}$/iu.test(value)) {
    return true;
  }
  return false;
};

export { isLetterValid, isDigitValid, isValid, isCodeValid, isNumberValid };
