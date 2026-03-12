import { scrollToCardHead } from "@/utils/scroll";
import { getDate } from "../helpers";
import { getBoolean, getDataFieldsAsArr, setFieldsVisibleState } from "@/components/EventHandler/helpers";

const RUSSIA_COUNTRY_CODE = 179; // Код России
const prevFields = ["SPREV_SECONDNAME", "IDCOUNTRY_PREV", "SPREV_LICSERIA", "SPREV_LICNUMBER"];

function setReverseRequired(dataSet) {
  dataSet.forEach((el) => {
    if (el.required && el.visible && !["EmptyBlock", "LPREV_LICENSE"].includes(el.name)) {
      el.required = !el.required;
    }
  });
}

function setReverseUnRequired(dataSet) {
  dataSet.forEach((el) => {
    if (!el.required && el.visible && !["EmptyBlock", "LPREV_LICENSE"].includes(el.name)) {
      el.required = !el.required;
    }
  });
}

const COUNTRY_FIELD_CONFIGS = {
  IDCOUNTRY: {
    seriaField: "SSERIA_LICENSE",
    numberField: "SNUMBER_LICENSE",
    seriaValidator: validateSSERIA_LICENSE,
    numberValidator: validateSNUMBER_LICENSE,
  },
  IDCOUNTRY_PREV: {
    seriaField: "SPREV_LICSERIA",
    numberField: "SPREV_LICNUMBER",
    seriaValidator: validateSPREV_LICSERIA,
    numberValidator: validateSPREV_LICNUMBER,
  },
};

function handleCountryFields(insuredList, item, countryFieldName) {
  const insuredIndex = item.value?.index ?? item.insuredIndex;
  const list = insuredList.value[insuredIndex];
  const countryValue = Number(item.value?.value?.value ?? item.value);
  const config = COUNTRY_FIELD_CONFIGS[countryFieldName];

  if (!config) return;

  const seriaField = findFieldInInsuredList(list, config.seriaField);
  const numberField = findFieldInInsuredList(list, config.numberField);

  // Обработка серии
  if (seriaField) {
    seriaField.required = countryValue === RUSSIA_COUNTRY_CODE;
    if (countryValue === RUSSIA_COUNTRY_CODE && seriaField.value?.length > 4) {
      seriaField.value = seriaField.value?.slice(0, 4);
    }
    config.seriaValidator(insuredList, { ...seriaField, insuredIndex });
  }

  // Обработка номера
  if (numberField) {
    numberField.required = true;
    if (!numberField.value && numberField.value !== null) {
      setFieldState(numberField, false, "Обязательно для заполнения");
    }
    config.numberValidator(insuredList, { ...numberField, insuredIndex });
  }
}

/**
 * @description Доступность кнопки далее на форме исходя из валидности формы
 */
function setNextButtonState(copyData) {
  setVisibleSafety(copyData, "Continue", true);
}

function setFieldState(field, state, errMessage) {
  if (field) {
    field.state = state;
    field.error = errMessage;
  }
}

function validFieldByLength(insuredList, item, lengthTo, lengthFrom = null) {
  const field = insuredList.value[item.insuredIndex]?.find((field) => field.name === item.name);

  const isValidValueLength = !lengthFrom
    ? item.value?.length === lengthTo
    : item.value?.length >= lengthTo && item.value?.length <= lengthFrom;
  if (item.value !== null && item.value !== undefined && !isValidValueLength) {
    if (item.value?.length === 0 || item.value?.length === undefined) {
      setFieldState(field, false, `Обязательно для заполнения`);
      return;
    }
    let errorText =
      lengthTo > 4 ? `Должно быть введено ${lengthTo} символов ` : `Должно быть введено ${lengthTo} символа `;
    if (lengthFrom) {
      errorText = `Должно быть введено от ${lengthTo} до ${lengthFrom} символов `;
    }
    setFieldState(field, false, errorText);
    return;
  }
  if (item.value?.length && isValidValueLength) {
    setFieldState(field, true, null);
    return;
  }
  setFieldState(field, null, null);
}

function isDatesLatestThenSomeYears(minDate, maxDate, years = 0) {
  const modified = new Date(minDate);
  modified.setFullYear(modified.getFullYear() + years);

  return maxDate.getTime() >= modified.getTime();
}

function getDate(str) {
  const splitSrt = str?.split(".");

  if (Array.isArray(splitSrt) && splitSrt.length === 3) {
    return new Date(splitSrt.reverse().join("-"));
  }

  return null;
}

function setNestedFieldState(data, name, isRequired) {
  const field = findField(data, name);
  if (field && name !== "SPREV_LICNUMBER") {
    field.required = isRequired;
  }
}

function findFieldInInsuredList(list = [], name) {
  return list?.find((item) => item.name === name);
}

