import { scrollToCardHead } from "@/utils/scroll";
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

function reverseRequire(dataSet, state) {
  dataSet.forEach((el) => {
    if (el.required === state && el.visible && !["EmptyBlock", "LPREV_LICENSE"].includes(el.name)) {
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
  setFieldsVisibleState(
    copyData?.filter((item) => item.name === "Continue"),
    true
  );
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

function getDate(str) {
  const splitSrt = str?.split(".");

  if (Array.isArray(splitSrt) && splitSrt.length === 3) {
    return new Date(splitSrt.reverse().join("-"));
  }

  return null;
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

      prevFields.forEach((fieldName) => {
        setFieldsVisibleState(
          itemList?.filter((item) => item.name === fieldName),
          true
        );
      });
    });

    scrollToCardHead();
    return data;
  },
  commonDriversEventHandler(copyData, item) {
    // Сейчас этот хэндлер должен реагировать только на поля из блока Водители
    const allowHandlerFields = [
      83811,
      84062
    ];
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

    setNextButtonState(copyData);
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
    setProperty(fields["SMULTI"], "visible", !itemValue);
    setProperty(fields["DRIVERS_LIST_EDIT"], "visible", itemValue);
    setProperty(fields["BMULTI"], "visible", itemValue);
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

    someFields.forEach((item) => setProperty(item, "visible", isValidValue(item?.value) && itemValue));

    setProperty(firstGroupFields, "visible", !itemValue);
    setProperty(secondGroupFields, "visible", itemValue);
  },

  BPERIODS(data, item) {
    const BPERIODS_VALUE = findField(data, "BPERIODS")?.value;
    const NOSAGO_TYPE_VALUE = Number(findField(data, "NOSAGO_TYPE")?.value);
    const itemValue = item?.value ?? BPERIODS_VALUE ?? false;
    const SEDIT_PERIODS_VALUE = findField(data, "SEDIT_PERIODS")?.value;
    const visibleState =
      getBoolean(itemValue) && getBoolean(BPERIODS_VALUE) && getBoolean(SEDIT_PERIODS_VALUE) && NOSAGO_TYPE_VALUE === 1;
    const fields = getDataFieldsAsArr(data, ["DFROM_DATE1", "DTO_DATE1", "BADD_SECOND"]);

    setProperty(fields, "visible", visibleState);
  },

  BADD_SECOND(data, item) {
    const NOSAGO_TYPE_VALUE = Number(findField(data, "NOSAGO_TYPE")?.value);
    const BPERIODS_VALUE = findField(data, "BPERIODS")?.value;
    const SEDIT_PERIODS_VALUE = findField(data, "SEDIT_PERIODS")?.value;
    const BADD_SECOND_VALUE = findField(data, "BADD_SECOND")?.value;
    const itemValue = item?.value ?? BADD_SECOND_VALUE ?? false;
    const visibleState =
      getBoolean(itemValue) && getBoolean(BPERIODS_VALUE) && getBoolean(SEDIT_PERIODS_VALUE) && NOSAGO_TYPE_VALUE === 1;
    const fields = getDataFieldsAsArr(data, ["SSECOND_PERIOD", "DFROM_DATE2", "DTO_DATE2", "BADD_THIRD"]);

    setProperty(fields, "visible", visibleState);
  },

  BADD_THIRD(data, item) {
    const NOSAGO_TYPE_VALUE = Number(findField(data, "NOSAGO_TYPE")?.value);
    const BPERIODS_VALUE = findField(data, "BPERIODS")?.value;
    const BADD_THIRD_VALUE = findField(data, "BADD_THIRD")?.value;
    const SEDIT_PERIODS_VALUE = findField(data, "SEDIT_PERIODS")?.value;
    const itemValue = item?.value ?? BADD_THIRD_VALUE ?? false;
    const visibleState =
      getBoolean(itemValue) && getBoolean(BPERIODS_VALUE) && getBoolean(SEDIT_PERIODS_VALUE) && NOSAGO_TYPE_VALUE === 1;
    const fields = getDataFieldsAsArr(data, ["STHIRD_PERIOD", "DFROM_DATE3", "DTO_DATE3"]);

    setProperty(fields, "visible", visibleState);
  },

  NOSAGO_TYPE(data, item) {
    const NOSAGO_TYPE_VALUE = findField(data, "NOSAGO_TYPE")?.value;
    const SEDIT_PERIODS_VALUE = findField(data, "SEDIT_PERIODS")?.value;
    const itemValue = item?.value ?? Number(NOSAGO_TYPE_VALUE);
    const type1Fields = getDataFieldsAsArr(data, ["DFROM_DATE", "DTO_DATE", "BPERIODS"]);
    const type2Fields = getDataFieldsAsArr(data, ["DFROM_DATE_SHORT", "DTO_DATE_SHORT"]);
    const type3Fields = getDataFieldsAsArr(data, ["DFROM_DATE_TEMP", "DTO_DATE_TEMP"]);
    const blocks = [type1Fields, type2Fields, type3Fields];
    const blocsVisibility = [
      itemValue === 1 && SEDIT_PERIODS_VALUE,
      itemValue === 2 && SEDIT_PERIODS_VALUE,
      itemValue === 3 && SEDIT_PERIODS_VALUE,
    ];

    blocks.forEach((fields, index) => {
      setProperty(fields, "visible", blocsVisibility[index]);
    });
  },
};

const fieldsProcedure = {
  SEDIT_DRIVERS(data, item) {
    handlers["SEDIT_DRIVERS"](data, item);
    handlers["BMULTI"](data);
    handlers["LPREV_LICENSE"](data);
  },

  LPREV_LICENSE(data, item) {
    handlers["LPREV_LICENSE"](data, item);
  },

  BMULTI(data, item) {
    handlers["BMULTI"](data, item);
    handlers["LPREV_LICENSE"](data);
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
    handlers["NOSAGO_TYPE"](data);
  },

  BPERIODS(data, item) {
    handlers["BPERIODS"](data, item);
    handlers["BADD_SECOND"](data);
    handlers["BADD_THIRD"](data);
    handlers["NOSAGO_TYPE"](data);
  },

  BADD_SECOND(data, item) {
    handlers["BADD_SECOND"](data, item);
  },

  BADD_THIRD(data, item) {
    handlers["BADD_THIRD"](data, item);
  },

  NOSAGO_TYPE(data, item) {
    handlers["NOSAGO_TYPE"](data, item);
    handlers["BPERIODS"](data);
    handlers["BADD_SECOND"](data);
    handlers["BADD_THIRD"](data);
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
  const handlersList = ["SEDIT_AUTO", "SEDIT_DRIVERS", "BMULTI", "LPREV_LICENSE", "SEDIT_PERIODS", "BPERIODS"];

  handlersList.forEach((item) => handlers[item](copyData));
  handlers.commonDriversInitHandler(copyData);
  scrollToCardHead(".wizard-progress-bar");

  return copyData;
}
