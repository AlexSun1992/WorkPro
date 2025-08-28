import { isNumberValid, isValid } from "../ControlRegNumber/helpers";

export default {
  /**
   *
   * @param { string | null } num
   * @param { string | null } code
   * @returns { boolean }
   */
  isVehicleNumber(num, code) {
    return this.isNumberValid(num) && this.isRegionCode(code);
  },
  isNumberValid(val) {
    return isNumberValid(val);
  },
  isRegionCode(code) {
    const _code = +code;

    return !isNaN(_code) && isFinite(_code) && `${code}`.length >= 2 && `${code}`.length <= 3;
  },
  numberFormatter(value) {
    const formatValue = value?.toUpperCase();
    const withOutSpacesValue = formatValue?.replaceAll(" ", "");

    if (!withOutSpacesValue) {
      return formatValue;
    }

    if (isValid(withOutSpacesValue) === true) {
      return formatValue.replace(/[АВЕКМНОРСТУХABEHKMNOPCTYX](?=\d)|\d(?=[АВЕКМНОРСТУХABEHKMNOPCTYX])/gi, "$& ");
    }
    if (isValid(withOutSpacesValue) === false) {
      return formatValue.slice(0, -1);
    }
    return formatValue;
  },
  codeFormatter(value) {
    if (/^\d+$/iu.test(value)) {
      if (value.length > 3) {
        return value?.substring(0, 3);
      }
      return value;
    }
    return value?.substring(0, value.length - 1);
  },
  /**
   * @description Возвращает URI строку из объекта параметров
   * @param {object} params
   */
  paramsToString(params) {
    let result = "";
    let separator = "";

    for (const item in params) {
      result += `${separator}${item}=${params[item]}`;

      separator = "&";
    }

    return result;
  },
};
