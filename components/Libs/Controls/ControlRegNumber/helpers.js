const isLetterValid = (value) => {
  const availableLetters = "АВЕКМНОРСТУХ";
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
  if (isLetterValid(formatValue) || isDigitValid(formatValue)) {
    return true;
  }
  return false;
};

const isCodeValid = (value) => {
  if (/^\d+$/iu.test(value) && value.length > 1) {
    return true;
  }
  return false;
};

export { isLetterValid, isDigitValid, isValid, isCodeValid };