function getFieldAndCountryInfo(insuredList, item, countryFieldName) {
  const list = insuredList.value[item.insuredIndex];
  const countryField = findFieldInInsuredList(list, countryFieldName);
  const field = insuredList.value[item.insuredIndex]?.find((f) => f.name === item.name);
  const isRussia = Number(countryField?.value) === RUSSIA_COUNTRY_CODE;

  return { field, isRussia };
}

function getFieldFromItem(item) {
  const result = { ...item?.value?.value };
  result.insuredIndex = item?.value?.index;
  return result;
}

function validateDates(insuredList) {
  const fields = {
    stage: findFieldInInsuredList(insuredList, "DINSURED_STAGEDATE"),
    birth: findFieldInInsuredList(insuredList, "DINSURED_BIRTHDATE"),
  };

  const dates = {
    stage: getDate(fields.stage?.value),
    birth: getDate(fields.birth?.value),
    current: new Date(new Date().setHours(0, 0, 0, 0)),
  };

  const rules = {
    birth: [
      {
        check: () => !dates.birth && fields.birth?.required && !dates.stage,
        message: "Поле обязательно к заполнению",
      },
      {
        check: () => dates.birth && dates.birth.setHours(0, 0, 0, 0) > dates.current,
        message: "Дата рождения не может быть позже текущей даты",
      },
    ],
    stage: [
      {
        check: () => !dates.stage && fields.stage?.required && !dates.birth,
        message: "Поле обязательно к заполнению",
      },
      {
        check: () => dates.birth && dates.stage && !isDatesLatestThenSomeYears(dates.birth, dates.stage, 16),
        message: "Дата начала стажа не может быть раньше 16 лет",
      },
      {
        check: () => dates.stage && dates.stage.setHours(0, 0, 0, 0) > dates.current,
        message: "Дата начала стажа не может быть позже текущей даты",
      },
    ],
  };

  const applyRules = (field, ruleSet) => {
    const failedRule = ruleSet.find((rule) => rule.check());
    if (failedRule) {
      setFieldState(field, false, failedRule.message);
    } else {
      setFieldState(field, true, null);
    }
  };

  applyRules(fields.birth, rules.birth);
  applyRules(fields.stage, rules.stage);
}

// Серия ВУ
function validateSSERIA_LICENSE(insuredList, item) {
  const { field, isRussia } = getFieldAndCountryInfo(insuredList, item, "IDCOUNTRY");

  if (isRussia) {
    field.mask = "YYYY";
    validFieldByLength(insuredList, item, 2, 4);
  } else {
    delete field.mask;
    setFieldState(field, null, null);
  }
}

// Номер ВУ
function validateSNUMBER_LICENSE(insuredList, item) {
  const { field, isRussia } = getFieldAndCountryInfo(insuredList, item, "IDCOUNTRY");

  if (isRussia) {
    field.mask = "######";
    validFieldByLength(insuredList, item, 6);
  } else {
    delete field.mask;
    if (field.value) setFieldState(field, true, null);
    if (field.value === undefined) return setFieldState(field, null, null);
    if (!field.value && field.value !== null) setFieldState(field, false, "Обязательно для заполнения");
  }
}

function validateSPREV_LICSERIA(insuredList, item) {
  const { field, isRussia } = getFieldAndCountryInfo(insuredList, item, "IDCOUNTRY_PREV");

  if (isRussia) {
    field.mask = "YYYY";
    validFieldByLength(insuredList, item, 2, 4);
  } else {
    delete field.mask;
    setFieldState(field, null, null);
  }
}

function validateSPREV_LICNUMBER(insuredList, item) {
  const { field, isRussia } = getFieldAndCountryInfo(insuredList, item, "IDCOUNTRY_PREV");

  if (isRussia) {
    field.mask = "######";
    validFieldByLength(insuredList, item, 6);
  } else {
    delete field.mask;
    if (field.value) setFieldState(field, true, null);
    if (field.value === undefined) return setFieldState(field, null, null);
  }
}

function validateFormField(insuredList, item) {
  const fieldsValidators = {
    SSERIA_LICENSE: validateSSERIA_LICENSE,
    SNUMBER_LICENSE: validateSNUMBER_LICENSE,
    SPREV_LICSERIA: validateSPREV_LICSERIA,
    SPREV_LICNUMBER: validateSPREV_LICNUMBER,
    DINSURED_STAGEDATE: validateDates,
    DINSURED_BIRTHDATE: validateDates,
  };

  const field = getFieldFromItem(item);

  if (fieldsValidators[field?.name]) {
    fieldsValidators[field.name](insuredList, field);
  }
}

function findField(dataSet, name) {
  if (!Array.isArray(dataSet)) return {};
  const field = dataSet.find((item) => item.name === name);
  if (field) {
    return field;
  }
  throw new Error(`Поле ${name} не найдено в данных`);
}

function validateBoolean(value) {
  if (typeof value === "boolean") return value;
  if (["Y", "Д", "true"].includes(value)) return true;
  if (["N", "Н", "false"].includes(value)) return false;
  return false;
}

