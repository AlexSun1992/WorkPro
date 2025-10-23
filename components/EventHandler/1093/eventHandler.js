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
    if (!numberField.value) setFieldState(numberField, false, "Обязательно для заполнения");
    config.numberValidator(insuredList, { ...numberField, insuredIndex });
  }
}

function isFormValid(insuredList) {
  return insuredList?.value.every((list) => list.every((item) => item.visible !== true || item.state !== false));
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
  if ("value" in item && !isValidValueLength) {
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
  const modifyMinDate = minDate.setFullYear(minDate.getFullYear() + years);

  return maxDate >= modifyMinDate;
}

function getDate(str) {
  const splitSrt = str?.split(".");

  if (Array.isArray(splitSrt) && splitSrt.length === 3) {
    return new Date(splitSrt.reverse());
  }

  return null;
}

function setNestedFieldState(data, name, state, errMessage, isRequired) {
  const field = findField(data, name);
  if (field) {
    field.state = state;
    field.error = errMessage;
    field.required = isRequired;
    delete field.value;
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

function validateDates(insuredList, item) {
  const list = insuredList.value[item.insuredIndex];
  const DINSURED_STAGEDATE = findFieldInInsuredList(list, "DINSURED_STAGEDATE");
  const DINSURED_BIRTHDATE = findFieldInInsuredList(list, "DINSURED_BIRTHDATE");
  const stageDate = getDate(DINSURED_STAGEDATE?.value);
  const birthDate = getDate(DINSURED_BIRTHDATE?.value);
  const temp = new Date();
  const currentDate = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
  let fieldsBaseState = true;

  if (!stageDate && DINSURED_STAGEDATE?.required) {
    setFieldState(DINSURED_STAGEDATE, false, "Поле обязательно к заполнению");
    fieldsBaseState = false;
  }
  if (!birthDate && DINSURED_BIRTHDATE?.required) {
    setFieldState(DINSURED_BIRTHDATE, false, "Поле обязательно к заполнению");
    fieldsBaseState = false;
  }
  if (stageDate && currentDate < stageDate) {
    setFieldState(DINSURED_STAGEDATE, false, "Дата начала стажа не может быть позже текущей даты");
    fieldsBaseState = false;
  }
  if (birthDate && currentDate < birthDate) {
    setFieldState(DINSURED_BIRTHDATE, false, "Дата рождения не может быть позже текущей даты");
    fieldsBaseState = false;
  }
  if (fieldsBaseState && (!stageDate || !birthDate)) {
    setFieldState(DINSURED_STAGEDATE, true, null);
    setFieldState(DINSURED_BIRTHDATE, true, null);
  } else if (birthDate && stageDate && !isDatesLatestThenSomeYears(birthDate, stageDate, 16)) {
    setFieldState(DINSURED_STAGEDATE, false, "Дата начала стажа не может быть раньше 16 лет");
  } else {
    setFieldState(DINSURED_STAGEDATE, true, null);
    setFieldState(DINSURED_BIRTHDATE, true, null);
  }
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
    if (field.value === undefined) setFieldState(field, null, null);
    if ("value" in field && !field.value) setFieldState(field, false, "Обязательно для заполнения");
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
    if (field.value === undefined) setFieldState(field, null, null);
    if ("value" in field && !field.value) setFieldState(field, false, "Обязательно для заполнения");
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

function scrollToCardHead() {
  const selector = ".wizard_osago";

  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        setNestedFieldState(dataSet, name, null, null, false);
      }
      if (visible) {
        setNestedFieldState(dataSet, name, null, null, true);
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

  if (item.name === "BMULTI") {
    if (item.value === true) {
      INSURED_LIST.value.forEach((item, index) => {
        const LPREV_LICENSE = findField(INSURED_LIST.value[index], "LPREV_LICENSE");
        LPREV_LICENSE.value = false;
        setReverseRequired(item);
        prevFields.forEach((fieldName) => {
          setVisibleSafety(item, fieldName, false);
          setNestedFieldState(item, fieldName, null, null, false);
        });
      });
    }
    if (item.value === false) {
      INSURED_LIST.value.forEach((item, index) => {
        setReverseUnRequired(item);
      });
    }
  }

  //+ Добавить водителя
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
  if (data[0]?.id !== "1093") return data;

  const INSURED_LIST = findField(data, "INSURED_LIST");

  if (!INSURED_LIST || !INSURED_LIST.value) return data;

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
          insuredIndex: insuredIndex,
        };

        validateFormField(INSURED_LIST, fieldItem);
      }
    });

    prevFields.forEach((fieldName) => {
      setVisibleSafety(itemList, fieldName, lprevChecked);
    });
  });

  scrollToCardHead();
  return data;
}
