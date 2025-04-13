(() => {
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
  ];

  lastRegNum = '';

  function visibleTS(data, visible) {
    const objectFieldsTS = arrFieldsTS.map((field) => findField(data, field));
    objectFieldsTS.forEach((field) => (field.visible = visible));
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

  function clearType(idType, model) {
    if (idType?.value) {
      const validSelectedValue = idType.options?.find(
        (option) => option.value === idType.value
      );
      if (!validSelectedValue || !model.value) {
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

    if (idModelText?.text && brandValue?.text && IDMODEL.state && IDBRAND.state) {
      brandmodel.value = `${brandValue.text} ${idModelText.text}`;
      brandmodel.state = true;
    }
  }

  function eventHandler(data, item, callback) {
    const IDMODEL = findField(data, "IDMODEL");
    const IDBRAND = findField(data, "IDBRAND");
    if (['IDMODEL', 'IDBRAND', 'IDVEHICLETYPE'].includes(item.name) && IDBRAND.value === null && IDMODEL.value === null) {
      return data;
    }
    console.log('event', item);
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
    }
    const checkRegnum = item.name === 'SREGNUM' && lastRegNum === item.value;
    if (checkRegnum) {
      return data;
    }

    if (item.name === 'SREGNUM' && item.value !== lastRegNum) {
      lastRegNum = item.value;
    }

    if (["IDVEHICLETYPE", 'IDMODEL', 'IDBRAND'].includes(item.name)) {
      clearType(idType, IDMODEL);
      NSEATS_COUNT.visible = idType.value === 3;
      NWEIGHT.visible = idType.value === 4;
    }

    const validRegnum = item.name === 'SREGNUM' && (regNum.value?.length < 7 || regNum.value !== 'N');
    const chips = item.name === 'IDVEHICLE_POLICY' && item.value;

    if (validRegnum || chips) {
      visibleTS(data, false);
      Continue.visible = false;
      Save.visible = true;
      helpInformer.visible = true;
      return data;
    }

    helpInformer.visible = !Continue.visible;
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

    // Сбрасываем значение в поле Марка-Модель при невалидной марке или модели
    if (!IDMODEL.state || !IDBRAND.state) {
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

    IDMODEL.visible = IDBRAND.visible;
    idType.visible = IDBRAND.visible;
    return data;
  }

  function initHandler(data) {
    console.log('init', data);
    const IDMODEL = findField(data, "IDMODEL");
    const IDBRAND = findField(data, "IDBRAND");
    const idType = findField(data, "IDVEHICLETYPE");
    const regNum = findField(data, "SREGNUM");
    const Save = findField(data, "Save");
    const Continue = findField(data, "Continue");
    const sModel = findField(data, "SMODEL");
    const lPublic = findField(data, "LPUBLIC");

    if (lPublic) {
      const isFreeZone = !window.location.pathname.includes("/cabinet/");
      lPublic.value = isFreeZone ? "Y" : "N";
    }

    clearType(idType, IDMODEL);

    if (!IDMODEL.state || !IDBRAND.state) {
       // Сбрасываем значение в поле Марка-Модель при невалидной марке или модели
      setValueEmptyStateNull(sModel);
    } else {
      //  Добавляем значение в поле Марка-Модель при валидной марке и модели
      setValueModelBrand(data);
    }

    const isVisibleFields = IDMODEL?.value > 0 || regNum.value?.length > 7 || regNum.value === 'N';
    lastRegNum = regNum.value;

    Continue.visible = isVisibleFields;
    Save.visible = !isVisibleFields;
    IDBRAND.visible = isVisibleFields;
    IDMODEL.visible = isVisibleFields;
    idType.visible = isVisibleFields;

    return data;
  }

  window.eventHandler = eventHandler;
  window.initHandler = initHandler;
})();