function setVisibleSafety(data, name, value) {
  const field = findField(data, name);
  if (field) {
    field.visible = value;
  }
}

function LPREV_LICENSE_handler(data) {
  const oneToManyBlocks = findField(data, "INSURED_LIST")?.value;

  if (Array.isArray(oneToManyBlocks)) {
    oneToManyBlocks.forEach((item) => {
      const fields = getDataFieldsAsArr(item, [
        "SPREV_SECONDNAME",
        "IDCOUNTRY_PREV",
        "SPREV_LICSERIA",
        "SPREV_LICNUMBER",
      ]);
      const LPREV_LICENSE = findField(item, "LPREV_LICENSE");

      setFieldsVisibleState(fields, getBoolean(LPREV_LICENSE.value));
    });
  }
}

export function eventHandler(data, item) {
  const copyData = JSON.parse(JSON.stringify(data));
  const INSURED_LIST = copyData.find((f) => f.name === "INSURED_LIST");
  const BMULTI = copyData.find(({ name }) => name === "BMULTI");

  if (item.value?.name === "INSURED_LIST" && item?.value?.value?.name === "LPREV_LICENSE") {
    const visible = item?.value?.value?.value === true;
    const dataSet = INSURED_LIST.value[item?.value?.index];

    prevFields.forEach((name) => {
      setVisibleSafety(dataSet, name, visible);
      if (!visible) {
        setNestedFieldState(dataSet, name, false);
      }
      if (visible) {
        setNestedFieldState(dataSet, name, true);
      }
    });
  }

  if (BMULTI?.value === true) {
    setVisibleSafety(copyData, "INSURED_LIST", false);
    setVisibleSafety(copyData, "SHELP_INFO", true);
  } else {
    setVisibleSafety(copyData, "INSURED_LIST", true);
    setVisibleSafety(copyData, "SHELP_INFO", false);
  }

  if (["DINSURED_BIRTHDATE", "DINSURED_STAGEDATE"].includes(item.value?.value?.name)) {
    const driverData = INSURED_LIST.value[item?.value?.index];
    validateDates(driverData);
  }

  if (item.name === "BMULTI") {
    if (item.value === true) {
      INSURED_LIST.value.forEach((item, index) => {
        const LPREV_LICENSE = findField(INSURED_LIST.value[index], "LPREV_LICENSE");
        LPREV_LICENSE.value = false;
        setReverseRequired(item);
        prevFields.forEach((fieldName) => {
          setVisibleSafety(item, fieldName, false);
          setNestedFieldState(item, fieldName, false);
        });
      });
    }
    if (item.value === false) {
      INSURED_LIST.value.forEach((item) => {
        setReverseUnRequired(item);
      });
    }
  }

  // + Добавить водителя
  if (item.action === "add") {
    const insuredIndex = INSURED_LIST.value.length - 1;
    const list = INSURED_LIST.value[insuredIndex];
    const country = findFieldInInsuredList(list, "IDCOUNTRY");

    handleCountryFields(
      INSURED_LIST,
      {
        value: country.value,
        insuredIndex,
      },
      "IDCOUNTRY"
    );
  }

  if (item.value?.value?.name === "IDCOUNTRY") {
    handleCountryFields(INSURED_LIST, item, "IDCOUNTRY");
  }

  if (item.value?.value?.name === "IDCOUNTRY_PREV") {
    handleCountryFields(INSURED_LIST, item, "IDCOUNTRY_PREV");
  }

  if (["SPREV_LICSERIA", "SPREV_LICNUMBER", "SSERIA_LICENSE", "SNUMBER_LICENSE"].includes(item.value?.value?.name)) {
    validateFormField(INSURED_LIST, item);
  }

  setNextButtonState(copyData);
  return copyData;
}

export function initHandler(data) {
  console.log("data: ", data);
  const copyData = JSON.parse(JSON.stringify(data));
  if (copyData[0]?.id !== "1093") return copyData;

  const INSURED_LIST = findField(copyData, "INSURED_LIST");

  if (!INSURED_LIST || !INSURED_LIST.value) return copyData;

  INSURED_LIST.value.forEach((itemList, insuredIndex) => {
    const LPREV_LICENSE = findField(itemList, "LPREV_LICENSE");
    const lprevChecked = validateBoolean(LPREV_LICENSE?.value);

    itemList.forEach((field) => {
      if (["SPREV_LICSERIA", "SPREV_LICNUMBER", "SSERIA_LICENSE", "SNUMBER_LICENSE"].includes(field.name)) {
        const fieldItem = {
          value: {
            value: field,
            index: insuredIndex,
          },
          insuredIndex,
        };

        validateFormField(INSURED_LIST, fieldItem);
      }
    });

    prevFields.forEach((fieldName) => {
      setVisibleSafety(itemList, fieldName, lprevChecked);
    });
  });

  LPREV_LICENSE_handler(copyData);

  scrollToCardHead(".wizard_osago");
  return copyData;
}
