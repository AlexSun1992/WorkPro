const arrFieldsTS = [
  "DATA_VEHICLE",
  "IDVEHICLETYPE",
  "IDBRAND",
  "IDMODEL",
  "SMODEL",
  "IDTARGET",
  "NBUILD_YEAR",
  "NPOWER",
  "NKVT_POWER",
  "BUSED_TRAILER",
];
const changedVisibleFields = [
  "SBODYNUMBER",
  "SVIN",
  "BNO_VIN", // control
  "NWEIGHT",
  "NSEATS_COUNT",
];

let needShowInfo = true;

function toggleVisibleFields(data) {
  const objectFieldsTS = [...arrFieldsTS, ...changedVisibleFields].map((field) => findField(data, field));
  objectFieldsTS.forEach((field) => (field.visible = false));
}
function showFields(data) {
  const idType = findField(data, "IDVEHICLETYPE");
  const visibleFields = arrFieldsTS.map((field) => findField(data, field));
  visibleFields.forEach((field) => {
    field.visible = true;
  });

  const [bodyNumber, vin, vinToggler, weight, seatsCount] = changedVisibleFields.map((field) => findField(data, field));
  bodyNumber.visible = vinToggler.value;
  vin.visible = !vinToggler.value;
  vinToggler.visible = true;
  weight.visible = idType.value === 4;
  seatsCount.visible = idType.value === 3;
}

function findField(data, name) {
  const field = data.find((item) => item.name === name);

  if (field) {
    return field;
  }
  console.error(`findField. Поле ${name} не найдено в данных`);

  return {};
}

function setValueEmptyStateNull(field) {
  field.value = "";
  field.state = null;
}

function clearType(idType) {
  if (idType?.value) {
    const validSelectedValue = idType.options?.find((option) => option.value === idType.value);
    if (!validSelectedValue) {
      idType.value = undefined;
      idType.state = null;
      idType.ckecked = false;
    }
  }
}

function setValueModelBrand(data) {
  const IDBRAND = findField(data, "IDBRAND");
  const IDMODEL = findField(data, "IDMODEL");
  const brandmodel = findField(data, "SMODEL");

  const brandValue = IDBRAND.options?.find((item) => item.value === IDBRAND.value);
  const idModelText = IDMODEL.options?.find((item) => item.value === IDMODEL.value);

  // Устанавливаем значение если есть  Марка и Модель
  if (idModelText?.text && brandValue?.text && IDMODEL.state && IDBRAND.state) {
    brandmodel.value = !idModelText.text.toLowerCase().includes("иное")
      ? `${brandValue.text} ${idModelText.text}`
      : `${brandValue.text}`;
    brandmodel.state = true;
  }
}

function showInfo(helpInformer, visible) {
  if (needShowInfo) {
    helpInformer.visible = visible;
  } else {
    helpInformer.visible = false;
  }
}

