import {
  REGEXP_NUMBER,
  REGEXP_NUMBER_ABBREVIATED_1,
  REGEXP_NUMBER_ABBREVIATED_2,
  REGEXP_NUMBER_ABBREVIATED_3,
  REGEXP_NUMBER_ABBREVIATED_4,
  MOTO_MASK_ID,
  AUTO_MASK_ID,
} from "../ControlRegNumberAuto/RegNumberAutoNumber.helpers";

const isSymbolsValid = (value, typeNumber, len) => {
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
  const valueLength = value.length;

  if (!len) {
    return -1;
  }
  if (valueLength < 1 || valueLength > len) return 0;

  const validationRulesAuto = [
    { pos: 0, validChars: LETTERS },
    { pos: 1, validChars: DIGITS },
    { pos: 2, validChars: DIGITS },
    { pos: 3, validChars: DIGITS },
    { pos: 4, validChars: LETTERS },
    { pos: 5, validChars: LETTERS },
  ];
  const validationRulesMoto = [
    { pos: 0, validChars: DIGITS },
    { pos: 1, validChars: DIGITS },
    { pos: 2, validChars: DIGITS },
    { pos: 3, validChars: DIGITS },
    { pos: 4, validChars: LETTERS },
    { pos: 5, validChars: LETTERS },
  ];
  let validationRules = [];

  if (typeNumber === MOTO_MASK_ID) {
    validationRules = validationRulesMoto;
  }
  if (typeNumber === AUTO_MASK_ID) {
    validationRules = validationRulesAuto;
  }

  for (const rule of validationRules.slice(0, valueLength)) {
    if (!rule.validChars.has(value[rule.pos])) {
      return rule.pos;
    }
  }
  return -1;
};

const isValid = (value, typeNumber, len) => {
  const formatValue = value.toUpperCase();
  return isSymbolsValid(formatValue, typeNumber, len);
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
