(() => {

function setValueEmptyStateNull(field) {
  field.value = "";
  field.state = null;
}

function setValueModelBrand(data) {
  const brand = findField(data, "IDBRAND");
  const model = findField(data, "IDMODEL");
  const brandmodel = findField(data, "SMODEL");

  const brandValue = brand.options.find((item) => item.value === brand.value);
  const idModelText = model.options.find((item) => item.value === model.value);

  if (idModelText?.text && brandValue?.text && model.state && brand.state) {
    brandmodel.value = `${brandValue.text} ${idModelText.text}`;
  }
}

  function findField(data, name) {
    const field = data.find((item) => item.name === name);

    if (field) {
      return field;
    }
    console.error(`findField. Поле ${name} не найдено в данных`);

    return null;
  }

let ONLY_ONCE_INITED = false;

function eventHandler(data, item, callback) {
  if (!ONLY_ONCE_INITED) {
    setTimeout(() => {
      ONLY_ONCE_INITED = true;
    }, 1000)
  }

  const svin = findField(data, "SVIN");
  const sModel = findField(data, "SMODEL");
  const model = findField(data, "IDMODEL");
  const IDBRAND = findField(data, "IDBRAND");
  const IDMODEL = findField(data, "IDMODEL");
  const BNO_VIN = findField(data, "BNO_VIN");
  const Save = findField(data, "Save");
  const Continue = findField(data, "Continue");
  const NWEIGHT = findField(data, "NWEIGHT");
  const NSEATS_COUNT = findField(data, "NSEATS_COUNT");
  const regNum = findField(data, "SREGNUM");
  const idType = findField(data, "IDVEHICLETYPE");
  const helpInformer = findField(data, "SHELP_INFO");

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
    "SVIN",
    "SBODYNUMBER",
    "BNO_VIN",
    "BUSED_TRAILER",
    "NWEIGHT",
    "NSEATS_COUNT",
    "Continue",
  ];

  const objectFieldsTS = arrFieldsTS.map((field) => findField(data, field));

  function visibleTS(visible) {
    // eslint-disable-next-line no-param-reassign,no-return-assign
    objectFieldsTS.forEach((f) => (f.visible = visible));
  }

  if (item.resp) {
    setValueModelBrand(data);
  }

  if (item.name === "SREGNUM") {
    helpInformer.visible = item?.value === null;
  }

  Continue.visible = IDMODEL.visible;
  Save.visible = !IDMODEL.visible;

  if (!idType.options.length) {
    idType.value = null;
  }

  if (["IDVEHICLETYPE", 'IDMODEL'].includes(item.name) && idType.value !== 4 && idType.value !== 3) {
    NWEIGHT.visible = false;
    NSEATS_COUNT.visible = false;
  }

  if (item.name === "IDVEHICLETYPE" && idType.value === 4) {
    NWEIGHT.visible = true;
    NSEATS_COUNT.visible = false;
  }
  if (item.name === "IDVEHICLETYPE" && idType.value === 3) {
    NSEATS_COUNT.visible = true;
    NWEIGHT.visible = false;
  }
  if (item.name === "IDVEHICLE_POLICY") {
    Save.visible = true;
  }
  if (item.name === "SREGNUM" && ONLY_ONCE_INITED) {
    visibleTS(false);
    Save.visible = true;
  }

  if (item.name === "IDBRAND") {
    if (!IDBRAND.value) {
      IDMODEL.visible = true;
    }

    if (IDBRAND.value) {
      IDMODEL.visible = true;
    }
    if (IDMODEL.value) {
      idType.visible = true;
    }

    if (IDBRAND.state === false || !sModel?.value?.includes(IDBRAND.value)) {
      setValueEmptyStateNull(sModel);

      sModel.checked = false;
      // очищаем модель, если нет марки
      setValueEmptyStateNull(model);

      // очищаем тип ТС, если нет модели

      setValueEmptyStateNull(idType);
    }
  }

  // Модель (не нашли в списке)
  if (item.name === "IDMODEL") {
    if (model.value) {
      idType.visible = true;

      setValueModelBrand(data);
    }

    if (!model.value) {
      idType.visible = true;
    }

    if (IDMODEL.state === false) {
      setValueEmptyStateNull(sModel);
    }
  }

  // Сбрасываем значение в поле Марка-Модель при невалидной марке или модели
  if (model.state === false) {
    setValueEmptyStateNull(sModel);
  }

  if (IDBRAND.state === false) {
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

    if (item.value.length <= 160) {
      sModel.state = null;
      sModel.error = null;
    }

    if (item.value === "") {
      sModel.state = null;
      sModel.error = null;
    }
  }

  // Поле марка-модель стало обязательным

  if (Object.hasOwn(sModel, "value")) {
    if (sModel.value.length > 1 && sModel.value.length <= 160) {
      sModel.state = true;
      sModel.error = null;
    }
  }

  if (idType && idType.value && idType.options && idType.options.length) {
    const validSelectedValue = idType.options.find(
      (option) => option.value === idType.value
    );
    if (!validSelectedValue) {
      idType.value = undefined;
      idType.state = null;
      idType.ckecked = false;
    }
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
    svin.value = svin.value.toUpperCase();
    if (svin.mask.length > svin.value.length) {
      svin.error = "VIN должен состоять из 17 символов";
      svin.state = false;
    }
    if (svin.mask.length === svin.value.length) {
      svin.error = null;
      svin.state = true;
    }
  }

  return data;
}

function initHandler(data) {
  const IDMODEL = findField(data, "IDMODEL");
  const Save = findField(data, "Save");
  const Continue = findField(data, "Continue");
  const regNum = findField(data, "SREGNUM");
  const sModel = findField(data, "SMODEL");
  const IDBRAND = findField(data, "IDBRAND");
  const lPublic = findField(data, "LPUBLIC");

  Continue.visible = IDMODEL.visible;
  Save.visible = !IDMODEL.visible;

  ["IDMODEL", "IDBRAND", "IDVEHICLETYPE"].forEach((field) => {
    const curField = findField(data, field);
    if (curField) {
      curField.visible = IDMODEL?.value > 0 || regNum.value?.length > 0 || regNum.value === 'N';
    }
  });

  function isFreeZone() {
    return !window.location.pathname.includes("/cabinet/");
  }

  if (lPublic) {
    lPublic.value = isFreeZone() ? "Y" : "N";
  }


  const idType = data.find((f) => f.name === "IDVEHICLETYPE");
  if (idType && idType.value && idType.options && idType.options.length) {
    const validSelectedValue = idType.options.find(
      (option) => option.value === idType.value
    );
    if (!validSelectedValue) {
      idType.value = undefined;
      idType.state = null;
      idType.ckecked = false;
    }
  }

  if (IDMODEL?.value > 0) {
    IDMODEL.visible = true;
  }

  // Сбрасываем значение в поле Марка-Модель при невалидной марке или модели
  if (IDMODEL.state === false) {
    setValueEmptyStateNull(sModel);
  }

  if (IDBRAND.state === false) {
    setValueEmptyStateNull(sModel);
  }

  //  Добавляем значение в поле Марка-Модель при валидной марке и модели

  if (!sModel.value) {
    setValueModelBrand(data);
  }
  return data;
}

window.eventHandler = eventHandler;
window.initHandler = initHandler;
})();

