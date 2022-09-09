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

export { isLetterValid, isDigitValid, isValid, isCodeValid };
