import { scrollToCardHead } from "@/utils/scroll";
import { getDate } from "../helpers";
import {
  getBoolean,
  getCopyData,
  getDataFieldsAsArr,
  getDataFieldsAsObj,
  setProperty,
  isValidValue,
  setFieldsVisibleState,
} from "@/components/EventHandler/helpers/eventHandlerHelpers";
import { findField } from "@/components/EventHandler/helpers";

const RUSSIA_COUNTRY_CODE = 179; // Код России
const prevFields = ["SPREV_SECONDNAME", "IDCOUNTRY_PREV", "SPREV_LICSERIA", "SPREV_LICNUMBER"];
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

let isVisibleMulti = null;

function getFormFields(data, item) {
  return {
    field: item && data.find((f) => f.fieldId === item.fieldId),
    periods: findField(data, "BPERIODS"),
    dtoDateField: findField(data, "DTO_DATE"),
    dFromDateField: findField(data, "DFROM_DATE"),
    badd2: findField(data, "BADD_SECOND"),
    badd3: findField(data, "BADD_THIRD"),
    fromDateShort: findField(data, "DFROM_DATE_SHORT"),
    fromDateTemp: findField(data, "DFROM_DATE_TEMP"),
    toDateShort: findField(data, "DTO_DATE_SHORT"),
    toDateTemp: findField(data, "DTO_DATE_TEMP"),
    dfromDate1Field: findField(data, "DFROM_DATE1"),
    fromDate2Field: findField(data, "DFROM_DATE2"),
    fromDate3Field: findField(data, "DFROM_DATE3"),
    dtoDate1Field: findField(data, "DTO_DATE1"),
    toDate2Field: findField(data, "DTO_DATE2"),
    toDate3Field: findField(data, "DTO_DATE3"),
    validDateFieldNames: ["DFROM_DATE1", "DFROM_DATE2", "DFROM_DATE3", "DTO_DATE1", "DTO_DATE2", "DTO_DATE3"],
  };
}

function checkDatesSequence(comparisonFieldName, currentDate, comparisonFn, errorTargetField, data) {
  const comparisonField = findField(data, comparisonFieldName);
  if (!comparisonField || !comparisonField.value) return;

  const referenceDate = dateCreator(comparisonField.value);
  if (comparisonFn(currentDate, referenceDate)) {
    addFieldError(errorTargetField, "Сроки не последовательны");
  } else {
    deleteFieldError(errorTargetField);
  }
}

function checkPolicyDatesBorder(currentField, data, item) {
  const fields = getFormFields(data, item);
  const policyStartDate = dateCreator(fields.dFromDateField.value);
  const policyEndDate = dateCreator(fields.dtoDateField.value);
  const currentIndex = getIndex(item);
  const currentPeriodStartField = findField(data, `DFROM_DATE${currentIndex}`);
  const currentPeriodEndField = findField(data, `DTO_DATE${currentIndex}`);
  let isValid = true;

  deleteFieldError(currentField);
  if (currentPeriodStartField.value) {
    const currentPeriodStartDate = dateCreator(currentPeriodStartField.value);

    deleteFieldError(currentPeriodStartField);

    if (currentPeriodStartDate > policyEndDate || currentPeriodStartDate < policyStartDate) {
      addFieldError(currentPeriodStartField, "Дата вне границ полиса");
      isValid = false;
    }
  }

  if (currentPeriodEndField.value) {
    const currentPeriodEndDate = dateCreator(currentPeriodEndField.value);

    deleteFieldError(currentPeriodEndField);

    if (currentPeriodEndDate > policyEndDate || currentPeriodEndDate < policyStartDate) {
      addFieldError(currentPeriodEndField, "Дата вне границ полиса");
      isValid = false;
    }
  }

  return isValid;
}

function fieldsOff(fieldNames = [], data) {
  fieldNames.forEach((name) => {
    const disabledField = findField(data, name);
    if (!disabledField) return;
    disabledField.state = null;
    disabledField.visible = false;
    disabledField.value = name.startsWith("BADD_") ? false : null;
  });
}

function getIndex(item) {
  return parseInt(item.name.replace(/^\D+/g, ""), 10);
}

function validatePeriodsDates(data, item) {
  const fields = getFormFields(data, item);

  if (!fields.validDateFieldNames.includes(item.name)) return;
  const currentFieldDate = dateCreator(item.value);
  const currentIndex = getIndex(item);
  if (!checkPolicyDatesBorder(fields.field, data, item)) return;
  if (item.name.startsWith("DFROM_DATE") && currentIndex !== 1) {
    checkDatesSequence(`DTO_DATE${currentIndex - 1}`, currentFieldDate, (from, to) => from <= to, fields.field, data);
  }
  if (item.name.startsWith("DTO_DATE")) {
    const nextFROMDateField = findField(data, `DFROM_DATE${currentIndex + 1}`);
    checkDatesSequence(
      `DFROM_DATE${currentIndex + 1}`,
      currentFieldDate,
      (currentDate, nextFrom) => currentDate >= nextFrom,
      nextFROMDateField,
      data
    );
  }
}

