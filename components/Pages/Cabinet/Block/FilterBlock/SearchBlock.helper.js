export function isStringInItem(item, inputValue) {
  const str = inputValue.toLowerCase().trim();
  if (str === "") {
    return true;
  }

  if (typeof item === "number") {
    return String(item).trim().includes(str);
  }

  if (typeof item === "string") {
    return item.toLowerCase().trim().includes(str);
  }
  if (typeof item === "object") {
    if (item === null) {
      return false;
    }

    const arrayValues = Array.isArray(item) ? item : Object.values(item);
    return arrayValues.some((val) => isStringInItem(val, str));
  }
  return false;
}
