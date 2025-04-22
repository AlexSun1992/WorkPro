function eventHandler(data, item, callback) {
  const field = data.find((f) => f.fieldId === item.fieldId);
  const policyType = data.find((f) => f.name === "NOSAGO_TYPE");
  const periods = data.find((f) => f.name === "BPERIODS");
  const dtoDateField = data.find((f) => f.name === "DTO_DATE");
  const periodList = data.find((f) => f.name === "PERIOD_LIST");
  const baccept = data.find((f) => f.name === "BACCEPT");
  const badd2 = data.find((f) => f.name === "BADD_SECOND");
  const badd3 = data.find((f) => f.name === "BADD_THIRD");
  const dfromDate1Field = data.find((f) => f.name === "DFROM_DATE1");
  const dtoDate1Field = data.find((f) => f.name === "DTO_DATE1");
  const dFromDate = data.find((f) => f.name === "DFROM_DATE");
  const dtoDateYear = data.find((f) => f.name === "DTO_DATE_YEAR");

  console.log(item, "item");
  console.log(data, "data");

  function parseDate(dateStr, addDay = 0) {
    const [day, month, year] = dateStr.split(".");
    return new Date(year, month - 1, day + addDay);
  }

  function validateDateOrder(DFROM_DATE, DTO_DATE) {
    console.log(DFROM_DATE, DTO_DATE, "validateDateOrder");

    // Создаем объекты Date из строк
    const startDate = parseDate(DFROM_DATE);
    const endDate = parseDate(DTO_DATE, 1);

    // Проверяем что дата окончания не раньше даты начала
    if (endDate <= startDate) {
      console.log("Дата окончания не может быть раньше даты начала");
      return false;
    }

    console.log("Даты валидны");
    return true;
  }

  function checkDateRange(dateFrom, dateTo, range = 0) {
    console.log(dateFrom, dateTo, range, "checkDateRange");
    if (!dateFrom || !dateTo) {
      return false;
    }
    // Создаем объекты Date из строк
    const startDate = parseDate(dateFrom);
    const endDate = parseDate(dateTo, 1);

    // Добавляем один день к конечной дате
    const endDatePlusOne = new Date(endDate);
    endDatePlusOne.setDate(endDate.getDate());

    // Вычисляем разницу в миллисекундах
    const diffTime = endDatePlusOne - startDate;

    // Конвертируем в месяцы (приблизительно)
    const monthsDiff = diffTime / (1000 * 60 * 60 * 24 * 30);
    console.log(monthsDiff, "monthsDiff");

    if (monthsDiff > range) {
      console.log(
        `Внимание! Разница между ${dateFrom} и ${dateTo} превышает 9 месяцев`
      );
      return false;
    }
    return true;
  }

  function validateDates(item, data, dFromDate, dtoDateYear) {
    console.log(item, data, dFromDate, dtoDateYear);

    const listDFROMNamesDate = ["DFROM_DATE1", "DFROM_DATE2", "DFROM_DATE3"];
    const listDTONamesDate = ["DTO_DATE1", "DTO_DATE2", "DTO_DATE3"];

    // Проверяем, относится ли поле к датам начала или окончания срока
    const isDFROMDateExists = listDFROMNamesDate.some(
      (name) => name === item.name
    );
    const isDTODateExists = listDTONamesDate.some((name) => name === item.name);

    if (!isDFROMDateExists && !isDTODateExists) return;

    // Форматируем даты в стандартный формат
    const formatDate = (dateStr) => {
      const [day, month, year] = dateStr.split(".");
      return `${year}-${month}-${day}`;
    };

    const dateExistsReplace = formatDate(item.value);
    const dFromDateReplace = formatDate(dFromDate.value);
    const dtoDateYearReplace = formatDate(dtoDateYear.value);

    // Преобразуем строки в объекты Date для сравнения
    const dateInListValid = new Date(dateExistsReplace).setHours(0, 0, 0, 0);
    const dFromDateValid = new Date(dFromDateReplace).setHours(0, 0, 0, 0);
    const dtoDateYearValid = new Date(dtoDateYearReplace).setHours(0, 0, 0, 0);

    // Очищаем предыдущие ошибки и состояния
    const currentItem = data.find((f) => f.name === item.name);
    currentItem.error = null;
    currentItem.state = true;
    // Проверяем разницу между месяцами начала и конца полиса
    const prevDTOIndex = parseInt(item.name.replace("DFROM_DATE", ""), 10);
    const prevDFROMIndex = parseInt(item.name.replace("DTO_DATE", ""), 10);
    const prevDTODateName = prevDTOIndex
      ? `DTO_DATE${prevDTOIndex}`
      : `DFROM_DATE${prevDFROMIndex}`;

    const [dFrom, mFrom, yFrom] = item.value.split(".");
    const dateToDate = new Date(yFrom, +mFrom + 2, dFrom);
    const toDateField = data.find((f) => f.name === prevDTODateName);

    if (toDateField.value) {
      console.log(toDateField, "toDateField");

      const [dInput, mInput, yInput] = toDateField.value.split(".");
      const dateTo = new Date(yInput, +mInput - 1, +dInput + 1);
    }

    // Проверяем границы полиса
    if (dateInListValid > dtoDateYearValid) {
      currentItem.error = "Дата вне границ полиса";
      currentItem.state = false;
      return;
    }
    if (dateInListValid < dFromDateValid) {
      currentItem.error = "Дата вне границ полиса";
      currentItem.state = false;

      return;
    }

    // Если это дата начала срока (DFROM_DATE), проверяем последовательность
    if (isDFROMDateExists && item.name !== "DFROM_DATE1") {
      const prevDTOIndex =
        parseInt(item.name.replace("DFROM_DATE", ""), 10) - 1;
      const prevDTODateName = `DTO_DATE${prevDTOIndex}`;

      const prevDTOItem = data.find((f) => f.name === prevDTODateName);
      if (!prevDTOItem || !prevDTOItem.value) return;

      const prevDTODateReplace = formatDate(prevDTOItem.value);
      const prevDTODateValid = new Date(prevDTODateReplace).setHours(
        0,
        0,
        0,
        0
      );
      console.log(dateInListValid, " dateInListValid 1");
      console.log(prevDTODateValid, "prevDTODateValid1");

      if (dateInListValid <= prevDTODateValid) {
        currentItem.error = "Сроки не последовательны";
        currentItem.state = false;
        return;
      }
    }

    // Если это дата начала срока (DTO_DATE), проверяем последовательность
    console.log(isDTODateExists, "isDTODateExists");
    console.log(item.name, "item.name ");

    if (isDTODateExists) {
      console.log("tyt");

      const prevDTOIndex = parseInt(item.name.replace("DTO_DATE", ""), 10) + 1;
      const prevDTODateName = `DFROM_DATE${prevDTOIndex}`;

      const prevDTOItem = data.find((f) => f.name === prevDTODateName);
      console.log(prevDTOItem, "prevDTOItem");

      if (!prevDTOItem || !prevDTOItem.value) return;

      const prevDTODateReplace = formatDate(prevDTOItem.value);
      const prevDTODateValid = new Date(prevDTODateReplace).setHours(
        0,
        0,
        0,
        0
      );

      console.log(dateInListValid, "prevDTODateReplace");
      console.log(prevDTODateValid, "prevDTODateValid");

      if (dateInListValid >= prevDTODateValid) {
        data.find((f) => f.name === prevDTODateName).error =
          "Сроки не последовательны";
        data.find((f) => f.name === prevDTODateName).state = false;
      } else {
        data.find((f) => f.name === prevDTODateName).error = null;
        data.find((f) => f.name === prevDTODateName).state = true;
      }
    }
  }

  function dateCreator(dateString = new Date().toLocaleDateString("ru-RU")) {
    const [dateDay, dateMonth, dateYear] = dateString.split(".");
    const date = new Date(dateYear, dateMonth - 1, dateDay);
    return date;
  }

  if (!field) return data;

  if (field.name === "DFROM_DATE") {
    console.log("field.name:", field.name);
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      console.log("item.value1:", item.value);
      let [dFrom, mFrom, yFrom] = item.value.split(".");
      let dateInputDate = new Date(yFrom, +mFrom - 1, dFrom); // добавил переменную, т.к в следующем блоке if переменная dateInput не обновляется
      let dateFrom = new Date(yFrom, +mFrom - 1, dFrom);
      dateFrom.setFullYear(dateFrom.getFullYear() + 1);
      dateFrom.setDate(dateFrom.getDate() - 1);
      let formattedDate = [
        dateFrom.getDate(),
        dateFrom.getMonth() + 1,
        dateFrom.getFullYear(),
      ]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");
      let toDate = data.find((f) => f.name === "DTO_DATE");
      let fromDate = data.find((f) => f.name === "DFROM_DATE");
      toDate.value = formattedDate;
      let toDate1 = data.find((f) => f.name === "DTO_DATE_YEAR");
      toDate1.value = formattedDate;
      dateFrom = new Date(dFrom, mFrom, yFrom);
      const inputDateField = data.find((f) => f.name === "DCALC_DATE");
      if (inputDateField.value) {
        let [dInput, mInput, yInput] = inputDateField.value.split(".");
        let dateInput = new Date(dInput, +mInput - 1, yInput);
        const inputDateFieldTest = data.find((f) => f.name === "DCALC_DATE");
        const currentDate = new Date(); // определяю текущую дату
        const MaxInputDate = new Date(yInput, +mInput - 1, +dInput + 45);
        const MinInputDate = new Date(yInput, +mInput - 1, +dInput + 1);

        if (dateInputDate < MinInputDate) {
          field.error =
            "Дата начала должна быть позже даты заключения на 1 дня";
          field.state = false;
        } else if (dateInputDate > MaxInputDate) {
          field.error = "Дата начала должна быть не позже, чем через 45 дней";
          field.state = false;
        } else {
          field.state = true;
          field.error = null;
        }
      }
    }
  }

  if (field.name === "DTO_DATE_YEAR") {
    const [dFrom, mFrom, yFrom] = item.value.split(".");
    const dateFrom = new Date(yFrom, +mFrom - 1, dFrom);
    dateFrom.setFullYear(dateFrom.getFullYear() + 1);
    dateFrom.setDate(dateFrom.getDate() - 1);
    const formattedDate = [
      dateFrom.getDate(),
      dateFrom.getMonth() + 1,
      dateFrom.getFullYear(),
    ]
      .map((n) => (n < 10 ? `0${n}` : `${n}`))
      .join(".");
    const toDate = data.find((f) => f.name === "DTO_DATE");
    const fromDate = data.find((f) => f.name === "DFROM_DATE");
    toDate.value = formattedDate;
  }

  if (field.name === "DCALC_DATE") {
    data.find((f) => f.name === "DFROM_DATE").value = null;
    data.find((f) => f.name === "DTO_DATE").value = null;
  }

  if (
    policyType.value == 1 &&
    data.find((f) => f.name === "SHELP_INFO").visible === true
  ) {
    periods.visible = false;
    data.find((f) => f.name === "DTO_DATE_YEAR").visible = false;
    data.find((f) => f.name === "DTO_DATE").visible = true;
  }
  if (
    policyType.value == 1 &&
    data.find((f) => f.name === "SHELP_INFO").visible === false
  ) {
    periods.visible = true;
    data.find((f) => f.name === "DTO_DATE_YEAR").visible = true;
    data.find((f) => f.name === "DTO_DATE").visible = false;
    if (periods.value == 1) {
      console.log("periods.value == 1");

      if (field.name === "BPERIODS") {
        if (data.find((f) => f.name === "DFROM_DATE").value) {
          let [dFrom, mFrom, yFrom] = data
            .find((f) => f.name === "DFROM_DATE")
            .value.split(".");
          let dateFrom = new Date(yFrom, +mFrom - 1, dFrom);
          dateFrom.setFullYear(dateFrom.getFullYear() + 1);
          dateFrom.setDate(dateFrom.getDate() - 1);
          let formattedDate = [
            dateFrom.getDate() + 1,
            dateFrom.getMonth() + 1,
            dateFrom.getFullYear() - 1,
          ]
            .map((n) => (n < 10 ? `0${n}` : `${n}`))
            .join(".");
          dfromDate1Field.value = formattedDate;
          dfromDate1Field.state = true;
          let formattedDate2 = [
            dateFrom.getDate(),
            dateFrom.getMonth() + 4,
            dateFrom.getFullYear() - 1,
          ]
            .map((n) => (n < 10 ? `0${n}` : `${n}`))
            .join(".");
          dtoDate1Field.value = formattedDate2;
          dtoDate1Field.state = true;
        }
      }
      data.find((f) => f.name === "SFIRST_PERIOD").visible = true;
      data.find((f) => f.name === "DFROM_DATE1").visible = true;
      data.find((f) => f.name === "DTO_DATE1").visible = true;
      data.find((f) => f.name === "BADD_SECOND").visible = true;
    } else {
      data.find((f) => f.name === "SFIRST_PERIOD").visible = false;
      data.find((f) => f.name === "DFROM_DATE1").visible = false;
      data.find((f) => f.name === "DTO_DATE1").visible = false;
      data.find((f) => f.name === "BADD_SECOND").visible = false;
      data.find((f) => f.name === "DFROM_DATE1").value = null;
      data.find((f) => f.name === "DTO_DATE1").value = null;
      data.find((f) => f.name === "BADD_SECOND").value = 0;
    }
    if (field.name === "DFROM_DATE" && item.value) {
      let [dFrom, mFrom, yFrom] = item.value.split(".");
      let dateFrom = new Date(yFrom, +mFrom - 1, dFrom);
      dateFrom.setFullYear(dateFrom.getFullYear() + 1);
      dateFrom.setDate(dateFrom.getDate() - 1);
      let formattedDate = [
        dateFrom.getDate(),
        dateFrom.getMonth() + 1,
        dateFrom.getFullYear(),
      ]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");

      dtoDateField.value = formattedDate;
      let formattedDate2 = [
        dateFrom.getDate() + 1,
        dateFrom.getMonth() + 1,
        dateFrom.getFullYear() - 1,
      ]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");

      dfromDate1Field.value = formattedDate2;
    }
    if (badd2.value && badd2.visible == true) {
      data.find((f) => f.name === "SSECOND_PERIOD").visible = true;
      data.find((f) => f.name === "DFROM_DATE2").visible = true;
      data.find((f) => f.name === "DTO_DATE2").visible = true;
    } else {
      data.find((f) => f.name === "DFROM_DATE3").visible = false;
      data.find((f) => f.name === "SSECOND_PERIOD").visible = false;
      data.find((f) => f.name === "DFROM_DATE2").visible = false;
      data.find((f) => f.name === "DTO_DATE2").visible = false;
      data.find((f) => f.name === "BADD_THIRD").visible = false;
      data.find((f) => f.name === "DFROM_DATE2").value = null;
      data.find((f) => f.name === "DTO_DATE2").value = null;
      data.find((f) => f.name === "DFROM_DATE2").state = null;
      data.find((f) => f.name === "DTO_DATE2").state = null;
    }
    if (badd3.value && badd3.visible == true) {
      data.find((f) => f.name === "STHIRD_PERIOD").visible = true;
      data.find((f) => f.name === "DFROM_DATE3").visible = true;
      data.find((f) => f.name === "DTO_DATE3").visible = true;
    } else {
      data.find((f) => f.name === "STHIRD_PERIOD").visible = false;
      data.find((f) => f.name === "BADD_THIRD").visible = false;
      data.find((f) => f.name === "DTO_DATE3").visible = false;
      data.find((f) => f.name === "DFROM_DATE3").value = null;
      data.find((f) => f.name === "DFROM_DATE3").visible = null;
      data.find((f) => f.name === "DTO_DATE3").value = null;
      data.find((f) => f.name === "DFROM_DATE3").state = null;
      data.find((f) => f.name === "DTO_DATE3").state = null;
    }
  }
  if (field.name === "DTO_DATE1") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      console.log("item.value2:", item.value);
      let [dTo, mTo, yTo] = item.value.split(".");
      let dateFromDate = new Date(yTo, +mTo - 4, +dTo + 2);
      let dateFromDate2 = new Date(yTo, +mTo - 10, +dTo + 2);
      let dateTo = new Date(yTo, +mTo - 1, +dTo + 1);
      const fromDateField = data.find((f) => f.name === "DFROM_DATE1");
      console.log(fromDateField.value, "fromDateField.value222222222222222222");
      console.log(dateFromDate, "dateFromDate");

      if (fromDateField.value) {
        let [dInput, mInput, yInput] = fromDateField.value.split(".");
        let dateFrom = new Date(yInput, +mInput - 1, +dInput + 1);

        if (dateFromDate < dateFrom) {
          console.log("Срок не менее 3 месяцев");

          // item.value = null
          field.error = "Срок не менее 3 месяцев";
          field.state = false;
        } else if (!checkDateRange(fromDateField.value, item.value, 9)) {
          data.find((f) => f.name === "BADD_SECOND").visible = false;
        } else {
          field.state = true;
          field.error = null;
          console.log("field:", field);
          validateDates(item, data, dFromDate, dtoDateYear);
        }
      }
    }
  }
  if (data.find((f) => f.name === "DTO_DATE1").value) {
    let [dTo, mTo, yTo] = data
      .find((f) => f.name === "DTO_DATE1")
      .value.split(".");
    let dateFromDate = new Date(yTo, +mTo - 4, +dTo + 2);
    let dateFromDate2 = new Date(yTo, +mTo - 10, +dTo + 2);
    const fromDateField = data.find((f) => f.name === "DFROM_DATE1");
    if (fromDateField.value) {
      let [dInput, mInput, yInput] = fromDateField.value.split(".");
      let dateFrom = new Date(yInput, +mInput - 1, +dInput + 1);

      if (dateFromDate2 > dateFrom) {
        data.find((f) => f.name === "SSECOND_PERIOD").visible = false;
        data.find((f) => f.name === "STHIRD_PERIOD").visible = false;
        data.find((f) => f.name === "BADD_SECOND").visible = false;
        data.find((f) => f.name === "BADD_SECOND").visible = false;
        data.find((f) => f.name === "BADD_THIRD").visible = false;
        data.find((f) => f.name === "BADD_SECOND").value = 0;
        data.find((f) => f.name === "BADD_THIRD").value = 0;
        data.find((f) => f.name === "DFROM_DATE2").visible = false;
        data.find((f) => f.name === "DTO_DATE2").visible = false;
        data.find((f) => f.name === "DFROM_DATE3").visible = false;
        data.find((f) => f.name === "DTO_DATE3").visible = false;
        data.find((f) => f.name === "DFROM_DATE2").value = null;
        data.find((f) => f.name === "DTO_DATE2").value = null;
        data.find((f) => f.name === "DFROM_DATE3").value = null;
        data.find((f) => f.name === "DTO_DATE3").value = null;
      }
    }
  }
  if (field.name === "DFROM_DATE1") {
    console.log("field.name:", field.name);
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      console.log("item.value3:", item.value);
      let [dFrom, mFrom, yFrom] = item.value.split(".");
      let dateToDate = new Date(yFrom, +mFrom + 2, dFrom);
      let dateToDate2 = new Date(yFrom, +mFrom + 8, dFrom);
      let dateFrom = new Date(yFrom, +mFrom - 1, +dFrom + 1);
      const toDateField = data.find((f) => f.name === "DTO_DATE1");
      const toDate2Field = data.find((f) => f.name === "DTO_DATE2");
      console.log(toDateField, "toDateField");
      console.log(toDate2Field, "toDate2Field");

      if (toDateField.value) {
        let [dInput, mInput, yInput] = toDateField.value.split(".");
        let dateTo = new Date(yInput, +mInput - 1, +dInput + 1);
        if (dateTo < dateToDate) {
          // item.value = null
          toDateField.error = "Срок не менее 3 месяцев";
          toDateField.state = false;
        } else if (!checkDateRange(item.value, toDateField.value, 9)) {
          data.find((f) => f.name === "BADD_SECOND").visible = false;
        } else if (!checkDateRange(item.value, toDate2Field.value, 9)) {
          data.find((f) => f.name === "BADD_THIRD").visible = false;
        } else {
          toDateField.state = true;
          toDateField.error = null;
          console.log("field:", field);
        }

        if (dateToDate2 < dateTo) {
          data.find((f) => f.name === "SSECOND_PERIOD").visible = false;
          data.find((f) => f.name === "STHIRD_PERIOD").visible = false;
          data.find((f) => f.name === "BADD_SECOND").visible = false;
          data.find((f) => f.name === "BADD_THIRD").visible = false;
          data.find((f) => f.name === "BADD_SECOND").value = 0;
          data.find((f) => f.name === "BADD_THIRD").value = 0;
          data.find((f) => f.name === "DFROM_DATE2").visible = false;
          data.find((f) => f.name === "DTO_DATE2").visible = false;
          data.find((f) => f.name === "DFROM_DATE3").visible = false;
          data.find((f) => f.name === "DTO_DATE3").visible = false;
          data.find((f) => f.name === "DFROM_DATE2").value = null;
          data.find((f) => f.name === "DTO_DATE2").value = null;
          data.find((f) => f.name === "DFROM_DATE3").value = null;
          data.find((f) => f.name === "DTO_DATE3").value = null;
        }
      }
      validateDates(item, data, dFromDate, dtoDateYear);
    }
  }
  if (field.name === "DTO_DATE2") {
    console.log("DTO_DATE2");
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      console.log("item.value4:", item.value);
      let [dTo, mTo, yTo] = item.value.split(".");
      let dateFromDate = new Date(yTo, +mTo - 4, +dTo + 2);
      let dateFromDate2 = new Date(yTo, +mTo - 10, +dTo + 2);
      let dateTo = new Date(yTo, +mTo - 1, +dTo + 1);
      const fromDateField = data.find((f) => f.name === "DFROM_DATE2");
      const fromDate1Field = data.find((f) => f.name === "DFROM_DATE1");

      if (fromDateField.value) {
        let [dInput, mInput, yInput] = fromDateField.value.split(".");
        let dateFrom = new Date(yInput, +mInput - 1, +dInput + 1);

        if (dateFromDate < dateFrom) {
          field.error = "Срок не менее 3 месяцев";
          field.state = false;
        } else if (!checkDateRange(fromDate1Field.value, item.value, 9)) {
          data.find((f) => f.name === "BADD_THIRD").visible = false;
        } else {
          field.state = true;
          field.error = null;
          validateDates(item, data, dFromDate, dtoDateYear);
        }
      }
    }
  }
  if (data.find((f) => f.name === "DTO_DATE2").value) {
    let [dTo, mTo, yTo] = data
      .find((f) => f.name === "DTO_DATE2")
      .value.split(".");
    let dateFromDate2 = new Date(yTo, +mTo - 10, +dTo + 2);
    let dateTo = new Date(yTo, +mTo - 1, +dTo + 1);
    const fromDateField2 = data.find((f) => f.name === "DFROM_DATE1");
    if (fromDateField2.value) {
      let [dInput, mInput, yInput] = fromDateField2.value.split(".");
      let dateFrom2 = new Date(yInput, +mInput - 1, +dInput + 1);
      if (dateFromDate2 > dateFrom2) {
        data.find((f) => f.name === "STHIRD_PERIOD").visible = false;
        data.find((f) => f.name === "BADD_THIRD").visible = false;
        data.find((f) => f.name === "BADD_THIRD").value = 0;
        data.find((f) => f.name === "BADD_THIRD").state = null;
        data.find((f) => f.name === "DFROM_DATE3").visible = false;
        data.find((f) => f.name === "DTO_DATE3").visible = false;
        data.find((f) => f.name === "DFROM_DATE3").value = null;
        data.find((f) => f.name === "DTO_DATE3").value = null;
      } else {
        data.find((f) => f.name === "BADD_THIRD").visible = true;
      }
    }
  }
  if (field.name === "DFROM_DATE2") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      console.log("item.value5:", item.value);
      let [dFrom, mFrom, yFrom] = item.value.split(".");
      let dateToDate = new Date(yFrom, +mFrom + 2, dFrom);
      //let dateToDate2 =  new Date(yFrom, +mFrom+8, dFrom);
      let dateFrom = new Date(yFrom, +mFrom - 1, +dFrom + 1);
      const toDateField = data.find((f) => f.name === "DTO_DATE2");

      if (toDateField.value) {
        let [dInput, mInput, yInput] = toDateField.value.split(".");
        let dateTo = new Date(yInput, +mInput - 1, +dInput + 1);

        if (dateTo < dateToDate) {
          // item.value = null
          toDateField.error = "Срок не менее 3 месяцев";
          toDateField.state = false;
        } else {
          toDateField.state = true;
          toDateField.error = null;
          console.log("field:", field);
        }
      }
    }
    validateDates(item, data, dFromDate, dtoDateYear);
  }
  if (field.name === "DTO_DATE3") {
    console.log("field.name:", field.name);
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      console.log("item.value6:", item.value);
      let [dTo, mTo, yTo] = item.value.split(".");
      let dateFromDate = new Date(yTo, +mTo - 4, +dTo + 2); // добавил переменную, т.к в следующем блоке if переменная dateInput не обновляется
      let dateTo = new Date(yTo, mTo, dTo);
      const fromDateField = data.find((f) => f.name === "DFROM_DATE3");
      if (fromDateField.value) {
        let [dInput, mInput, yInput] = fromDateField.value.split(".");
        let dateFrom = new Date(yInput, +mInput - 1, +dInput + 1);

        if (dateFromDate < dateFrom) {
          console.log("Срок не менее 3 месяцев");

          // item.value = null
          field.error = "Срок не менее 3 месяцев";
          field.state = false;
        } else {
          field.state = true;
          field.error = null;
          validateDates(item, data, dFromDate, dtoDateYear);
        }
      }
    }
  }
  if (field.name === "DFROM_DATE3") {
    console.log("field.name:", field.name);
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      console.log("item.value7:", item.value);
      let [dFrom, mFrom, yFrom] = item.value.split(".");
      let dateToDate = new Date(yFrom, +mFrom + 2, dFrom); // добавил переменную, т.к в следующем блоке if переменная dateInput не обновляется
      let dateFrom = new Date(yFrom, mFrom, dFrom);
      const toDateField = data.find((f) => f.name === "DTO_DATE3");
      if (toDateField.value) {
        let [dInput, mInput, yInput] = toDateField.value.split(".");
        let dateTo = new Date(yInput, +mInput - 1, +dInput + 1);

        if (dateTo < dateToDate) {
          // item.value = null
          toDateField.error = "Срок не менее 3 месяцев";
          toDateField.state = false;
        } else {
          toDateField.state = true;
          toDateField.error = null;
          console.log("field:", field);
        }
      }
    }
    validateDates(item, data, dFromDate, dtoDateYear);
  }
  if (policyType.value == 2) {
    data.find((f) => f.name === "DTO_DATE_YEAR").visible = false;
    data.find((f) => f.name === "DTO_DATE").visible = true;
    data.find((f) => f.name === "PERIOD_LIST").visible = false;
    const createDate = dateCreator(
      data.find((f) => f.name === "DCALC_DATE")?.value
    );
    const fromDate = dateCreator(
      data.find((f) => f.name === "DFROM_DATE")?.value
    );
    periods.visible = false;

    if (field.name === "NOSAGO_TYPE") {
      data.find((f) => f.name === "DTO_DATE_YEAR").visible = false;
      data.find((f) => f.name === "DTO_DATE").visible = true;
      fromDate.setDate(createDate.getDate() + 4);
      dFromDate.value = [
        fromDate.getDate(),
        fromDate.getMonth() + 1,
        fromDate.getFullYear(),
      ]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");

      let [dFrom, mFrom, yFrom] = data
        .find((f) => f.name === "DFROM_DATE")
        .value.split(".");
      let dateFrom = new Date(yFrom, +mFrom - 1, dFrom);
      dateFrom.setFullYear(dateFrom.getFullYear() + 1);
      dateFrom.setDate(dateFrom.getDate() - 1);
      let formattedDate = [
        dateFrom.getDate(),
        dateFrom.getMonth() + 4,
        dateFrom.getFullYear() - 1,
      ]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");
      dtoDateField.value = formattedDate;
    }

    if (field.name === "DFROM_DATE" && item.value) {
      let [dFrom, mFrom, yFrom] = item.value.split(".");
      let dateFrom = new Date(yFrom, +mFrom - 1, dFrom);
      dateFrom.setFullYear(dateFrom.getFullYear() + 1);
      dateFrom.setDate(dateFrom.getDate() - 1);
      let formattedDate = [
        dateFrom.getDate(),
        dateFrom.getMonth() + 4,
        dateFrom.getFullYear() - 1,
      ]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");

      dtoDateField.value = formattedDate;
    }

    const createDatePlus4 = new Date(createDate);
    createDatePlus4.setDate(createDatePlus4.getDate() + 4);

    const fromDatePlus3M = new Date(fromDate);
    fromDatePlus3M.setMonth(fromDatePlus3M.getMonth() + 3);
    fromDatePlus3M.setDate(fromDatePlus3M.getDate() - 1);

    const toDate = dateCreator(data.find((f) => f.name === "DTO_DATE")?.value);

    if (createDatePlus4 > fromDate) {
      dFromDate.error =
        "Дата начала не может быть ранее четырех дней с даты оформления";
      dFromDate.state = false;
    } else {
      dFromDate.state = true;
      dFromDate.error = null;
      validateDates(item, data, dFromDate, dtoDateYear);
    }

    if (fromDatePlus3M < toDate) {
      dtoDateField.error = "Срок страхования от 1 дня до 3 месяцев";
      dtoDateField.state = false;
    } else if (toDate < fromDate) {
      dtoDateField.error = "Дата окончания не может быть раньше даты начала";
      dtoDateField.state = false;
    } else {
      dtoDateField.state = true;
      dtoDateField.error = null;
      validateDates(item, data, dFromDate, dtoDateYear);
    }

    data.find((f) => f.name === "SFIRST_PERIOD").visible = false;
    data.find((f) => f.name === "DFROM_DATE1").visible = false;
    data.find((f) => f.name === "DTO_DATE1").visible = false;
    data.find((f) => f.name === "BADD_SECOND").visible = false;
    data.find((f) => f.name === "SSECOND_PERIOD").visible = false;
    data.find((f) => f.name === "DFROM_DATE2").visible = false;
    data.find((f) => f.name === "DTO_DATE2").visible = false;
    data.find((f) => f.name === "BADD_THIRD").visible = false;
    data.find((f) => f.name === "STHIRD_PERIOD").visible = false;
    data.find((f) => f.name === "DFROM_DATE3").visible = false;
    data.find((f) => f.name === "DTO_DATE3").visible = false;
  }
  if (policyType.value == 3) {
    data.find((f) => f.name === "DTO_DATE_YEAR").visible = false;
    data.find((f) => f.name === "DTO_DATE").visible = true;
    data.find((f) => f.name === "PERIOD_LIST").visible = false;
    periods.visible = false;

    if (field.name === "NOSAGO_TYPE") {
      data.find((f) => f.name === "DTO_DATE_YEAR").visible = false;
      data.find((f) => f.name === "DTO_DATE").visible = true;
      let [dFrom, mFrom, yFrom] = data
        .find((f) => f.name === "DFROM_DATE")
        .value.split(".");
      let dateFrom = new Date(yFrom, +mFrom - 1, dFrom);
      dateFrom.setDate(dateFrom.getDate() + 19);
      dateFrom.setMonth(dateFrom.getMonth() + 1);
      let formattedDate = [
        dateFrom.getDate(),
        dateFrom.getMonth(),
        dateFrom.getFullYear(),
      ]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");
      dtoDateField.value = formattedDate;
      console.log(formattedDate, "formattedDate NOSAGO_TYPE");
    }

    if (field.name === "DFROM_DATE" && item.value) {
      let [dFrom, mFrom, yFrom] = item.value.split(".");
      let dateFrom = new Date(yFrom, +mFrom - 1, dFrom);
      dateFrom.setDate(dateFrom.getDate() + 19);
      dateFrom.setMonth(dateFrom.getMonth() + 1);
      let formattedDate = [
        dateFrom.getDate(),
        dateFrom.getMonth(),
        dateFrom.getFullYear(),
      ]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");
      dtoDateField.value = formattedDate;
      console.log(formattedDate, "formattedDate44444");
    }

    const createDate = dateCreator(
      data.find((f) => f.name === "DCALC_DATE")?.value
    );
    const createDatePlus1 = new Date(createDate);
    createDatePlus1.setDate(createDatePlus1.getDate() + 1);

    const fromDate = dateCreator(
      data.find((f) => f.name === "DFROM_DATE")?.value
    );
    const fromDatePlus19D = new Date(fromDate);
    fromDatePlus19D.setDate(fromDatePlus19D.getDate() + 19);

    const fromDatePlus4D = new Date(fromDate);
    fromDatePlus4D.setDate(fromDatePlus4D.getDate() + 4);

    const toDate = dateCreator(data.find((f) => f.name === "DTO_DATE")?.value);

    if (createDatePlus1 > fromDate) {
      dFromDate.error = `Дата начала страхования должна быть не ранее ${createDatePlus1.toLocaleDateString(
        "ru-RU"
      )}`;
      dFromDate.state = false;
    } else {
      dFromDate.state = true;
      dFromDate.error = null;
      validateDates(item, data, dFromDate, dtoDateYear);
    }

    if (fromDatePlus4D > toDate || toDate > fromDatePlus19D) {
      dtoDateField.error = "Срок страхования от 5 до 20 дней";
      dtoDateField.state = false;
    } else if (toDate < fromDate) {
      dtoDateField.error = "Дата окончания не может быть раньше даты начала";
      dtoDateField.state = false;
    } else {
      dtoDateField.state = true;
      dtoDateField.error = null;
      validateDates(item, data, dFromDate, dtoDateYear);
    }

    data.find((f) => f.name === "SFIRST_PERIOD").visible = false;
    data.find((f) => f.name === "DFROM_DATE1").visible = false;
    data.find((f) => f.name === "DTO_DATE1").visible = false;
    data.find((f) => f.name === "BADD_SECOND").visible = false;
    data.find((f) => f.name === "SSECOND_PERIOD").visible = false;
    data.find((f) => f.name === "DFROM_DATE2").visible = false;
    data.find((f) => f.name === "DTO_DATE2").visible = false;
    data.find((f) => f.name === "BADD_THIRD").visible = false;
    data.find((f) => f.name === "STHIRD_PERIOD").visible = false;
    data.find((f) => f.name === "DFROM_DATE3").visible = false;
    data.find((f) => f.name === "DTO_DATE3").visible = false;
  }
  if (field.name === "NOSAGO_TYPE" && item.value == 1) {
    data.find((f) => f.name === "DTO_DATE_YEAR").visible = true;
    data.find((f) => f.name === "DTO_DATE").visible = false;

    const [dCreate, mCreate, yCreate] = data
      .find((f) => f.name === "DCALC_DATE")
      .value.split(".");
    const dateCreate = new Date(yCreate, +mCreate, dCreate);
    dateCreate.setDate(dateCreate.getDate() + 1);
    const formattedCreateDate = [
      dateCreate.getDate(),
      dateCreate.getMonth(),
      dateCreate.getFullYear(),
    ]
      .map((n) => (n < 10 ? `0${n}` : `${n}`))
      .join(".");
    dFromDate.value = formattedCreateDate;

    let [dFrom, mFrom, yFrom] = data
      .find((f) => f.name === "DFROM_DATE")
      .value.split(".");
    let dateFrom = new Date(yFrom, +mFrom, dFrom);
    dateFrom.setFullYear(dateFrom.getFullYear() + 1);
    dateFrom.setDate(dateFrom.getDate() - 1);
    let formattedDate = [
      dateFrom.getDate(),
      dateFrom.getMonth(),
      dateFrom.getFullYear(),
    ]
      .map((n) => (n < 10 ? `0${n}` : `${n}`))
      .join(".");
    data.find((f) => f.name === "DTO_DATE_YEAR").value = formattedDate;
  }

  data.map((el) => {
    if (el.name.includes("DTO_DATE") || el.name.includes("DFROM_DATE")) {
      console.log(el.name, el, "el");
    }
    return el;
  });
  return data;
}
