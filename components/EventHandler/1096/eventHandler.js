import { findField } from "../helpers";
import { scrollToCardHead } from "@/utils/scroll";

function dateCreator(dateString = new Date().toLocaleDateString("ru-RU")) {
  // дата не заполнена, dateString = null
  if (!dateString) return;

  const [dateDay, dateMonth, dateYear] = dateString.split(".");
  return new Date(Number(dateYear), Number(dateMonth) - 1, Number(dateDay));
}
function makeInformerVisible(currentFromDate, data) {
  const currentPolicyToDate = findField(data, "DTO_DATE_CURRENT");
  const warningInformer = findField(data, "SWARNING_INFO_1");
  const fromDateField = currentFromDate;

  if (currentPolicyToDate.value) {
    const validPolicyToDate = dateCreator(currentPolicyToDate.value);
    const newPolicyFromDate = dateCreator(fromDateField.value);

    warningInformer.visible = validPolicyToDate >= newPolicyFromDate;
  }
}

export function eventHandler(data, item) {
  const field = data.find((f) => f.fieldId === item.fieldId);
  const policyType = findField(data, "NOSAGO_TYPE");
  const periods = findField(data, "BPERIODS");
  const dtoDateField = findField(data, "DTO_DATE");
  const badd2 = findField(data, "BADD_SECOND");
  const badd3 = findField(data, "BADD_THIRD");
  const fromDateYear = findField(data, "DFROM_DATE_YEAR");
  const fromDateShort = findField(data, "DFROM_DATE_SHORT");
  const fromDateTemp = findField(data, "DFROM_DATE_TEMP");
  const dtoDateYear = findField(data, "DTO_DATE_YEAR");
  const toDateShort = findField(data, "DTO_DATE_SHORT");
  const toDateTemp = findField(data, "DTO_DATE_TEMP");
  const dfromDate1Field = findField(data, "DFROM_DATE1");
  const fromDate2Field = findField(data, "DFROM_DATE2");
  const fromDate3Field = findField(data, "DFROM_DATE3");
  const dtoDate1Field = findField(data, "DTO_DATE1");
  const toDate2Field = findField(data, "DTO_DATE2");
  const toDate3Field = findField(data, "DTO_DATE3");
  const validDateFieldNames = ["DFROM_DATE1", "DFROM_DATE2", "DFROM_DATE3", "DTO_DATE1", "DTO_DATE2", "DTO_DATE3"];
  const egarantField = findField(data, "EGARANT");

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  function fieldsOff(fieldNames = []) {
    fieldNames.forEach((name) => {
      const disabledField = findField(data, name);
      if (!disabledField) return;
      disabledField.state = null;
      disabledField.visible = false;
      disabledField.value = name.startsWith("BADD_") ? false : null;
    });
  }
  function fieldsOn(fieldNames = []) {
    fieldNames.forEach((name) => {
      const enabledField = findField(data, name);
      if (!enabledField) return;

      enabledField.visible = true;
    });
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
    const newdate = new Date(date);
    newdate.setDate(newdate.getDate() + days);
    return newdate;
  }
  function addMonths(date, months) {
    const newdate = new Date(date);
    newdate.setMonth(newdate.getMonth() + months);
    return newdate;
  }
  function addFullYear(date, fullYear) {
    const newdate = new Date(date);
    newdate.setFullYear(newdate.getFullYear() + fullYear);
    return newdate;
  }
  function getFieldValue(name) {
    return dateCreator(findField(data, name)?.value);
  }
  function setFieldValue(name, date) {
    findField(data, name).value = formatDate(date);
  }
  function getIndex() {
    return parseInt(item.name.replace(/^\D+/g, ""), 10);
  }
  function firstPolicyTypeFieldsOff() {
    dtoDateYear.visible = false;
    dtoDateField.visible = false;
    fieldsOff([
      "BPERIODS",
      "SFIRST_PERIOD",
      "DFROM_DATE1",
      "DTO_DATE1",
      "BADD_SECOND",
      "SSECOND_PERIOD",
      "DFROM_DATE2",
      "DTO_DATE2",
      "BADD_THIRD",
      "STHIRD_PERIOD",
      "DFROM_DATE3",
      "DTO_DATE3",
    ]);
  }
  function checkPolicyDatesBorder(currentField) {
    const policyStartDate = dateCreator(fromDateYear.value);
    const policyEndDate = dateCreator(dtoDateYear.value);
    const currentIndex = getIndex();
    const currentPeriodStartField = findField(data, `DFROM_DATE${currentIndex}`);
    const currentPeriodEndField = findField(data, `DTO_DATE${currentIndex}`);

    let isValid = true;

    deleteFieldError(currentField);
    if (currentPeriodStartField.value) {
      const currentPeriodStartDate = dateCreator(currentPeriodStartField.value);
      if (currentPeriodStartDate > policyEndDate || currentPeriodStartDate < policyStartDate) {
        addFieldError(currentPeriodStartField, "Дата вне границ полиса");
        isValid = false;
      }
    }

    if (currentPeriodEndField.value) {
      const currentPeriodEndDate = dateCreator(currentPeriodEndField.value);
      if (currentPeriodEndDate > policyEndDate || currentPeriodEndDate < policyStartDate) {
        addFieldError(currentPeriodEndField, "Дата вне границ полиса");
        isValid = false;
      }
    }

    return isValid;
  }
  function checkDatesSequence(comparisonFieldName, currentDate, comparisonFn, errorTargetField) {
    const comparisonField = findField(data, comparisonFieldName);
    if (!comparisonField || !comparisonField.value) return;

    const referenceDate = dateCreator(comparisonField.value);
    if (comparisonFn(currentDate, referenceDate)) {
      addFieldError(errorTargetField, "Сроки не последовательны");
    } else {
      deleteFieldError(errorTargetField);
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
  function validatePeriodsDates() {
    if (!validDateFieldNames.includes(item.name)) return;
    const currentFieldDate = dateCreator(item.value);
    const currentIndex = getIndex();
    if (!checkPolicyDatesBorder(field)) return;
    if (item.name.startsWith("DFROM_DATE") && currentIndex !== 1) {
      checkDatesSequence(`DTO_DATE${currentIndex - 1}`, currentFieldDate, (from, to) => from <= to, field);
    }
    if (item.name.startsWith("DTO_DATE")) {
      const nextFROMDateField = findField(data, `DFROM_DATE${currentIndex + 1}`);
      checkDatesSequence(
        `DFROM_DATE${currentIndex + 1}`,
        currentFieldDate,
        (currentDate, nextFrom) => currentDate >= nextFrom,
        nextFROMDateField
      );
    }
  }
  function validateFromDateMaxBorder(createDate, fromDate) {
    const maxFromDate = addDays(createDate, 90);

    if (fromDate > maxFromDate) {
      addFieldError(
        fromDateYear,
        `Укажите дату начала срока страхования не позднее ${maxFromDate.toLocaleDateString("ru-RU")}`
      );
    } else if (policyType.value === 1) {
      deleteFieldError(fromDateYear);
    }
  }
  function validateFromDateMinBorder(fromDate, baseDate, MinBorderDays, errorMsg, targetField) {
    const minDate = addDays(baseDate, MinBorderDays);
    if (minDate > fromDate) {
      addFieldError(targetField, errorMsg);
    } else {
      deleteFieldError(targetField);
      validateFromDateMaxBorder(baseDate, fromDate);
    }
  }
  function periodsBlockReset(fromDateFieldDate) {
    setFieldValue("DFROM_DATE1", fromDateFieldDate);
    dfromDate1Field.state = true;
    setFieldValue("DTO_DATE1", addMonths(addDays(fromDateFieldDate, -1), 3));
    dtoDate1Field.state = true;
    fieldsOff([
      "SSECOND_PERIOD",
      "DFROM_DATE2",
      "DTO_DATE2",
      "BADD_THIRD",
      "STHIRD_PERIOD",
      "DFROM_DATE3",
      "DTO_DATE3",
    ]);
    badd2.value = false;
  }
  function validatePolicyType2Dates(fromDate, toDate) {
    const maxToDate = addDays(addMonths(fromDate, 3), -1);
    if (toDate < fromDate) {
      addFieldError(toDateShort, "Дата окончания не может быть раньше даты начала");
    } else if (toDate > maxToDate) {
      addFieldError(toDateShort, "Срок страхования от 1 дня до 3 месяцев");
    } else {
      deleteFieldError(toDateShort);
    }
  }
  function validatePolicyType3Dates(fromDate, toDate) {
    const minToDate = addDays(fromDate, 4);
    const maxToDate = addDays(fromDate, 19);
    if (toDate < fromDate) {
      addFieldError(toDateTemp, "Дата окончания не может быть раньше даты начала");
    } else if (toDate < minToDate || toDate > maxToDate) {
      addFieldError(toDateTemp, "Срок страхования от 5 до 20 дней");
    } else {
      deleteFieldError(toDateTemp);
    }
  }

  if (!field) return data;
  if (item.value == null) {
    field.error = null;
    return data;
  }

  function handlePolicyType1() {
    const createDate = getFieldValue("DCALC_DATE");
    const fromDate = getFieldValue("DFROM_DATE_YEAR");
    console.log("FROM DATE", fromDate);

    if (field.name === "NOSAGO_TYPE") {
      fromDateYear.visible = true;
      fromDateShort.visible = false;
      fromDateTemp.visible = false;
      dtoDateYear.visible = true;
      toDateShort.visible = false;
      toDateTemp.visible = false;
      dtoDateYear.visible = true;
      dtoDateField.visible = false;
      makeInformerVisible(fromDateYear, data);
    }
    if (findField(data, "SHELP_INFO").visible === true) {
      periods.visible = false;
      dtoDateYear.visible = false;
      dtoDateField.visible = true;
    } else {
      periods.visible = true;
      dtoDateYear.visible = true;
      dtoDateField.visible = false;
    }
    if (field.name === "BPERIODS") {
      if (periods.value === true) {
        if (fromDate) {
          setFieldValue("DFROM_DATE1", fromDate);
          setFieldValue("DTO_DATE1", addMonths(addDays(fromDate, -1), 3));
          deleteFieldError(dfromDate1Field);
          deleteFieldError(dtoDate1Field);
        }
        fieldsOn(["SFIRST_PERIOD", "DFROM_DATE1", "DTO_DATE1", "BADD_SECOND"]);
      } else {
        fieldsOff([
          "SFIRST_PERIOD",
          "SSECOND_PERIOD",
          "STHIRD_PERIOD",
          "DFROM_DATE1",
          "DFROM_DATE2",
          "DFROM_DATE3",
          "DTO_DATE1",
          "DTO_DATE2",
          "DTO_DATE3",
          "BADD_SECOND",
          "BADD_THIRD",
        ]);
      }
    }
    if (field.name === "BADD_SECOND") {
      if (field.value === true) {
        fieldsOn(["SSECOND_PERIOD", "DFROM_DATE2", "DTO_DATE2"]);
      } else {
        fieldsOff([
          "SSECOND_PERIOD",
          "STHIRD_PERIOD",
          "DFROM_DATE2",
          "DFROM_DATE3",
          "DTO_DATE2",
          "DTO_DATE3",
          "BADD_THIRD",
        ]);
      }
    }
    if (field.name === "BADD_THIRD") {
      if (field.value === true) {
        fieldsOn(["STHIRD_PERIOD", "DFROM_DATE3", "DTO_DATE3"]);
      } else {
        fieldsOff(["STHIRD_PERIOD", "DFROM_DATE3", "DTO_DATE3"]);
      }
    }
    if (field.name === "DFROM_DATE_YEAR") {
      setFieldValue("DTO_DATE_YEAR", addFullYear(addDays(fromDate, -1), 1));
      if (!periods.value) {
        setFieldValue("DFROM_DATE1", fromDate);
        setFieldValue("DTO_DATE1", addMonths(addDays(fromDate, -1), 3));
      }

      if (egarantField.value === "Y") {
        validateFromDateMinBorder(
          fromDate,
          createDate,
          4,
          "Дата начала не может быть ранее четырех дней с даты оформления",
          fromDateYear
        );
      } else if (egarantField.value === "N" && fromDate <= createDate) {
        addFieldError(fromDateYear, "Дата начала должна быть позже даты заключения на 1 день");
      } else {
        deleteFieldError(fromDateYear);
        validateFromDateMaxBorder(createDate, fromDate);
      }

      if (periods.value) {
        periodsBlockReset(fromDate);
      }
      makeInformerVisible(fromDateYear, data);
    }
    if (field.name === "DTO_DATE1") {
      if (item.value) {
        const toDate1Minus4MPlus2D = addMonths(addDays(getFieldValue("DTO_DATE1"), 2), -3);
        const toDate1Minus9MPlus2D = addMonths(addDays(getFieldValue("DTO_DATE1"), 2), -9);
        const fromDate1Plus1D = addDays(getFieldValue("DFROM_DATE1"), 1);

        if (dfromDate1Field.value) {
          if (!checkDateRange(dtoDateYear.value, item.value, 3)) {
            badd2.visible = false;
          }
          if (toDate1Minus4MPlus2D < fromDate1Plus1D) {
            addFieldError(field, "Срок не менее 3 месяцев");
          } else {
            deleteFieldError(field);
            validatePeriodsDates();
          }
        }

        if (toDate1Minus9MPlus2D > fromDate1Plus1D) {
          fieldsOff([
            "SSECOND_PERIOD",
            "STHIRD_PERIOD",
            "BADD_SECOND",
            "BADD_THIRD",
            "DFROM_DATE2",
            "DTO_DATE2",
            "DFROM_DATE3",
            "DTO_DATE3",
          ]);
        } else if (checkDateRange(dtoDateYear.value, item.value, 3)) {
          badd2.visible = true;
        }
      }
    }
    if (field.name === "DFROM_DATE1") {
      if (item.value) {
        const dfromDate1Plus3M = addMonths(getFieldValue("DFROM_DATE1"), 3);
        const dfromDate1Plus9M = addMonths(getFieldValue("DFROM_DATE1"), 9);
        const toDate1Plus1D = addDays(getFieldValue("DTO_DATE1"), 1);

        if (dtoDate1Field.value) {
          if (toDate1Plus1D < dfromDate1Plus3M) {
            addFieldError(dtoDate1Field, "Срок не менее 3 месяцев");
          } else if (!checkDateRange(dtoDateYear.value, dtoDate1Field.value, 3)) {
            badd2.visible = false;
          } else if (!checkDateRange(dtoDateYear.value, toDate2Field.value, 3) && toDate2Field.value) {
            badd3.visible = false;
          } else {
            deleteFieldError(dtoDate1Field);
            validatePeriodsDates();
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
            ]);
          }
        }
        validatePeriodsDates();
      }
    }
    if (field.name === "DTO_DATE2") {
      if (item.value) {
        const toDate2Minus3MPlus2D = addMonths(addDays(getFieldValue("DTO_DATE2"), 2), -3);
        const toDate2Minus9MPlus2D = addMonths(addDays(getFieldValue("DTO_DATE2"), 2), -9);
        const fromDatePlus1D = addDays(getFieldValue("DFROM_DATE_YEAR"), 1);

        if (fromDate2Field.value) {
          const fromDate2Plus1D = addDays(getFieldValue("DFROM_DATE2"), 1);
          if (!checkDateRange(dtoDateYear.value, item.value, 3)) {
            badd3.visible = false;
          }
          if (toDate2Minus3MPlus2D < fromDate2Plus1D) {
            addFieldError(field, "Срок не менее 3 месяцев");
          } else {
            deleteFieldError(field);
            validatePeriodsDates();
          }
        }

        if (toDate2Minus9MPlus2D > fromDatePlus1D) {
          fieldsOff(["STHIRD_PERIOD", "BADD_THIRD", "DFROM_DATE3", "DTO_DATE3"]);
        } else {
          badd3.visible = true;
        }
      }
    }
    if (field.name === "DFROM_DATE2") {
      if (item.value) {
        const fromDate2Plus3M = addMonths(getFieldValue("DFROM_DATE2"), 3);
        if (toDate2Field.value) {
          const toDate2Plus1D = addDays(getFieldValue("DTO_DATE2"), 1);
          if (toDate2Plus1D < fromDate2Plus3M) {
            addFieldError(toDate2Field, "Срок не менее 3 месяцев");
          } else {
            deleteFieldError(toDate2Field);
          }
        }
      }
      validatePeriodsDates();
    }
    if (field.name === "DTO_DATE3" || field.name === "DFROM_DATE3") {
      if (item.value) {
        validatePeriodsDates();
        if (fromDate3Field.value && toDate3Field.value) {
          const toDate3 = getFieldValue("DTO_DATE3");
          const fromDate3Plus3M = addMonths(addDays(getFieldValue("DFROM_DATE3"), -1), 3);

          if (toDate3 < fromDate3Plus3M) {
            addFieldError(field, "Срок не менее 3 месяцев");
          } else {
            deleteFieldError(findField(data, "DFROM_DATE3"));
            deleteFieldError(findField(data, "DTO_DATE3"));
            validatePeriodsDates();
          }
        }
      }
    }
  }
  function handlePolicyType2() {
    firstPolicyTypeFieldsOff();

    const createDate = getFieldValue("DCALC_DATE");

    if (field.name === "NOSAGO_TYPE") {
      fromDateYear.visible = false;
      dtoDateYear.visible = false;
      fromDateShort.visible = true;
      toDateShort.visible = true;
      fromDateTemp.visible = false;
      toDateTemp.visible = false;
      makeInformerVisible(fromDateShort, data);
    }
    if (field.name === "DFROM_DATE_SHORT" && item.value) {
      const newToDate = addDays(addMonths(getFieldValue("DFROM_DATE_SHORT"), 3), -1);
      setFieldValue("DTO_DATE_SHORT", newToDate);
      makeInformerVisible(fromDateShort, data);
    }

    if (fromDateShort?.value && toDateShort?.value) {
      const fromDate = getFieldValue("DFROM_DATE_SHORT");
      const toDate = getFieldValue("DTO_DATE_SHORT");
      validateFromDateMinBorder(
        fromDate,
        createDate,
        4,
        "Дата начала не может быть ранее четырех дней с даты оформления",
        fromDateShort
      );
      validatePolicyType2Dates(fromDate, toDate);
    }
  }
  function handlePolicyType3() {
    firstPolicyTypeFieldsOff();

    const createDate = getFieldValue("DCALC_DATE");

    if (field.name === "NOSAGO_TYPE") {
      fromDateYear.visible = false;
      fromDateShort.visible = false;
      fromDateTemp.visible = true;
      dtoDateYear.visible = false;
      toDateShort.visible = false;
      toDateTemp.visible = true;
      makeInformerVisible(fromDateTemp, data);
    }

    if (field.name === "DFROM_DATE_TEMP" && item.value) {
      const newTo = addDays(getFieldValue("DFROM_DATE_TEMP"), 19);
      setFieldValue("DTO_DATE_TEMP", newTo);
      makeInformerVisible(fromDateTemp, data);
    }

    if (fromDateTemp?.value && toDateTemp?.value) {
      const fromDate = getFieldValue("DFROM_DATE_TEMP");
      const toDate = getFieldValue("DTO_DATE_TEMP");

      validateFromDateMinBorder(
        fromDate,
        createDate,
        1,
        `Дата начала страхования должна быть не ранее ${addDays(createDate, 1).toLocaleDateString("ru-RU")}`,
        fromDateTemp
      );

      validatePolicyType3Dates(fromDate, toDate);
    }
  }

  switch (policyType.value) {
    case 1:
      handlePolicyType1();
      break;
    case 2:
      handlePolicyType2();
      break;
    case 3:
      handlePolicyType3();
      break;

    default:
      break;
  }

  data.map((el) => el);
  return data;
}

export function initHandler(data) {
  const fromDateYear = findField(data, "DFROM_DATE_YEAR");

  scrollToCardHead(".wizard_osago");
  makeInformerVisible(fromDateYear, data);

  return data;
}
