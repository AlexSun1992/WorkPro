async function eventHandler(data, item, callback) {
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

  function formatDate(dateStr) {
    const [day, month, year] = dateStr.split(".");
    return `${year}-${month}-${day}`;
  }

  function validateDates(item, data, dFromDate, dtoDateYear) {
    const listDFROMNamesDate = ["DFROM_DATE1", "DFROM_DATE2", "DFROM_DATE3"];
    const listDTONamesDate = ["DTO_DATE1", "DTO_DATE2", "DTO_DATE3"];

    // Проверяем, относится ли поле к датам начала или окончания срока
    const isDFROMDateExists = listDFROMNamesDate.some(
      (name) => name === item.name
    );
    const isDTODateExists = listDTONamesDate.some((name) => name === item.name);

    if (!isDFROMDateExists && !isDTODateExists) return;

    // Форматируем даты в стандартный формат

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
      if (!prevDTOItem) return;

      const prevDTODateReplace = formatDate(prevDTOItem.value);
      const prevDTODateValid = new Date(prevDTODateReplace);

      if (dateInListValid <= prevDTODateValid) {
        currentItem.error = "Сроки не последовательны";
        currentItem.state = false;
      }
    }
  }

  validateDates(item, data, dFromDate, dtoDateYear);

  if (field.name === "DFROM_DATE") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
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
          // item.value = null
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
      //data.find((f) => f.name === 'PERIOD_LIST').visible = true;
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
          let formattedDate2 = [
            dateFrom.getDate(),
            dateFrom.getMonth() + 4,
            dateFrom.getFullYear() - 1,
          ]
            .map((n) => (n < 10 ? `0${n}` : `${n}`))
            .join(".");
          dtoDate1Field.value = formattedDate2;
        }
      }
      data.find((f) => f.name === "SFIRST_PERIOD").visible = true;
      data.find((f) => f.name === "DFROM_DATE1").visible = true;
      data.find((f) => f.name === "DTO_DATE1").visible = true;
      data.find((f) => f.name === "BADD_SECOND").visible = true;
    } else {
      //data.find((f) => f.name === 'PERIOD_LIST').visible = false;
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
    if (badd2.value == 1 && badd2.visible == true) {
      data.find((f) => f.name === "SSECOND_PERIOD").visible = true;
      data.find((f) => f.name === "DFROM_DATE2").visible = true;
      data.find((f) => f.name === "DTO_DATE2").visible = true;
      //data.find((f) => f.name === 'BADD_THIRD').visible = true;
    } else {
      data.find((f) => f.name === "SSECOND_PERIOD").visible = false;
      data.find((f) => f.name === "DFROM_DATE2").visible = false;
      data.find((f) => f.name === "DTO_DATE2").visible = false;
      //data.find((f) => f.name === 'BADD_THIRD').visible = false;
      data.find((f) => f.name === "DFROM_DATE2").value = null;
      data.find((f) => f.name === "DTO_DATE2").value = null;
      //data.find((f) => f.name === 'BADD_THIRD').value = 0;
    }
    if (badd3.value == 1 && badd3.visible == true) {
      data.find((f) => f.name === "STHIRD_PERIOD").visible = true;
      data.find((f) => f.name === "DFROM_DATE3").visible = true;
      data.find((f) => f.name === "DTO_DATE3").visible = true;
    } else {
      data.find((f) => f.name === "STHIRD_PERIOD").visible = false;
      data.find((f) => f.name === "DFROM_DATE3").visible = false;
      data.find((f) => f.name === "DTO_DATE3").visible = false;
      data.find((f) => f.name === "DFROM_DATE3").value = null;
      data.find((f) => f.name === "DTO_DATE3").value = null;
    }
  }
  if (field.name === "DTO_DATE1") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      let [dTo, mTo, yTo] = item.value.split(".");
      let dateFromDate = new Date(yTo, +mTo - 4, +dTo + 2);
      let dateFromDate2 = new Date(yTo, +mTo - 10, +dTo + 2);
      let dateTo = new Date(yTo, +mTo - 1, +dTo + 1);
      const fromDateField = data.find((f) => f.name === "DFROM_DATE1");

      if (fromDateField.value) {
        let [dInput, mInput, yInput] = fromDateField.value.split(".");
        let dateFrom = new Date(yInput, +mInput - 1, +dInput + 1);

        if (dateFromDate < dateFrom) {
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
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      let [dFrom, mFrom, yFrom] = item.value.split(".");
      let dateToDate = new Date(yFrom, +mFrom + 2, dFrom);
      let dateToDate2 = new Date(yFrom, +mFrom + 8, dFrom);
      let dateFrom = new Date(yFrom, +mFrom - 1, +dFrom + 1);
      const toDateField = data.find((f) => f.name === "DTO_DATE1");

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
          validateDates(item, data, dFromDate, dtoDateYear);
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
    }
  }
  if (field.name === "DTO_DATE2") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      let [dTo, mTo, yTo] = item.value.split(".");
      let dateFromDate = new Date(yTo, +mTo - 4, +dTo + 2);
      let dateFromDate2 = new Date(yTo, +mTo - 10, +dTo + 2);
      let dateTo = new Date(yTo, +mTo - 1, +dTo + 1);
      const fromDateField = data.find((f) => f.name === "DFROM_DATE2");

      if (fromDateField.value) {
        let [dInput, mInput, yInput] = fromDateField.value.split(".");
        let dateFrom = new Date(yInput, +mInput - 1, +dInput + 1);

        if (dateFromDate < dateFrom) {
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
          validateDates(item, data, dFromDate, dtoDateYear);
        }
      }
    }
  }
  if (field.name === "DTO_DATE3") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      let [dTo, mTo, yTo] = item.value.split(".");
      let dateFromDate = new Date(yTo, +mTo - 4, +dTo + 2); // добавил переменную, т.к в следующем блоке if переменная dateInput не обновляется
      let dateTo = new Date(yTo, mTo, dTo);
      const fromDateField = data.find((f) => f.name === "DFROM_DATE3");
      if (fromDateField.value) {
        let [dInput, mInput, yInput] = fromDateField.value.split(".");
        let dateFrom = new Date(yInput, +mInput - 1, +dInput + 1);

        if (dateFromDate < dateFrom) {
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
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
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
          validateDates(item, data, dFromDate, dtoDateYear);
        }
      }
    }
  }
  if (policyType.value == 2) {
    data.find((f) => f.name === "DTO_DATE_YEAR").visible = false;
    data.find((f) => f.name === "DTO_DATE").visible = true;
    data.find((f) => f.name === "PERIOD_LIST").visible = false;
    periods.visible = false;
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
    if (field.name === "DFROM_DATE" && item.value) {
      let [dFrom, mFrom, yFrom] = item.value.split(".");
      let dateFrom = new Date(yFrom, +mFrom - 1, dFrom);
      dateFrom.setFullYear(dateFrom.getFullYear() + 1);
      dateFrom.setDate(dateFrom.getDate() - 1);
      let formattedDate = [
        dateFrom.getDate() + 20,
        dateFrom.getMonth() + 1,
        dateFrom.getFullYear() - 1,
      ]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");
      dtoDateField.value = formattedDate;
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
    let [dFrom, mFrom, yFrom] = data
      .find((f) => f.name === "DFROM_DATE")
      .value.split(".");
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
    data.find((f) => f.name === "DTO_DATE_YEAR").value = formattedDate;
  }
  if (field.name === "NOSAGO_TYPE" && item.value == 2) {
    data.find((f) => f.name === "DTO_DATE_YEAR").visible = false;
    data.find((f) => f.name === "DTO_DATE").visible = true;
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
  if (field.name === "NOSAGO_TYPE" && item.value == 3) {
    data.find((f) => f.name === "DTO_DATE_YEAR").visible = false;
    data.find((f) => f.name === "DTO_DATE").visible = true;
    let [dFrom, mFrom, yFrom] = data
      .find((f) => f.name === "DFROM_DATE")
      .value.split(".");
    let dateFrom = new Date(yFrom, +mFrom - 1, dFrom);
    dateFrom.setFullYear(dateFrom.getFullYear() + 1);
    dateFrom.setDate(dateFrom.getDate() - 1);
    let formattedDate = [
      dateFrom.getDate() + 20,
      dateFrom.getMonth() + 1,
      dateFrom.getFullYear() - 1,
    ]
      .map((n) => (n < 10 ? `0${n}` : `${n}`))
      .join(".");
    dtoDateField.value = formattedDate;
  }

  return data;
}
