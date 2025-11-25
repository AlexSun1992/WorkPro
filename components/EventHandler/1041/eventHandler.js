import { scrollToCardHead } from "@/utils/scroll";
import { findField } from "../helpers/findField";
import { resetFieldsValues } from "../helpers/resetFieldsValues";
import { validateAlphanumeric, validateNumeric } from "../helpers/validateAlphanumeric";

const errorText = "Пожалуйста введите корректное значение";

const setDocumentMasks = (series, docNum, seriesMask, numberMask) => {
  if (series) series.mask = seriesMask;
  if (docNum) docNum.mask = numberMask;
};

const handleDocumentTypeChange = (docType, seriesNumber, docNumber) => {
  if (docType.value === 35) {
    setDocumentMasks(seriesNumber, docNumber, "####", "######");
  } else if (docType.value === 36) {
    setDocumentMasks(seriesNumber, docNumber, "##", "#######");
  } else {
    setDocumentMasks(seriesNumber, docNumber, null, null);
  }
};

const setStatesAndErrosToFields = (fieldName, fieldState, fieldError) => {
  fieldName.state = fieldState;
  fieldName.error = fieldError;
};

export function eventHandler(data, item) {
  const docNumber = findField(data, "SDOCNUMBER");
  const seriesNumber = findField(data, "SDOCSERIES");
  const docType = findField(data, "IDDOCTYPE");

  if (item.name === "IDDOCTYPE") {
    handleDocumentTypeChange(docType, seriesNumber, docNumber);

    // Номер
    if (docNumber.mask && docNumber.value?.length < docNumber.mask?.length) {
      setStatesAndErrosToFields(docNumber, false, errorText);
    }

    if (docNumber.mask && docNumber.value?.length === docNumber.mask?.length) {
      setStatesAndErrosToFields(docNumber, true, null);
    }

    if (!docNumber.mask && docNumber?.value) {
      setStatesAndErrosToFields(docNumber, true, null);
    }

    // Серия
    if (seriesNumber.mask && seriesNumber.value?.length === seriesNumber.mask?.length) {
      setStatesAndErrosToFields(seriesNumber, true, null);
    }

    if (seriesNumber.mask && seriesNumber.value?.length < seriesNumber.mask?.length) {
      setStatesAndErrosToFields(seriesNumber, false, errorText);
    }

    if (!seriesNumber.mask && seriesNumber?.value) {
      setStatesAndErrosToFields(seriesNumber, true, null);
    }
  }

  // Серия
  if (item.name === "SDOCSERIES") {
    if (!validateAlphanumeric(item.value)) {
      seriesNumber.value = item.value.replace(/[^a-zA-Zа-яА-ЯёЁ0-9]/g, "");

      if (/[^a-zA-Zа-яА-ЯёЁ0-9]/.test(item.value.charAt(0))) {
        resetFieldsValues(seriesNumber);
      }
    }
  }
  // Номер
  if (item.name === "SDOCNUMBER") {
    if (!validateNumeric(item.value)) {
      docNumber.value = item.value.replace(/[^0-9]/g, "");

      if (/[^a-zA-Zа-яА-ЯёЁ0-9]/.test(item.value.charAt(0))) {
        resetFieldsValues(docNumber);
      }
    }
  }

  return data;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  const thirdname = data.find(({ name }) => name === "STHIRDNAME");

  if (thirdname.value) {
    thirdname.state = true;
    thirdname.error = null;
  }

  const docNumber = findField(data, "SDOCNUMBER");
  const seriesNumber = findField(data, "SDOCSERIES");
  const docType = findField(data, "IDDOCTYPE");

  handleDocumentTypeChange(docType, seriesNumber, docNumber);

  return data;
}