function checkDateRange(policyFinalDate, periodEndDate, minRange = 0) {
  if (!policyFinalDate || !periodEndDate) {
    return false;
  }
  const finalDate = dateCreator(policyFinalDate);
  const periodDate = dateCreator(periodEndDate);

  const monthsDiff =
    (finalDate.getFullYear() - periodDate.getFullYear()) * 12 +
    (finalDate.getMonth() - periodDate.getMonth()) -
    (finalDate.getDate() < periodDate.getDate() ? 1 : 0);

  if (monthsDiff < minRange) {
    console.log(`Внимание! Разница между ${policyFinalDate} и ${periodEndDate} превышает 9 месяцев`);
    return false;
  }
  return true;
}

function addFieldError(targetField, errorText) {
  targetField.error = errorText;
  targetField.state = false;
}
function deleteFieldError(targetField) {
  targetField.error = null;
  targetField.state = true;
}

function addDays(date, days) {
  const newDate = new Date(date);

  newDate.setDate(newDate.getDate() + days);

  return newDate;
}

function addMonths(date, months) {
  const newDate = new Date(date);

  newDate.setMonth(newDate.getMonth() + months);

  return newDate;
}

function addFullYear(date, fullYear) {
  const newDate = new Date(date);

  newDate.setFullYear(newDate.getFullYear() + fullYear);

  return newDate;
}

