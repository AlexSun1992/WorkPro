async function eventHandler(data, item, callback) {
  function findField(name) {
    const field = data.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  const svin = findField("SVIN");
  const sModel = findField("SMODEL");
  const model = findField("IDMODEL");
  const IDBRAND = findField("IDBRAND");
  const IDMODEL = findField("IDMODEL");
  const BNO_VIN = findField("BNO_VIN");
  const Save = findField("Save");
  const NWEIGHT = findField("NWEIGHT");
  const NSEATS_COUNT = findField("NSEATS_COUNT");
  const regNum = findField("SREGNUM");
  const idType = findField("IDVEHICLETYPE");

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

  const objectFieldsTS = arrFieldsTS.map((field) => findField(field));

  function visibleTS(visible) {
    // eslint-disable-next-line no-param-reassign,no-return-assign
    objectFieldsTS.forEach((f) => (f.visible = visible));
  }

  if (item.name === "IDVEHICLETYPE" && item.value !== 4 && item.value !== 3) {
    NWEIGHT.visible = false;
    NSEATS_COUNT.visible = false;
  }

  if (item.name === "IDVEHICLETYPE" && item.value === 4) {
    NWEIGHT.visible = true;
    NSEATS_COUNT.visible = false;
  }
  if (item.name === "IDVEHICLETYPE" && item.value === 3) {
    NSEATS_COUNT.visible = true;
    NWEIGHT.visible = false;
  }
  if (
    item.name === "IDVEHICLE_POLICY" ||
    (item.name === "SREGNUM" && item.value.length <= 1)
  ) {
    Save.visible = true;
    visibleTS(false);
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
      sModel.value = "";
      sModel.state = null;
      // очищаем модель, если нет марки
      model.value = "";
      model.state = null;
      //очищаем тип ТС, если нет модели
      idType.value = "";
      idType.state = null;
    }
  }

  // Модель (не нашли в списке)
  if (item.name === "IDMODEL") {
    if (model.value) {
      idType.visible = true;

      const idModelText = IDMODEL.options.find(
        (item) => item.value === IDMODEL.value
      );

      const brandValue = IDBRAND.options.find(
        (item) => item.value === IDBRAND.value
      );

      if (brandValue && idModelText) {
        if (
          brandValue.hasOwnProperty("text") &&
          idModelText.hasOwnProperty("text")
        ) {
          if (brandValue.text === sModel.value) {
            sModel.value = sModel.value + " " + idModelText.text;
          }

          if (brandValue !== sModel.value) {
            sModel.value = `${brandValue.text} ${idModelText.text}`;
          }
        }
      }
    }

    if (!model.value) {
      idType.visible = true;
    }

    if (IDMODEL.state === false) {
      sModel.value = "";
      sModel.state = null;
    }
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

  if (item.name === "BNO_VIN") {
    if (BNO_VIN.value === true) {
      findField("SBODYNUMBER").visible = true;
    } else {
      findField("SBODYNUMBER").visible = false;
    }
  }

  // При отсутствии VIN скрываем поле
  if (item.name === "BNO_VIN") {
    if (BNO_VIN.value === true) {
      findField("SBODYNUMBER").visible = true;
      findField("SVIN").visible = false;
    } else {
      findField("SBODYNUMBER").visible = false;
      findField("SVIN").visible = true;
    }
  }

  // Проверка VIN на количество символов
  if (item.name === "SVIN") {
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
  function findField(name) {
    const field = data.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  const regNum = findField("SREGNUM");

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

  const IDMODEL = findField("IDMODEL");

  if (IDMODEL.value > 0) {
    IDMODEL.visible = true;
  }

  return data;
}
export { eventHandler };