export function eventHandler(data, item, callback) {
  const IDMODEL = findField(data, "IDMODEL");
  const IDBRAND = findField(data, "IDBRAND");
  if (["IDMODEL", "IDBRAND", "IDVEHICLETYPE"].includes(item.name) && IDBRAND.value === null && IDMODEL.value === null) {
    return data;
  }
  const svin = findField(data, "SVIN");
  const sModel = findField(data, "SMODEL");
  const BNO_VIN = findField(data, "BNO_VIN");
  const Save = findField(data, "Save");
  const Continue = findField(data, "Continue");
  const NWEIGHT = findField(data, "NWEIGHT");
  const NSEATS_COUNT = findField(data, "NSEATS_COUNT");
  const regNum = findField(data, "SREGNUM");
  const idType = findField(data, "IDVEHICLETYPE");
  const helpInformer = findField(data, "SHELP_INFO");

  if (item.resp) {
    setValueModelBrand(data);
    needShowInfo = false;
  }

  if (item.name === "IDVEHICLE_POLICY") {
    if (item.value) {
      toggleVisibleFields(data);
      Continue.visible = false;
      Save.visible = true;
      return data;
    }
    if (regNum.value === "N") {
      showFields(data);
      Continue.visible = true;
      Save.visible = false;
      return data;
    }
  }

  if (item.name === "SREGNUM") {
    if (item.value === "N") {
      showFields(data);
      Continue.visible = true;
      Save.visible = false;
      showInfo(helpInformer, false);
      return data;
    }
    if (regNum.value === null || regNum.value?.length < 7) {
      toggleVisibleFields(data);
      Continue.visible = false;
      Save.visible = true;
      showInfo(helpInformer, true);
      return data;
    }
  }

  Save.visible = !Continue.visible;

  if (item.name === "IDBRAND") {
    if (IDBRAND.value) {
      IDMODEL.visible = IDMODEL.visible;
      idType.visible = IDMODEL.visible;
    }

    if (IDBRAND.state === false || !sModel?.value?.includes(IDBRAND.value)) {
      setValueEmptyStateNull(sModel);
      sModel.checked = false;

      // очищаем модель, если нет марки
      setValueEmptyStateNull(IDMODEL);

      // очищаем тип ТС, если нет модели
      setValueEmptyStateNull(idType);
    }
  }

  // Модель (не нашли в списке)
  if (item.name === "IDMODEL") {
    if (IDMODEL.value) {
      setValueModelBrand(data);
    }

    if (IDMODEL.state === false) {
      setValueEmptyStateNull(sModel);
    }
  }

  // Скрываем поля Вес и Пассажиры если тип не 3 и 4
  if (["IDVEHICLETYPE", "IDMODEL", "IDBRAND"].includes(item.name)) {
    clearType(idType);
    NSEATS_COUNT.visible = idType.value === 3;
    NWEIGHT.visible = idType.value === 4;
  }

  // Сбрасываем значение в поле Марка-Модель при невалидной марке или модели
  // !IDMODEL.state ||
  if (!IDBRAND.state) {
    setValueEmptyStateNull(sModel);
  }

  //  Добавляем значение в поле Марка-Модель при валидной марке и модели
  if (item.name === "IDVEHICLETYPE") {
    setValueModelBrand(data);
  }

  if (item.name === "SMODEL") {
    // Валидируем поле (не более 160 символов)
    if (item.value.length > 160) {
      sModel.state = false;
      sModel.error = "Значение поля не должно превышать 160 символов";
      sModel.value = sModel.value.slice(0, 160);
    }

    if (item.value.length <= 160 || item.value === "") {
      sModel.state = null;
      sModel.error = null;
    }
  }

  // Поле марка-модель стало обязательным
  if (sModel.value?.length > 1 && sModel.value?.length <= 160) {
    sModel.state = true;
    sModel.error = null;
  }

  // Валидация полей мощности
  // лошадиные силы
  if (item.name === "NPOWER") {
    const fieldNHORSE = findField(data, "NPOWER");
    // Условие если пользователь ввел больше 999
    if (item.value > 999) {
      fieldNHORSE.state = false;
      fieldNHORSE.error = "Значение должно быть от 1 до 999";
    }
    // условие если пользователь ввел 0
    else if (item.value < 1) {
      const fieldNKH = findField(data, "NKVT_POWER");
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
      const fieldNKH = findField(data, "NKVT_POWER");
      fieldNKH.value = Math.round((Number(item.value) * 100) / 1.3596) / 100;
      fieldNKH.state = true;
      delete fieldNKH.error;
      fieldNHORSE.state = true;
      delete fieldNHORSE.error;
    }
  }

  // КВТ
  if (item.name === "NKVT_POWER") {
    const fieldNKH = findField(data, "NKVT_POWER");
    // условие если пользователь ввел число больше 734.77
    if (item.value > 734.77) {
      fieldNKH.state = false;
      fieldNKH.error = "Значение должно быть от 1 до 734.77";
      // условие если пользователь ввел 0
    } else if (item.value < 1) {
      const fieldNHORSE = findField(data, "NPOWER");
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
      const fieldNHORSE = findField(data, "NPOWER");
      fieldNHORSE.value = Math.round(Number(item.value) * 100 * 1.3596) / 100;
      fieldNHORSE.state = true;
      delete fieldNHORSE.error;
      fieldNKH.state = true;
      delete fieldNKH.error;
    }
  }

  // При отсутствии VIN скрываем поле
  if (item.name === "BNO_VIN") {
    if (BNO_VIN.value === true) {
      findField(data, "SBODYNUMBER").visible = true;
      findField(data, "SVIN").visible = false;
    } else {
      findField(data, "SBODYNUMBER").visible = false;
      findField(data, "SVIN").visible = true;
    }
  }

  // Проверка VIN на количество символов
  if (item.name === "SVIN") {
    svin.value = item.value.toUpperCase();
    if (svin.state === false) {
      svin.error = "VIN должен состоять из 17 символов";
    } else {
      svin.error = null;
    }
  }

  IDMODEL.visible = IDBRAND.visible;
  idType.visible = IDBRAND.visible;
  return data;
}

export function initHandler(data) {
  if (data[0]?.id !== "1105") return;
  const IDMODEL = findField(data, "IDMODEL");
  const IDBRAND = findField(data, "IDBRAND");
  const idType = findField(data, "IDVEHICLETYPE");
  const regNum = findField(data, "SREGNUM");
  const Save = findField(data, "Save");
  const Continue = findField(data, "Continue");
  const helpInfo = findField(data, "SHELP_INFO");
  const SMODEL = findField(data, "SMODEL");

  if (!helpInfo.visible) {
    needShowInfo = false;
  }

  clearType(idType);

  const isVisibleFields = IDMODEL?.value > 0 || regNum.value?.length > 7 || regNum.value === "N";

  // При наличии Марки заполняем поле Марка-Модель
  if (IDBRAND.value) {
    const brandValue = IDBRAND.options?.find((item) => item.value === IDBRAND.value);
    SMODEL.value = brandValue.text;
    SMODEL.state = true;
  }

  if (IDBRAND.value && IDMODEL.value) {
    setValueModelBrand(data);
  }

  Continue.visible = isVisibleFields;
  Save.visible = !isVisibleFields;
  IDBRAND.visible = isVisibleFields;
  IDMODEL.visible = isVisibleFields;
  idType.visible = isVisibleFields;
  return data;
}
