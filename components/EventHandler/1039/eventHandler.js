export async function eventHandler(data, item, callback) {
  //async function eventHandler(fields, action, func) {
  // console.log("item:eventHandler",item)
  function findField(name) {
    const field = data.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  function isValidExperience(driverAge, drivingExperience) {
    if (drivingExperience === "") {
      return false;
    }
    if (isNaN(driverAge) || isNaN(drivingExperience) || Number(drivingExperience) < 0) {
      return false;
    }
    if (driverAge === 0) {
      return Number(drivingExperience) >= 0;
    }
    if (driverAge < 18) {
      return false;
    }
    return driverAge - Number(drivingExperience) >= 18;
  }

  const insuranceList = data.find(({ name }) => name === "INSURED_LIST");
  if (insuranceList && ["NSTAGE", "NAGE"].includes(item?.value?.value?.name)) {
    const driverIndex = item.value.index;
    const driverFields = insuranceList.value[driverIndex];
    const newExpField = { ...driverFields[1] };
    const drivingExperience = driverFields[1].value;
    const driverAge = Number(driverFields[0].value);
    const isValid = isValidExperience(driverAge, drivingExperience);

    newExpField.state = false;
    newExpField.error = "Некорректное значение";
    if (drivingExperience === "") {
      delete newExpField.error;
    }
    if (isValid) {
      newExpField.state = true;
      delete newExpField.error;
    }
    driverFields[1] = newExpField;
  }

  const field = data.find((f) => f.fieldId === item.fieldId);
  const address = data.find((f) => f.name === "SCOVERTERR");
  const IDBRAND = data.find(({ name }) => name === "IDBRAND");
  const IDMODEL = data.find(({ name }) => name === "IDMODEL");
  const SMODEL = data.find((f) => f.name === "SMODEL");

  if (item.name === "SCOVERTERR") {
    address.value === null ? (address.state = false) : (address.state = true);
    address.state === false ? (address.error = "Укажите адрес") : (address.error = null);
  }

  // Валидация полей мощности
  // лошадиные силы
  if (item.name === "NPOWER") {
    const fieldNHORSE = findField("NPOWER");
    // Условие если пользователь ввел больше 999
    if (item.value > 999) {
      fieldNHORSE.state = false;
      fieldNHORSE.error = "Значение должно быть от 1 до 999";
    }
    // условие если пользователь ввел 0
    else if (item.value < 1) {
      const fieldNKH = findField("NKVT_POWER");
      fieldNKH.value = null;
      if (fieldNHORSE.state !== null) {
        fieldNKH.state = null;
        fieldNKH.error = "Некорректное значение";
      }
      fieldNHORSE.state = false;
      fieldNHORSE.error = "Значение должно быть от 1 до 999";
    } else if (!item.value) {
      fieldNHORSE.state = false;
    } else {
      const fieldNKH = findField("NKVT_POWER");
      console.log("fieldNKH:", fieldNKH);
      fieldNKH.value = Math.round((Number(item.value) * 100) / 1.3596) / 100;
      fieldNKH.state = true;
      delete fieldNKH.error;
      fieldNHORSE.state = true;
      delete fieldNHORSE.error;
    }
  }

  // КВТ
  if (item.name === "NKVT_POWER") {
    const fieldNKH = findField("NKVT_POWER");
    // условие если пользователь ввел число больше 734.77
    if (item.value > 734.77) {
      fieldNKH.state = false;
      fieldNKH.error = "Значение должно быть от 1 до 734.77";
      // условие если пользователь ввел 0
    } else if (item.value < 1) {
      const fieldNHORSE = findField("NPOWER");
      fieldNHORSE.value = null;
      if (fieldNKH.state !== null) {
        fieldNHORSE.state = null;
        fieldNHORSE.error = "Некорректное значение";
      }
      fieldNKH.state = false;
      fieldNKH.error = "Значение должно быть от 1 до 734.77";
    } else if (!item.value) {
      fieldNKH.state = false;
    } else {
      const fieldNHORSE = findField("NPOWER");
      fieldNHORSE.value = Math.round(Number(item.value) * 100 * 1.3596) / 100;
      fieldNHORSE.state = true;
      delete fieldNHORSE.error;
      fieldNKH.state = true;
      delete fieldNKH.error;
    }
  }

  if (item.name === "IDBRAND") {
    if (!IDBRAND.value) {
      IDMODEL.visible = true;
      SMODEL.value = undefined;
      SMODEL.state = null;
    }
    if (IDBRAND.value) {
      IDMODEL.visible = true;
      SMODEL.value = IDBRAND.options.find((item) => item.value === IDBRAND.value).text;
    }
  }

  if (item.name === "IDMODEL") {
    if (IDMODEL.value) {
      const idModelText = IDMODEL.options.find((item) => item.value === IDMODEL.value).text;

      const brandValue = IDBRAND.options.find((item) => item.value === IDBRAND.value).text;

      if (brandValue === SMODEL.value) {
        SMODEL.value = `${SMODEL.value} ${idModelText}`;
      }

      if (brandValue !== SMODEL.value) {
        SMODEL.value = `${brandValue} ${idModelText}`;
      }
    }
  }

  if (item.name === "SMODEL") {
    if (item.value === "") {
      SMODEL.state = null;
      SMODEL.error = null;
    }
  }

  // Поле охранная система
  const fieldBSEARCH_SYSTEM = data.find(({ name }) => name === "BSEARCH_SYSTEM");

  if (fieldBSEARCH_SYSTEM.value === true) {
    data.find((f) => f.name === "IDSEARCH_SYSTEM").visible = true;
  }
  if (fieldBSEARCH_SYSTEM.value === false) {
    data.find((f) => f.name === "IDSEARCH_SYSTEM").visible = false;
  }

  //const driverType = findField("NDRIVER_TYPE");
  //const insuredList = findField(`INSURED_LIST`);

  //const changeElements = ([...params], property, value) => {
  // params.forEach((el) => {
  // el[property] = value;
  //});
  //};

  //const invertPropertyElements = ([...params], property) => {
  // params.forEach((el) => {
  //   el[property] = !el[property];
  // });
  //};

  //const horseVehiclePower = findField("NPOWER");
  //const khVeiclePower = findField("NKVT_POWER");

  //function setFields({ fieldName }) {
  //const field = fields.find((f) => f.name === fieldName);
  // валидация полей мощности
  // лошадинные силы

  //if (action.name !== undefined) {
  //setFields({ fieldName: action.name });
  //}

  const driverType = data.find(({ name }) => name === "NDRIVER_TYPE"); //findField("NDRIVER_TYPE");

  if (driverType.value == 1) {
    data.find((f) => f.name === "INSURED_LIST").visible = true;
  }

  if (driverType.value == 2) {
    data.find((f) => f.name === "INSURED_LIST").visible = false;
  }

  return data;
}

export function initHandler(data) {
  const idBrand = data.find(({ name }) => name === "IDBRAND");
  const sModel = data.find((f) => f.name === "SMODEL");
  const idModel = data.find((f) => f.name === "IDMODEL");

  const nBuildYear = data.find((f) => f.name === "NBUILD_YEAR");

  if (nBuildYear && nBuildYear.value && nBuildYear.options && nBuildYear.options.length) {
    const validSelectedValue = nBuildYear.options.find((option) => option.value === nBuildYear.value);
    if (!validSelectedValue) {
      nBuildYear.value = undefined;
      nBuildYear.state = null;
      nBuildYear.ckecked = false;
    }
  }

  if (idBrand && idBrand.value && idBrand.options && idBrand.options.length) {
    const validSelectedValue = idBrand.options.find((option) => option.value === idBrand.value);
    if (!validSelectedValue) {
      idBrand.value = undefined;
      idBrand.state = null;
      idBrand.ckecked = false;

      idModel.value = undefined;
      idModel.state = null;
      idModel.ckecked = false;
    }
  }

  if (idModel && idModel.value && idModel.options && idModel.options.length) {
    const validSelectedValueModel = idModel.options.find((option) => option.value === idModel.value);
    if (!validSelectedValueModel) {
      idModel.value = undefined;
      idModel.state = null;
      idModel.ckecked = false;
    }
  }

  if (idModel.state === true && idBrand.state === true) {
    const idBrandValueText = idBrand.options.find((item) => item.value === idBrand.value);
    const idModelValueText = idModel.options.find((item) => item.value === idModel.value);
    sModel.value = `${idBrandValueText.text} ${idModelValueText.text}`;
  }

  if (sModel.value) {
    sModel.state = true;
    sModel.error = null;
  }

  if (!sModel.value) {
    sModel.state = null;
    sModel.error = null;
  }

  if (idBrand.value > 0) {
    idModel.visible = true;
  }
  return data;
}
