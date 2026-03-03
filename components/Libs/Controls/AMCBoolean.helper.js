const dicTrue = [1, true, "true", "y", "д"];
const dicFalse = [0, false, "false", "n", "н"];

function getValue(val) {
  return typeof val === "string" ? val.toLowerCase() : val;
}

export function isTrue(val) {
  return dicTrue.includes(getValue(val));
}

export function isFalse(val) {
  return dicFalse.includes(getValue(val));
}

export function isBoolean(val) {
  return [...dicFalse, ...dicTrue].includes(getValue(val));
}
