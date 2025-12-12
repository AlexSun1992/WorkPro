import { scrollToCardHead } from "@/utils/scroll";
import {
  getBoolean,
  getCopyData,
  getDataFieldsAsArr,
  getDataFieldsAsObj,
  setProperty,
  isValidValue,
} from "@/components/EventHandler/helpers/eventHandlerHelpers";
import { findField } from "@/components/EventHandler/helpers";

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
    const itemValue = item?.value ?? BPERIODS_VALUE ?? false;
    const SEDIT_PERIODS_VALUE = findField(data, "SEDIT_PERIODS")?.value;
    const visibleState = getBoolean(itemValue) && getBoolean(BPERIODS_VALUE) && getBoolean(SEDIT_PERIODS_VALUE);
    const fields = getDataFieldsAsArr(data, ["DFROM_DATE1", "DTO_DATE1", "BADD_SECOND"]);

    setProperty(fields, "visible", visibleState);
  },

  BADD_SECOND(data, item) {
    const BPERIODS_VALUE = findField(data, "BPERIODS")?.value;
    const SEDIT_PERIODS_VALUE = findField(data, "SEDIT_PERIODS")?.value;
    const BADD_SECOND_VALUE = findField(data, "BADD_SECOND")?.value;
    const itemValue = item?.value ?? BADD_SECOND_VALUE ?? false;
    const visibleState = getBoolean(itemValue) && getBoolean(BPERIODS_VALUE) && getBoolean(SEDIT_PERIODS_VALUE);
    const fields = getDataFieldsAsArr(data, ["SSECOND_PERIOD", "DFROM_DATE2", "DTO_DATE2", "BADD_THIRD"]);

    setProperty(fields, "visible", visibleState);
  },

  BADD_THIRD(data, item) {
    const BPERIODS_VALUE = findField(data, "BPERIODS")?.value;
    const BADD_THIRD_VALUE = findField(data, "BADD_THIRD")?.value;
    const SEDIT_PERIODS_VALUE = findField(data, "SEDIT_PERIODS")?.value;
    const itemValue = item?.value ?? BADD_THIRD_VALUE ?? false;
    const visibleState = getBoolean(itemValue) && getBoolean(BPERIODS_VALUE) && getBoolean(SEDIT_PERIODS_VALUE);
    const fields = getDataFieldsAsArr(data, ["STHIRD_PERIOD", "DFROM_DATE3", "DTO_DATE3"]);

    setProperty(fields, "visible", visibleState);
  },
};

const fieldsProcedure = {
  SEDIT_DRIVERS(data, item) {
    handlers["SEDIT_DRIVERS"](data, item ?? SEDIT_DRIVERS_FIELD);
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
  },

  BPERIODS(data, item) {
    handlers["BPERIODS"](data, item);
    handlers["BADD_SECOND"](data);
    handlers["BADD_THIRD"](data);
  },

  BADD_SECOND(data, item) {
    handlers["BADD_SECOND"](data, item);
  },

  BADD_THIRD(data, item) {
    handlers["BADD_THIRD"](data, item);
  },
};

export function eventHandler(data, item) {
  const copyData = getCopyData(data);
  const itemFieldName = item?.name ?? item?.value?.value?.name;
  const { action } = item;
  const SEDIT_DRIVERS_FIELD = findField(copyData, "SEDIT_DRIVERS");

  getProcedure(itemFieldName ?? action)?.(copyData, item ?? SEDIT_DRIVERS_FIELD);

  return copyData;
}

export function initHandler(data) {
  const copyData = getCopyData(data);
  const handlersList = [
    "SEDIT_AUTO",
    "SEDIT_DRIVERS",
    "BMULTI",
    "LPREV_LICENSE",
    "SEDIT_PERIODS",
    "BPERIODS",
    "BADD_SECOND",
    "BADD_THIRD",
  ];

  handlersList.forEach((item) => handlers[item](copyData));

  scrollToCardHead(".wizard-progress-bar");

  return copyData;
}
