function scrollToCardHead() {
  const selector = ".wizard_osago";

  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function eventHandler(data, item, callback) {
  function findField(name) {
    return data.find((f) => f.name === name);
  }

  const field = data.find((f) => f.fieldId === item.fieldId);
  const policyType = findField("NOSAGO_TYPE");
  const periods = findField("BPERIODS");
  const dtoDateField = findField("DTO_DATE");
  const badd2 = findField("BADD_SECOND");
  const badd3 = findField("BADD_THIRD");
  const dfromDateField = findField("DFROM_DATE");
  const dfromDate1Field = findField("DFROM_DATE1");
  const fromDate2Field = findField("DFROM_DATE2");
  const fromDate3Field = findField("DFROM_DATE3");
  const dtoDate1Field = findField("DTO_DATE1");
  const toDate2Field = findField("DTO_DATE2");
  const toDate3Field = findField("DTO_DATE3");
  const dFromDate = findField("DFROM_DATE");
  const dtoDateYear = findField("DTO_DATE_YEAR");
  const validDateFieldNames = ["DFROM_DATE1", "DFROM_DATE2", "DFROM_DATE3", "DTO_DATE1", "DTO_DATE2", "DTO_DATE3"];

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  function dateCreator(dateString = new Date().toLocaleDateString("ru-RU")) {
    const [dateDay, dateMonth, dateYear] = dateString.split(".");
    return new Date(Number(dateYear), Number(dateMonth) - 1, Number(dateDay));
  }
  function fieldsOff(fieldNames = []) {
    fieldNames.forEach((name) => {
      const disabledField = findField(name);
      if (!disabledField) return;
      disabledField.state = null;
      disabledField.visible = false;
      disabledField.value = name.startsWith("BADD_") ? false : null;
    });
  }
  function fieldsOn(fieldNames = []) {
    fieldNames.forEach((name) => {
      const enabledField = findField(name);
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
    return dateCreator(findField(name)?.value);
  }
  function setFieldValue(name, date) {
    findField(name).value = formatDate(date);
  }
  function getIndex() {
    return parseInt(item.name.replace(/^\D+/g, ""), 10);
  }
  function firstPolicyTypeFieldsOff() {
    dtoDateField.visible = true;
    fieldsOff([
      "BPERIODS",
      "DTO_DATE_YEAR",
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
    const policyStartDate = dateCreator(dFromDate.value);
    const policyEndDate = dateCreator(dtoDateYear.value);
    const currentIndex = getIndex();
    const currentPeriodStartField = findField(`DFROM_DATE${currentIndex}`);
    const currentPeriodEndField = findField(`DTO_DATE${currentIndex}`);

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
    const comparisonField = findField(comparisonFieldName);
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
      const nextFROMDateField = findField(`DFROM_DATE${currentIndex + 1}`);
      checkDatesSequence(
        `DFROM_DATE${currentIndex + 1}`,
        currentFieldDate,
        (currentDate, nextFrom) => currentDate >= nextFrom,
        nextFROMDateField
      );
    }
  }
  function validateFromDateMinBorder(fromDate, baseDate, MinBorderDays, errorMsg, targetField) {
    const minDate = addDays(baseDate, MinBorderDays);
    if (minDate > fromDate) {
      addFieldError(targetField, errorMsg);
    } else {
      deleteFieldError(targetField);
    }
  }
  function validatePolicyType2Dates(fromDate, toDate) {
    const maxToDate = addDays(addMonths(fromDate, 3), -1);
    if (toDate < fromDate) {
      addFieldError(dtoDateField, "Дата окончания не может быть раньше даты начала");
    } else if (toDate > maxToDate) {
      addFieldError(dtoDateField, "Срок страхования от 1 дня до 3 месяцев");
    } else {
      deleteFieldError(dtoDateField);
    }
  }
  function validatePolicyType3Dates(fromDate, toDate) {
    const minToDate = addDays(fromDate, 4);
    const maxToDate = addDays(fromDate, 19);
    if (toDate < fromDate) {
      addFieldError(dtoDateField, "Дата окончания не может быть раньше даты начала");
    } else if (toDate < minToDate || toDate > maxToDate) {
      addFieldError(dtoDateField, "Срок страхования от 5 до 20 дней");
    } else {
      deleteFieldError(dtoDateField);
    }
  }

  if (!field) return data;
  if (item.value == null) {
    field.error = null;
    return data;
  }

  function handlePolicyType1() {
    const createDate = getFieldValue("DCALC_DATE");
    const fromDate = getFieldValue("DFROM_DATE");

    if (field.name === "NOSAGO_TYPE") {
      dtoDateYear.visible = true;
      dtoDateField.visible = false;
      deleteFieldError(dFromDate);

      const newFromDate = addDays(createDate, 1);
      setFieldValue("DFROM_DATE", newFromDate);
      setFieldValue("DTO_DATE_YEAR", addFullYear(addDays(newFromDate, -1), 1));
    }
    if (findField("SHELP_INFO").visible === true) {
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
          dfromDate1Field.state = true;
          setFieldValue("DTO_DATE1", addMonths(addDays(fromDate, -1), 3));
          dtoDate1Field.state = true;
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
    if (field.name === "DFROM_DATE") {
      setFieldValue("DTO_DATE_YEAR", addFullYear(addDays(fromDate, -1), 1));
      setFieldValue("DFROM_DATE1", fromDate);
      setFieldValue("DTO_DATE1", addMonths(addDays(fromDate, -1), 3));

      if (fromDate <= createDate) {
        addFieldError(dfromDateField, "Дата начала должна быть позже даты заключения на 1 день");
      } else {
        deleteFieldError(dfromDateField);
      }

      if (periods.value) {
        periods.value = false;
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
        const fromDatePlus1D = addDays(getFieldValue("DFROM_DATE"), 1);

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
            deleteFieldError(findField("DFROM_DATE3"));
            deleteFieldError(findField("DTO_DATE3"));
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
      const newFromDate = addDays(createDate, 4);
      setFieldValue("DFROM_DATE", newFromDate);
      setFieldValue("DTO_DATE", addDays(addMonths(newFromDate, 3), -1));
    }
    if (field.name === "DFROM_DATE" && item.value) {
      const newToDate = addDays(addMonths(getFieldValue("DFROM_DATE"), 3), -1);
      setFieldValue("DTO_DATE", newToDate);
    }

    const fromDate = getFieldValue("DFROM_DATE");
    const toDate = getFieldValue("DTO_DATE");

    validateFromDateMinBorder(
      fromDate,
      createDate,
      4,
      "Дата начала не может быть ранее четырех дней с даты оформления",
      dFromDate
    );
    validatePolicyType2Dates(fromDate, toDate);
  }
  function handlePolicyType3() {
    firstPolicyTypeFieldsOff();

    const createDate = getFieldValue("DCALC_DATE");

    if (field.name === "NOSAGO_TYPE") {
      const createDatePlus1 = addDays(createDate, 1);
      setFieldValue("DFROM_DATE", createDatePlus1);
      setFieldValue("DTO_DATE", addDays(createDatePlus1, 19));
    }

    if (field.name === "DFROM_DATE" && item.value) {
      const newTo = addDays(getFieldValue("DFROM_DATE"), 19);
      setFieldValue("DTO_DATE", newTo);
    }

    const fromDate = getFieldValue("DFROM_DATE");
    const toDate = getFieldValue("DTO_DATE");

    validateFromDateMinBorder(
      fromDate,
      createDate,
      1,
      `Дата начала страхования должна быть не ранее ${addDays(createDate, 1).toLocaleDateString("ru-RU")}`,
      dFromDate
    );

    validatePolicyType3Dates(fromDate, toDate);
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

  data.map((el) => {
    return el;
  });
  return data;
}

export function initHandler(data) {
  scrollToCardHead();
}
