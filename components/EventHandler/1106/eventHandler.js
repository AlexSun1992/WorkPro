import { findField } from "../helpers";
import { scrollToCardHead } from "@/utils/scroll";

function dateCreator(dateString = new Date().toLocaleDateString("ru-RU")) {
  const [dateDay, dateMonth, dateYear] = dateString.split(".");
  return new Date(Number(dateYear), Number(dateMonth) - 1, Number(dateDay));
}
function addFieldError(targetField, errorText) {
  targetField.error = errorText;
  targetField.state = false;
}
function deleteFieldError(targetField) {
  targetField.error = null;
  targetField.state = true;
}
function resetDocumentValidation(docList, docType, seriesNumberField, regNumberField) {
  if (!docList.includes(docType.value)) {
    seriesNumberField.mask = null;
    regNumberField.required = false;
  }
}

const PTS_MASK = "YYYY YYYYYY";
const ID_DOCUMENTS_LIST = [31, 30];

export function eventHandler(data, item, callback) {
  const SREG_NUMBER = findField(data, "SREG_NUMBER");
  const seriesNumberDoc = findField(data, "SVEHDOC");
  const docNumber = findField(data, "SVEHEPTS");
  const countryDoc = findField(data, "IDCOUNTRYDOC");
  const IDVEHDOCTYPE = findField(data, "IDVEHDOCTYPE");
  const transportRegDocDateField = findField(data, "DVEHDOCDATE");

  if (item.name === "SREG_NUMBER") {
    SREG_NUMBER.value = item.value?.toUpperCase();
  }

  if (item.name === "SVEHDOC") {
    const field = findField(data, "SVEHDOC");
    field.value = item.value.toUpperCase();
  }

  if (item.name === "IDVEHDOCTYPE") {
    if (item.value === 31) {
      SREG_NUMBER.required = true;
      if (!SREG_NUMBER.value) {
        SREG_NUMBER.state = false;
      }
      if (SREG_NUMBER.value) {
        SREG_NUMBER.state = true;
      }
    }
    if (item.value !== 31) {
      SREG_NUMBER.required = false;
      SREG_NUMBER.state = null;
    }
    // Настраиваем видимость поля Серия и номер/Номер документа
    if (item.value === 41) {
      seriesNumberDoc.visible = false;
      docNumber.visible = true;
    } else {
      seriesNumberDoc.visible = true;
      docNumber.visible = false;
    }
  }

  // Для России только цифры
  if (["IDCOUNTRYDOC", "IDVEHDOCTYPE"].includes(item.name)) {
    if (countryDoc.value !== 179) {
      seriesNumberDoc.mask = null;
    }
    if (countryDoc.value === 179) {
      const mask = PTS_MASK;
      seriesNumberDoc.mask = mask;
    }

    const valid = !seriesNumberDoc.mask && seriesNumberDoc.value.length > 0;
    if (valid) {
      seriesNumberDoc.state = true;
      seriesNumberDoc.error = null;
    }
  }

  if (item.name === "DVEHDOCDATE") {
    const currentDate = new Date();
    const transportRegDocDate = dateCreator(transportRegDocDateField.value);
    if (transportRegDocDate > currentDate) {
      addFieldError(transportRegDocDateField, "Дата выдачи документа не может быть позже текущей даты.");
    } else {
      deleteFieldError(transportRegDocDateField);
    }
  }

  if (ID_DOCUMENTS_LIST.includes(IDVEHDOCTYPE.value) && countryDoc.value !== 179 && !seriesNumberDoc.value) {
    seriesNumberDoc.state = false;
    seriesNumberDoc.error = "";
  }
  resetDocumentValidation(ID_DOCUMENTS_LIST, IDVEHDOCTYPE, seriesNumberDoc, SREG_NUMBER);
  return data;
}

export function initHandler(data) {
  if (data[0]?.id !== "1106") return;
  const IDVEHDOCTYPE = findField(data, "IDVEHDOCTYPE");
  const SREG_NUMBER = findField(data, "SREG_NUMBER");
  const seriesNumberDoc = findField(data, "SVEHDOC");
  const countryDoc = findField(data, "IDCOUNTRYDOC");
  const docNumber = findField(data, "SVEHEPTS");

  seriesNumberDoc.visible = IDVEHDOCTYPE.value !== 41;
  docNumber.visible = IDVEHDOCTYPE.value === 41;

  if (countryDoc.value !== 179) {
    seriesNumberDoc.mask = null;
    SREG_NUMBER.required = false;
  }
  if (countryDoc.value === 179) {
    const mask = PTS_MASK;
    seriesNumberDoc.mask = mask;
    SREG_NUMBER.required = IDVEHDOCTYPE.value === 31;
  }
  resetDocumentValidation(ID_DOCUMENTS_LIST, IDVEHDOCTYPE, seriesNumberDoc, SREG_NUMBER);
  scrollToCardHead(".wizard_osago");

  return data;
}