function dateCreator(dateString = new Date().toLocaleDateString("ru-RU")) {
  if (!dateString) return;

  const [dateDay, dateMonth, dateYear] = dateString.split(".");
  return new Date(Number(dateYear), Number(dateMonth) - 1, Number(dateDay));
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function validatePolicyType2Dates(fromDate, toDate, toDateShortField) {
  const maxToDate = addDays(addMonths(fromDate, 3), -1);

  if (toDate < fromDate) {
    addFieldError(toDateShortField, "Дата окончания не может быть раньше даты начала");
  } else if (toDate > maxToDate) {
    addFieldError(toDateShortField, "Срок страхования от 1 дня до 3 месяцев");
  } else {
    deleteFieldError(toDateShortField);
  }
}

function validatePolicyType3Dates(fromDate, toDate, toDateTempField) {
  const minToDate = addDays(fromDate, 4);
  const maxToDate = addDays(fromDate, 19);

  if (toDate < fromDate) {
    addFieldError(toDateTempField, "Дата окончания не может быть раньше даты начала");
  } else if (toDate < minToDate || toDate > maxToDate) {
    addFieldError(toDateTempField, "Срок страхования от 5 до 20 дней");
  } else {
    deleteFieldError(toDateTempField);
  }
}

function getFieldValue(name, data) {
  return dateCreator(findField(data, name)?.value);
}
function setFieldValue(name, date, data) {
  findField(data, name).value = formatDate(date);
}

function periodsBlockReset(fromDateFieldDate, data) {
  const dfromDate1Field = findField(data, "DFROM_DATE1");
  const dtoDate1Field = findField(data, "DTO_DATE1");
  const badd2 = findField(data, "BADD_SECOND");

  // Устанавливаем даты для первого периода
  setFieldValue("DFROM_DATE1", fromDateFieldDate, data);
  dfromDate1Field.state = true;
  setFieldValue("DTO_DATE1", addMonths(addDays(fromDateFieldDate, -1), 3), data);
  dtoDate1Field.state = true;

  // Скрываем и очищаем второй и третий периоды
  fieldsOff([
    "SSECOND_PERIOD",
    "DFROM_DATE2",
    "DTO_DATE2",
    "BADD_THIRD",
    "STHIRD_PERIOD",
    "DFROM_DATE3",
    "DTO_DATE3",
  ], data);

  // Отжимаем чекбокс второго периода
  badd2.value = false;
}

function reverseRequire(dataSet, state) {
  dataSet.forEach((el) => {
    if (el.required === state && el.visible && !["EmptyBlock", "LPREV_LICENSE"].includes(el.name)) {
      el.required = !el.required;
    }
  });
}

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
  if (!isValidValueLength && item.value !== null && item.value !== undefined) {
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

function setNestedFieldState(data, name, state, errMessage, isRequired) {
  const field = findField(data, name);
  if (field) {
    field.state = state;
    field.error = errMessage;
    field.required = isRequired;
    // field.value = null;
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
        check: () => !dates.birth && fields.birth?.required,
        message: "Поле обязательно к заполнению",
      },
      {
        check: () => dates.birth && dates.birth.setHours(0, 0, 0, 0) > dates.current,
        message: "Дата рождения не может быть позже текущей даты",
      },
    ],
    stage: [
      {
        check: () => !dates.stage && fields.stage?.required,
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
    if (!field.value && field.value !== null) setFieldState(field, false, "Обязательно для заполнения");
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

function getProcedure(fieldName) {
  if (!handlers[fieldName]) {
    console.warn(`getProcedure. обработчик ${fieldName} не наеден`);

    return null;
  }

  return fieldsProcedure[fieldName];
}

/**
 *
 * @param {String} date - dd.mm.yyyy
 * @return {Date}
 */
function getDateFromStr(date) {
  let result = typeof date === "string" ? date.split(".") : null;

  result = result.length === 3 ? [Number(result[2]), Number(result[1] - 1), Number(result[0])] : null;

  return result ? new Date(...result) : null;
}

/**
 *
 * @param {Date} prevDate
 * @param {Date} nextDate
 * @return {boolean}
 */
function isNextDateMoreThanPrev(prevDate, nextDate) {
  return nextDate.setHours(0, 0, 0, 0) > prevDate.setHours(0, 0, 0, 0);
}

/**
 * @description Выполняет сравнение дат и управляет их стэйтом
 * @param {Object} data
 * @param {String} prevFieldName
 * @param {String} nextFieldName
 */
function comparePeriodBlockDates(data, prevFieldName, nextFieldName) {
  const nextField = findField(data, nextFieldName);
  const prevField = findField(data, prevFieldName);
  const nextDate = getDateFromStr(nextField.value);
  const prevDate = getDateFromStr(prevField?.value);

  setFieldState(nextField, true, null);

  if (!isNextDateMoreThanPrev(prevDate, nextDate)) {
    setFieldState(nextField, false, "Дата начала должна быть позже даты заключения на 1 день");
  }
}

/**
 * @description Проверяет что дата начала не превышает максимально допустимую границу (createDate + 90 дней)
 * @param {Object} targetField - поле, на которое навешивается ошибка
 * @param {Date} createDate - дата заключения (DCALC_DATE)
 * @param {Date} fromDate - дата начала срока страхования
 */
function validateFromDateMaxBorder(targetField, createDate, fromDate) {
  const maxFromDate = addDays(createDate, 90);

  if (fromDate > maxFromDate) {
    addFieldError(
      targetField,
      `Укажите дату начала срока страхования не позднее ${formatDate(maxFromDate)}`
    );
  }
}

/**
 * @description Справочник обработчиков для отдельных полей
 */
const handlers = {
  commonDriversInitHandler(data) {
    const DRIVERS_LIST_EDIT = findField(data, "DRIVERS_LIST_EDIT");

    if (!DRIVERS_LIST_EDIT || !DRIVERS_LIST_EDIT.value) {
      return data;
    }

    DRIVERS_LIST_EDIT.value.forEach((itemList, insuredIndex) => {
      const LPREV_LICENSE = findField(itemList, "LPREV_LICENSE");
      const lprevChecked = getBoolean(LPREV_LICENSE?.value);

      itemList.forEach((field) => {
        if (["SPREV_LICSERIA", "SPREV_LICNUMBER", "SSERIA_LICENSE", "SNUMBER_LICENSE"].includes(field.name)) {
          const fieldItem = {
            value: {
              value: field,
              index: insuredIndex,
            },
            insuredIndex,
          };

          validateFormField(DRIVERS_LIST_EDIT, fieldItem);
        }
      });
    });

    scrollToCardHead();
    return data;
  },
  commonDriversEventHandler(copyData, item) {
    // Сейчас этот хэндлер должен реагировать только на поля из блока Водители
    const allowHandlerFields = [83811, 84062];
    const DRIVERS_LIST_EDIT = copyData.find((f) => f.name === "DRIVERS_LIST_EDIT");
    const BMULTI = copyData.find(({ name }) => name === "BMULTI");

    if (!allowHandlerFields.includes(item.fieldId)) {
      return;
    }

    const multiDrivers = BMULTI?.value === true;
    setFieldsVisibleState(
      copyData?.filter((item) => item.name === "DRIVERS_LIST_EDIT"),
      !multiDrivers
    );
    setFieldsVisibleState(
      copyData?.filter((item) => item.name === "SHELP_INFO"),
      multiDrivers
    );

    if (["DINSURED_BIRTHDATE", "DINSURED_STAGEDATE"].includes(item.value?.value?.name)) {
      const driverData = DRIVERS_LIST_EDIT.value[item?.value?.index];
      validateDates(driverData);
    }

    if (item.name === "BMULTI") {
      if (item.value === true) {
        DRIVERS_LIST_EDIT.value.forEach((item) => {
          reverseRequire(item, true);

          prevFields.forEach((fieldName) => {
            setFieldsVisibleState(
              item?.filter((item) => item.name === fieldName),
              false
            );
            setNestedFieldState(item, fieldName, null, null, false);
          });
        });
      }
      if (item.value === false) {
        DRIVERS_LIST_EDIT.value.forEach((item, index) => {
          reverseRequire(item, false);
        });
      }
    }

    // + Добавить водителя
    if (item.action === "add") {
      const insuredIndex = DRIVERS_LIST_EDIT.value.length - 1;
      const list = DRIVERS_LIST_EDIT.value[insuredIndex];
      const country = findFieldInInsuredList(list, "IDCOUNTRY");

      handleCountryFields(
        DRIVERS_LIST_EDIT,
        {
          value: country.value,
          insuredIndex,
        },
        "IDCOUNTRY"
      );
    }

    if (item.value?.value?.name === "IDCOUNTRY") {
      handleCountryFields(DRIVERS_LIST_EDIT, item, "IDCOUNTRY");
    }

    if (item.value?.value?.name === "IDCOUNTRY_PREV") {
      handleCountryFields(DRIVERS_LIST_EDIT, item, "IDCOUNTRY_PREV");
    }

    if (["SPREV_LICSERIA", "SPREV_LICNUMBER", "SSERIA_LICENSE", "SNUMBER_LICENSE"].includes(item.value?.value?.name)) {
      validateFormField(DRIVERS_LIST_EDIT, item);
    }

    return copyData;
  },

  /**
   * @description Водители -> Изменить данные
   * @param {object} data
   * @param {object} [item]
   */
  SEDIT_DRIVERS: (data, item) => {
    const arrFields = ["DRIVERS_LIST", "SMULTI", "DRIVERS_LIST_EDIT", "BMULTI", "DRIVERS_LIST_EDIT", "BMULTI"];
    const fields = getDataFieldsAsObj(data, arrFields);
    const itemValue = item?.value ?? findField(data, "SEDIT_DRIVERS")?.value ?? false;

    setProperty(fields["DRIVERS_LIST"], "visible", !itemValue);
    isVisibleMulti ? setProperty(fields["SMULTI"], "visible", !itemValue) : null;
    setProperty(fields["DRIVERS_LIST_EDIT"], "visible", itemValue);
    setProperty(fields["BMULTI"], "visible", itemValue);

    handlers.SMULTI(data);
  },

  /**
   * @description Водители -> Указать предыдущее водительское удостоверение
   * @param {object} data
   * @param {object} [item] - необязательный параметр. Если не передан то будут обрабатываться все экземпляры OneToMany
   */
  LPREV_LICENSE: (data, item) => {
    const oneToManyValue = findField(data, "DRIVERS_LIST_EDIT")?.value;
    const itemValue = item?.value?.value?.value ?? item?.value;
    const oneToManyIndex = item?.value?.index ?? -1;
    const formsData = oneToManyIndex > -1 ? [oneToManyValue[oneToManyIndex]] : oneToManyValue;

    formsData.forEach((form) => {
      const formFields = ["SPREV_SECONDNAME", "IDCOUNTRY_PREV", "SPREV_LICSERIA", "SPREV_LICNUMBER"];
      const fieldsData = getDataFieldsAsArr(form, formFields);
      const LPREV_LICENSE_VALUE = itemValue ?? findField(form, "LPREV_LICENSE")?.value;

      setProperty(fieldsData, "visible", getBoolean(LPREV_LICENSE_VALUE));
    });
  },

  /**
   * @description Водители -> Мультидрайв (Без ограничения по количеству водителей)
   * @param {object} data
   * @param {object} [item]
   */
  BMULTI: (data, item) => {
    const BMULTI_VALUE = item?.value ?? findField(data, "BMULTI")?.value;
    const SEDIT_DRIVERS_VALUE = findField(data, "SEDIT_DRIVERS")?.value;
    const DRIVERS_LIST_EDIT_FIELD = findField(data, "DRIVERS_LIST_EDIT");
    const itemValue = getBoolean(BMULTI_VALUE);

    setProperty(DRIVERS_LIST_EDIT_FIELD, "visible", !itemValue && SEDIT_DRIVERS_VALUE);

    handlers.SMULTI(data);
  },
  /**
   * @description Водители -> Мультидрайв (Без ограничения по количеству водителей)
   * @param {object} data
   */
  SMULTI: (data) => {
    const SMULTI_FIELD = findField(data, "SMULTI");
    const SEDIT_DRIVERS_FIELD = findField(data, "SEDIT_DRIVERS");

    if (!SMULTI_FIELD) return;

    const isEdit = SEDIT_DRIVERS_FIELD?.value === true;

    setProperty(SMULTI_FIELD, "visible", SMULTI_FIELD.visible && !isEdit);
  },

  add: (data) => {
    const DRIVERS_LIST_EDIT_FORM = findField(data, "DRIVERS_LIST_EDIT")?.value;

    if (DRIVERS_LIST_EDIT_FORM?.length) {
      handlers.LPREV_LICENSE(data);
    }
  },

  SEDIT_AUTO(data, item) {
    const SEDIT_AUTO_VALUE = findField(data, "SEDIT_AUTO")?.value;
    const itemValue = item?.value ?? SEDIT_AUTO_VALUE ?? false;
    const SDOC_DATA_EDIT = findField(data, "SDOC_DATA_EDIT");
    const SVEHEPTS_EDIT = findField(data, "SVEHEPTS_EDIT");
    const firstGroupFields = getDataFieldsAsArr(data, [
      "SREGNUM",
      "SDOC_DATA",
      "DDOC_FROM",
      "SDOC_COUNTRY",
      "SAUTO_USE",
      "BUSE_TRAILER",
    ]);
    const secondGroupFields = getDataFieldsAsArr(data, [
      "SREGNUM_EDIT",
      "IDVEHDOCTYPE",
      "DDOC_FROM_EDIT",
      "IDCOUNTRYDOC",
      "IDTARGET",
      "BUSED_TRAILER_EDIT",
      "SHELP_INFO_1",
    ]);

    setProperty(SDOC_DATA_EDIT, "visible", itemValue && isValidValue(SDOC_DATA_EDIT.value));
    setProperty(SVEHEPTS_EDIT, "visible", itemValue && isValidValue(SVEHEPTS_EDIT.value));

    setProperty(firstGroupFields, "visible", !itemValue);
    setProperty(secondGroupFields, "visible", itemValue);
  },

  SEDIT_PERIODS(data, item) {
    const SEDIT_PERIODS_VALUE = findField(data, "SEDIT_PERIODS")?.value;
    const itemValue = item?.value ?? SEDIT_PERIODS_VALUE ?? false;
    const firstGroupFields = getDataFieldsAsArr(data, ["DPERIOD_INSURANCE", "DPERIOD_1", "DPERIOD_2", "DPERIOD_3"]);
    const secondGroupFields = getDataFieldsAsArr(data, ["DCALC_DATE", "BPERIODS"]);
    const someFields = getDataFieldsAsArr(data, [
      "DFROM_DATE",
      "DTO_DATE",
      "DFROM_DATE_SHORT",
      "DTO_DATE_SHORT",
      "DFROM_DATE_TEMP",
      "DTO_DATE_TEMP",
    ]);

    someFields.forEach((field) => setProperty(field, "visible", isValidValue(field?.value) && itemValue));
    setProperty(firstGroupFields, "visible", !itemValue);
    setProperty(secondGroupFields, "visible", itemValue);
  },

  BPERIODS(data, item) {
    const BPERIODS_VALUE = findField(data, "BPERIODS")?.value;
    const itemValue = item?.value ?? BPERIODS_VALUE ?? false;
    const SEDIT_PERIODS_VALUE = findField(data, "SEDIT_PERIODS")?.value;
    const visibleState = getBoolean(itemValue) && getBoolean(BPERIODS_VALUE) && getBoolean(SEDIT_PERIODS_VALUE);
    const fields = getDataFieldsAsArr(data, ["DFROM_DATE1", "DTO_DATE1", "BADD_SECOND", "BADD_THIRD"]);
    const dfromDate1Field = findField(data, "DFROM_DATE1");
    const dtoDate1Field = findField(data, "DTO_DATE1");

    setProperty(fields, "visible", visibleState);

    // Автоматическая установка дат при включении BPERIODS
    if (visibleState) {
      const fromDate = getFieldValue("DFROM_DATE", data);
      if (fromDate) {
        setFieldValue("DFROM_DATE1", fromDate, data);
        setFieldValue("DTO_DATE1", addMonths(addDays(fromDate, -1), 3), data);
        deleteFieldError(dfromDate1Field);
        deleteFieldError(dtoDate1Field);
      }
    }
  },

  BADD_SECOND(data, item) {
    const BPERIODS_VALUE = findField(data, "BPERIODS")?.value;
    const SEDIT_PERIODS_VALUE = findField(data, "SEDIT_PERIODS")?.value;
    const BADD_SECOND_VALUE = findField(data, "BADD_SECOND")?.value;
    const itemValue = item?.value ?? BADD_SECOND_VALUE ?? false;
    const visibleState = getBoolean(itemValue) && getBoolean(BPERIODS_VALUE) && getBoolean(SEDIT_PERIODS_VALUE);
    const fields = getDataFieldsAsArr(data, ["SSECOND_PERIOD", "DFROM_DATE2", "DTO_DATE2", "BADD_THIRD"]);

    setProperty(fields, "visible", visibleState);

    if (!visibleState) {
      fieldsOff([
        "SSECOND_PERIOD",
        "DFROM_DATE2",
        "DTO_DATE2",
        "BADD_THIRD",
        "STHIRD_PERIOD",
        "DFROM_DATE3",
        "DTO_DATE3",
      ], data);
    }
  },

  BADD_THIRD(data, item) {
    const BPERIODS_VALUE = findField(data, "BPERIODS")?.value;
    const BADD_THIRD_VALUE = findField(data, "BADD_THIRD")?.value;
    const SEDIT_PERIODS_VALUE = findField(data, "SEDIT_PERIODS")?.value;
    const itemValue = item?.value ?? BADD_THIRD_VALUE ?? false;
    const visibleState = getBoolean(itemValue) && getBoolean(BPERIODS_VALUE) && getBoolean(SEDIT_PERIODS_VALUE);
    const fields = getDataFieldsAsArr(data, ["STHIRD_PERIOD", "DFROM_DATE3", "DTO_DATE3"]);

    setProperty(fields, "visible", visibleState);

    if (!visibleState) {
      fieldsOff(["STHIRD_PERIOD", "DFROM_DATE3", "DTO_DATE3"], data);
    }
  },

  DFROM_DATE(data, item) {
    const dFromDateField = findField(data, "DFROM_DATE");
    const bPeriodsField = findField(data, "BPERIODS");
    const createDate = getFieldValue("DCALC_DATE", data);
    const fromDate = getFieldValue("DFROM_DATE", data);

    if (fromDate) {
      setFieldValue("DTO_DATE", addFullYear(addDays(fromDate, -1), 1), data);
    }

    comparePeriodBlockDates(data, "DCALC_DATE", "DFROM_DATE");

    // Если минимальная граница пройдена — проверяем максимальную (createDate + 90 дней)
    if (createDate && fromDate && fromDate > createDate) {
      validateFromDateMaxBorder(dFromDateField, createDate, fromDate);
    }

    // Если периоды включены — сбрасываем их при изменении даты начала
    if (fromDate && bPeriodsField?.value === true) {
      periodsBlockReset(fromDate, data);
    }
  },

  DFROM_DATE_SHORT(data, item) {
    const fromDateShortField = findField(data, "DFROM_DATE_SHORT");
    const toDateShortField = findField(data, "DTO_DATE_SHORT");
    const createDate = getFieldValue("DCALC_DATE", data);
    const fromDate = getFieldValue("DFROM_DATE_SHORT", data);

    if (fromDate) {
      setFieldValue("DTO_DATE_SHORT", addDays(addMonths(fromDate, 3), -1), data);
    }

    comparePeriodBlockDates(data, "DCALC_DATE", "DFROM_DATE_SHORT");

    if (createDate && fromDate && fromDate > createDate) {
      validateFromDateMaxBorder(fromDateShortField, createDate, fromDate);
    }

    // Валидация границ для короткого полиса (1-3 месяца)
    if (fromDate && toDateShortField.value) {
      const toDate = getFieldValue("DTO_DATE_SHORT", data);
      validatePolicyType2Dates(fromDate, toDate, toDateShortField);
    }
  },

  DFROM_DATE_TEMP(data, item) {
    const fromDateTempField = findField(data, "DFROM_DATE_TEMP");
    const toDateTempField = findField(data, "DTO_DATE_TEMP");
    const createDate = getFieldValue("DCALC_DATE", data);
    const fromDate = getFieldValue("DFROM_DATE_TEMP", data);

    if (fromDate) {
      setFieldValue("DTO_DATE_TEMP", addDays(fromDate, 19), data);
    }

    comparePeriodBlockDates(data, "DCALC_DATE", "DFROM_DATE_TEMP");

    if (createDate && fromDate && fromDate > createDate) {
      validateFromDateMaxBorder(fromDateTempField, createDate, fromDate);
    }

    // Валидация границ для временного полиса (5-20 дней)
    if (fromDate && toDateTempField.value) {
      const toDate = getFieldValue("DTO_DATE_TEMP", data);
      validatePolicyType3Dates(fromDate, toDate, toDateTempField);
    }
  },

  DTO_DATE_SHORT(data, item) {
    const fromDateShortField = findField(data, "DFROM_DATE_SHORT");
    const toDateShortField = findField(data, "DTO_DATE_SHORT");
    const fromDate = getFieldValue("DFROM_DATE_SHORT", data);
    const toDate = getFieldValue("DTO_DATE_SHORT", data);

    if (fromDate && toDate) {
      validatePolicyType2Dates(fromDate, toDate, toDateShortField);
    }
  },

  DTO_DATE_TEMP(data, item) {
    const fromDateTempField = findField(data, "DFROM_DATE_TEMP");
    const toDateTempField = findField(data, "DTO_DATE_TEMP");
    const fromDate = getFieldValue("DFROM_DATE_TEMP", data);
    const toDate = getFieldValue("DTO_DATE_TEMP", data);

    if (fromDate && toDate) {
      validatePolicyType3Dates(fromDate, toDate, toDateTempField);
    }
  },

  DFROM_DATE1(data, item) {
    const fields = getFormFields(data, item);

    if (item.value) {
      const dfromDate1Plus3M = addMonths(getFieldValue("DFROM_DATE1", data), 3);
      const dfromDate1Plus9M = addMonths(getFieldValue("DFROM_DATE1", data), 9);
      const toDate1Plus1D = addDays(getFieldValue("DTO_DATE1", data), 1);

      if (fields.dtoDate1Field.value) {
        if (toDate1Plus1D < dfromDate1Plus3M) {
          addFieldError(fields.dtoDate1Field, "Срок не менее 3 месяцев");
        } else if (!checkDateRange(fields.dtoDateField.value, fields.dtoDate1Field.value, 3)) {
          fieldsOff(["BADD_SECOND", "SSECOND_PERIOD", "DFROM_DATE2", "DTO_DATE2",
            "BADD_THIRD", "STHIRD_PERIOD", "DFROM_DATE3", "DTO_DATE3"], data);
        } else if (
          !checkDateRange(fields.dtoDateField.value, fields.toDate2Field.value, 3) &&
          fields.toDate2Field.value
        ) {
          fieldsOff(["BADD_THIRD", "STHIRD_PERIOD", "DFROM_DATE3", "DTO_DATE3"], data);
        } else {
          deleteFieldError(fields.dtoDate1Field);
          validatePeriodsDates(data, fields.dfromDate1Field);
        }

        if (dfromDate1Plus9M < toDate1Plus1D) {
          fieldsOff([
            "SSECOND_PERIOD",
            "STHIRD_PERIOD",
            "BADD_SECOND",
            "BADD_THIRD",
            "DFROM_DATE2",
            "DTO_DATE2",
            "DFROM_DATE3",
            "DTO_DATE3",
          ], data);
        }
      }
      validatePeriodsDates(data, fields.dfromDate1Field);
    }
  },

  DFROM_DATE2(data, item) {
    const fields = getFormFields(data, item);

    if (item.value) {
      const fromDate2Plus3M = addMonths(getFieldValue("DFROM_DATE2", data), 3);
      if (fields.toDate2Field.value) {
        const toDate2Plus1D = addDays(getFieldValue("DTO_DATE2", data), 1);
        if (toDate2Plus1D < fromDate2Plus3M) {
          addFieldError(fields.toDate2Field, "Срок не менее 3 месяцев");
        } else {
          deleteFieldError(fields.toDate2Field);
        }
      }
    }
    validatePeriodsDates(data, fields.fromDate2Field);
  },

  DFROM_DATE3(data, item) {
    handlers["DTO_DATE3"](data, item);
  },

  DTO_DATE1(data, item) {
    if (item.value) {
      const fields = getFormFields(data, item);
      const toDate1Minus4MPlus2D = addMonths(addDays(getFieldValue("DTO_DATE1", data), 2), -3);
      const toDate1Minus9MPlus2D = addMonths(addDays(getFieldValue("DTO_DATE1", data), 2), -9);
      const fromDate1Plus1D = addDays(getFieldValue("DFROM_DATE1", data), 1);

      if (fields.dfromDate1Field.value) {
        if (!checkDateRange(fields.dtoDateField.value, fields.dtoDate1Field.value, 3)) {
          fieldsOff(["BADD_SECOND", "SSECOND_PERIOD", "DFROM_DATE2", "DTO_DATE2",
            "BADD_THIRD", "STHIRD_PERIOD", "DFROM_DATE3", "DTO_DATE3"], data);
        }
        if (toDate1Minus4MPlus2D < fromDate1Plus1D) {
          addFieldError(fields.field, "Срок не менее 3 месяцев");
        } else {
          deleteFieldError(fields.field);
          validatePeriodsDates(data, fields.dtoDate1Field);
        }
      }

      if ((toDate1Minus9MPlus2D > fromDate1Plus1D)  || !fields.periods.value) {
        fieldsOff(
          [
            "SSECOND_PERIOD",
            "STHIRD_PERIOD",
            "BADD_SECOND",
            "BADD_THIRD",
            "DFROM_DATE2",
            "DTO_DATE2",
            "DFROM_DATE3",
            "DTO_DATE3",
          ],
          data
        );
      } else if (checkDateRange(fields.dtoDateField.value, fields.dtoDate1Field.value, 3)) {
        fields.badd2.visible = true;
      }
    }
  },

  DTO_DATE2(data, item) {
    const fields = getFormFields(data, item);

    if (item.value) {
      const toDate2Minus3MPlus2D = addMonths(addDays(getFieldValue("DTO_DATE2", data), 2), -3);
      const toDate2Minus9MPlus2D = addMonths(addDays(getFieldValue("DTO_DATE2", data), 2), -9);
      const fromDatePlus1D = addDays(getFieldValue("DFROM_DATE", data), 1);

      if (fields.fromDate2Field.value) {
        const fromDate2Plus1D = addDays(getFieldValue("DFROM_DATE2", data), 1);
        if (!checkDateRange(fields.dtoDateField.value, fields.toDate2Field.value, 3)) {
          fieldsOff(["BADD_THIRD", "STHIRD_PERIOD", "DFROM_DATE3", "DTO_DATE3"], data);
        }
        if (toDate2Minus3MPlus2D < fromDate2Plus1D) {
          addFieldError(fields.field, "Срок не менее 3 месяцев");
        } else {
          deleteFieldError(fields.field);
          validatePeriodsDates(data, fields.toDate2Field);
        }
      }

      if (toDate2Minus9MPlus2D > fromDatePlus1D) {
        fieldsOff(["STHIRD_PERIOD", "BADD_THIRD", "DFROM_DATE3", "DTO_DATE3"], data);
      } else if (checkDateRange(fields.dtoDateField.value, fields.toDate2Field.value, 3)) {
        fields.badd3.visible = true;
      } else {
        fieldsOff(["BADD_THIRD", "STHIRD_PERIOD", "DFROM_DATE3", "DTO_DATE3"], data);
      }
    }
  },

  DTO_DATE3(data, item) {
    const fields = getFormFields(data, item);

    if (item.value) {
      validatePeriodsDates(data, fields.toDate3Field);
      if (fields.fromDate3Field.value && fields.toDate3Field.value) {
        const toDate3 = getFieldValue("DTO_DATE3", data);
        const fromDate3Plus3M = addMonths(addDays(getFieldValue("DFROM_DATE3", data), -1), 3);

        if (toDate3 < fromDate3Plus3M) {
          addFieldError(fields.field, "Срок не менее 3 месяцев");
        } else {
          deleteFieldError(findField(data, "DFROM_DATE3"));
          deleteFieldError(findField(data, "DTO_DATE3"));
          validatePeriodsDates(data, fields.toDate3Field);
        }
      }
    }
  },
};

const fieldsProcedure = {
  SEDIT_DRIVERS(data, item) {
    handlers["SEDIT_DRIVERS"](data, item);
    handlers["BMULTI"](data);
    handlers["LPREV_LICENSE"](data);
    handlers["SMULTI"](data);
  },

  LPREV_LICENSE(data, item) {
    handlers["LPREV_LICENSE"](data, item);
  },

  BMULTI(data, item) {
    handlers["BMULTI"](data, item);
    handlers["LPREV_LICENSE"](data);
    handlers["SMULTI"](data);
  },

  SMULTI(data, item) {
    handlers["SMULTI"](data);
  },

  add(data, item) {
    handlers["add"](data, item);
  },

  SEDIT_AUTO(data, item) {
    handlers["SEDIT_AUTO"](data, item);
  },

  SEDIT_PERIODS(data, item) {
    handlers["SEDIT_PERIODS"](data, item);
    handlers["BPERIODS"](data);
    handlers["BADD_SECOND"](data);
    handlers["BADD_THIRD"](data);
    handlers["DTO_DATE1"](data, item);
    handlers["DTO_DATE2"](data, item);
  },

  BPERIODS(data, item) {
    handlers["BPERIODS"](data, item);
    handlers["BADD_SECOND"](data);
    handlers["BADD_THIRD"](data);
    handlers["DTO_DATE1"](data, item);
    handlers["DTO_DATE2"](data, item);
  },

  BADD_SECOND(data, item) {
    handlers["BADD_SECOND"](data, item);
    handlers["BADD_THIRD"](data);
    handlers["DTO_DATE1"](data, item);
    handlers["DTO_DATE2"](data, item);
  },

  BADD_THIRD(data, item) {
    handlers["BADD_THIRD"](data, item);
    handlers["DTO_DATE2"](data, item);
  },

  DFROM_DATE(data, item) {
    handlers["DFROM_DATE"](data, item);
  },

  DFROM_DATE_SHORT(data, item) {
    handlers["DFROM_DATE_SHORT"](data, item);
  },

  DFROM_DATE_TEMP(data, item) {
    handlers["DFROM_DATE_TEMP"](data, item);
  },

  DTO_DATE_SHORT(data, item) {
    handlers["DTO_DATE_SHORT"](data, item);
  },

  DTO_DATE_TEMP(data, item) {
    handlers["DTO_DATE_TEMP"](data, item);
  },

  DTO_DATE1(data, item) {
    handlers["DTO_DATE1"](data, item);
  },
  DTO_DATE2(data, item) {
    handlers["DTO_DATE2"](data, item);
  },
  DTO_DATE3(data, item) {
    handlers["DTO_DATE3"](data, item);
  },
  DFROM_DATE1(data, item) {
    handlers["DFROM_DATE1"](data, item);
  },
  DFROM_DATE2(data, item) {
    handlers["DFROM_DATE2"](data, item);
  },
  DFROM_DATE3(data, item) {
    handlers["DFROM_DATE3"](data, item);
  },
};

export function eventHandler(data, item) {
  const copyData = getCopyData(data);
  const itemFieldName = item?.name ?? item?.value?.value?.name;
  const { action } = item;
  const SEDIT_DRIVERS_FIELD = findField(copyData, "SEDIT_DRIVERS");

  handlers.commonDriversEventHandler(copyData, item);
  getProcedure(itemFieldName ?? action)?.(copyData, item ?? SEDIT_DRIVERS_FIELD);

  return copyData;
}

export function initHandler(data) {
  const copyData = getCopyData(data);
  isVisibleMulti = data.find((el) => el.name === "SMULTI").visible;
  scrollToCardHead(".wizard-progress-bar");

  return copyData;
}
