const ALL_LETTERS = `АВЕКМНОРСТУХABEHKMNOPCTYX`;
const REGEXP_NUMBER = new RegExp(`^[${ALL_LETTERS}]\\d{3}[${ALL_LETTERS}]{2}$`, "iu");
const REGEXP_MOTO_NUMBER = new RegExp(`^\\d{4}[${ALL_LETTERS}]{2}$`, "iu");
const REGEXP_MOTO_ADD_SPACE = new RegExp(`(\\d+)(?=[${ALL_LETTERS}])`, "gi");
const REGEXP_ADD_SPACE = new RegExp(`[${ALL_LETTERS}](?=\\d)|\\d(?=[${ALL_LETTERS}])`, "gi");
const REGEXP_NUMBER_ABBREVIATED_1 = new RegExp(`^[${ALL_LETTERS}]{2}\\d{3}$`, "iu");
const REGEXP_NUMBER_ABBREVIATED_2 = new RegExp(`^[${ALL_LETTERS}]{2}\\d{4}$`, "iu");
const REGEXP_NUMBER_ABBREVIATED_3 = new RegExp(`^\\d{4}[${ALL_LETTERS}]{2}$`, "iu");
const REGEXP_NUMBER_ABBREVIATED_4 = new RegExp(`^[${ALL_LETTERS}]{2}\\d{3}[${ALL_LETTERS}]$`, "iu");
const NON_CONTROL_KEYS = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
const AUTO_REG_NUMBER_LENGTHS = [8, 9];
const AUTO_MASK_ID = 1;
const MOTO_MASK_ID = 2;

export {
  ALL_LETTERS,
  REGEXP_NUMBER,
  REGEXP_ADD_SPACE,
  AUTO_REG_NUMBER_LENGTHS,
  NON_CONTROL_KEYS,
  REGEXP_NUMBER_ABBREVIATED_1,
  REGEXP_NUMBER_ABBREVIATED_2,
  REGEXP_NUMBER_ABBREVIATED_3,
  REGEXP_NUMBER_ABBREVIATED_4,
  REGEXP_MOTO_NUMBER,
  REGEXP_MOTO_ADD_SPACE,
  MOTO_MASK_ID,
  AUTO_MASK_ID,
};
