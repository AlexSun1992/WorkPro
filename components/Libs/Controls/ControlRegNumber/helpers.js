import {
  REGEXP_NUMBER,
  REGEXP_NUMBER_ABBREVIATED_1,
  REGEXP_NUMBER_ABBREVIATED_2,
  REGEXP_NUMBER_ABBREVIATED_3,
  REGEXP_NUMBER_ABBREVIATED_4,
} from "../ControlRegNumberAuto/RegNumberAutoNumber.helpers";

const isSymbolsValid = (value) => {
  const LETTERS = new Set([
    "А",
    "В",
    "Е",
    "К",
    "М",
    "Н",
    "О",
    "Р",
    "С",
    "Т",
    "У",
    "Х",
    "A",
    "B",
    "E",
    "H",
    "K",
    "M",
    "O",
    "P",
    "C",
    "T",
    "X",
    "Y",
  ]);
  const DIGITS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  const len = value.length;
  if (len < 1 || len > 6) return 0;

  const validationRules = [
    { pos: 0, validChars: LETTERS }, // Первый символ - всегда буква
    { pos: 1, validChars: DIGITS }, // Второй - цифра
    { pos: 2, validChars: DIGITS }, // Третий - цифра
    { pos: 3, validChars: DIGITS }, // Четвертый - цифра
    { pos: 4, validChars: LETTERS }, // Пятый - буква
    { pos: 5, validChars: LETTERS }, // Шестой - буква
  ];

  for (const rule of validationRules.slice(0, len)) {
    if (!rule.validChars.has(value[rule.pos])) {
      return rule.pos;
    }
  }

  return -1;
};

const isValid = (value) => {
  const formatValue = value.toUpperCase();
  return isSymbolsValid(formatValue);
};

const isCodeValid = (value) => {
  if (/^\d+$/iu.test(value) && value.length > 1) {
    return true;
  }
  return false;
};

const isNumberValid = (value) =>
  REGEXP_NUMBER.test(value) ||
  REGEXP_NUMBER_ABBREVIATED_1.test(value) ||
  REGEXP_NUMBER_ABBREVIATED_2.test(value) ||
  REGEXP_NUMBER_ABBREVIATED_3.test(value) ||
  REGEXP_NUMBER_ABBREVIATED_4.test(value);

export { isSymbolsValid, isValid, isCodeValid, isNumberValid };
