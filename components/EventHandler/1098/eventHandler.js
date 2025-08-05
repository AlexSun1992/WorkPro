export function scrollToCardHead() {
  const selector = ".wizard_osago";

  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function eventHandler(data, item, callback) {
  function findField(name) {
    const field = data.find((field) => field.name === name);
    if (field) {
      return field;
    }
    console.warn("can't find field", name);
    return {};
  }
  function changeVisibleSafety(name, value) {
    const field = findField(name);
    if (field) {
      field.visible = value;
    }
  }

  const stoa = findField("IDSTOA");
  const previousSeriesEdit = findField("IDLAST_SERIES_EDIT");
  const previousNumberEdit = findField("SLAST_NUMBER_EDIT");
  // Блок управления полями серии и номера предыдущего полиса в ОСАГО начало
  const masrAsValid = (field) => {
    field.error = null;
    field.state = true;
    field.required = true;
  };

  const resetField = (field) => {
    field.state = null;
    field.error = null;
    field.required = false;
  };

  const markAsError = (field) => {
    field.error = "Пожалуйста,заполните поле";
    field.state = false;
    field.required = true;
  };
  // IDLAST_SERIES_EDIT - Серия предыдущий полис ОСАГО
  if (item.name === "IDLAST_SERIES_EDIT" && previousSeriesEdit.value) {
    masrAsValid(previousSeriesEdit);
    previousNumberEdit.required = true;
    if (!previousNumberEdit.value) {
      previousNumberEdit.state = false;
      previousNumberEdit.error = "Пожалуйста,заполните поле";
    }
  }

  // SLAST_NUMBER_EDIT - Номер предыдущего полиса ОСАГО
  if (item.name === "SLAST_NUMBER_EDIT" && previousNumberEdit.value) {
    masrAsValid(previousNumberEdit);
    previousSeriesEdit.required = true;

    if (!previousSeriesEdit.value) {
      previousSeriesEdit.state = false;
      previousSeriesEdit.error = "Пожалуйста,заполните поле";
    }
  }

  //- Серия Номер предыдущего полиса ОСАГО
  // При отсутствии Серии и наличии Номера делаем поле Серия обязательным
  if (item.name === "IDLAST_SERIES_EDIT" && !item.value && previousNumberEdit.value) {
    markAsError(previousSeriesEdit);
  }

  // - Серия Номер предыдущего полиса ОСАГО
  // При отсутствии значений поля Серия и Номер становятся необязательными
  if (!previousSeriesEdit.value && !previousNumberEdit.value) {
    resetField(previousSeriesEdit);
    resetField(previousNumberEdit);
  }
  // - Серия Номер предыдущего полиса ОСАГО
  // При наличии значений поля Серия и Номер обязательные
  if (previousSeriesEdit.value && previousNumberEdit.value) {
    masrAsValid(previousSeriesEdit);
    masrAsValid(previousNumberEdit);
  }
  // Блок управления полями серии и номера предыдущего полиса в ОСАГО конец
  if (item.name === "SURL_TECH") {
    stoa.visible = true;
    changeVisibleSafety("STECH_INFO", false);
    changeVisibleSafety("SURL_TECH", false);
  }
  if (stoa.visible === true) {
    if (stoa.value == 2) {
      changeVisibleSafety("IDLIST_STOA", true);
      changeVisibleSafety("SADDRESS_STOA", false);
    } else if (stoa.value == 4) {
      changeVisibleSafety("IDLIST_STOA", false);
      changeVisibleSafety("SADDRESS_STOA", true);
    } else {
      changeVisibleSafety("IDLIST_STOA", false);
      changeVisibleSafety("SADDRESS_STOA", false);
    }
  }
  if (item.name === "SURL_ADD_DATA") {
    changeVisibleSafety("IDLAST_SERIES_EDIT", true);
    changeVisibleSafety("SLAST_NUMBER_EDIT", true);
    changeVisibleSafety("IDLAST_COMPANY_EDIT", true);
    changeVisibleSafety("SADD_INFO_EDIT", true);

    changeVisibleSafety("SLAST_SERIES", false);
    changeVisibleSafety("SLAST_NUMBER", false);
    changeVisibleSafety("SLAST_COMPANY", false);
    changeVisibleSafety("SADD_INFO", false);

    changeVisibleSafety("SURL_ADD_DATA", false);
  }
  const vehicleData = findField("SVEHICLE_DATA");
  if (vehicleData.visible) {
    changeVisibleSafety("IDSTOA", false);

    changeVisibleSafety("IDLIST_STOA", false);
    changeVisibleSafety("SADDRESS_STOA", false);
    changeVisibleSafety("IDLAST_SERIES_EDIT", false);
    changeVisibleSafety("SLAST_NUMBER_EDIT", false);
    changeVisibleSafety("IDLAST_COMPANY_EDIT", false);
    changeVisibleSafety("SADD_INFO_EDIT", false);

    changeVisibleSafety("STECH_INFO", false);
    changeVisibleSafety("SURL_TECH", false);
    changeVisibleSafety("SLAST_SERIES", false);
    changeVisibleSafety("SLAST_NUMBER", false);
    changeVisibleSafety("SLAST_COMPANY", false);
    changeVisibleSafety("SADD_INFO", false);
    changeVisibleSafety("SURL_ADD_DATA", false);
  }

  return data;
}

export function initHandler(data) {
  scrollToCardHead();
}
