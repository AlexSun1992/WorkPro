export async function eventHandler(data, item, callback) {
  if (data.length === 0) {
    return;
  }

  function findField(name) {
    const field = data.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  function setVisibleByPage(page, visible = true) {
    data.forEach((item) => {
      if (item.page === page) {
        item.visible = visible;
        item.readonly = false;
      }
    });
  }

  function isFilledByPage(page) {
    const filtered = data.filter(
      (item) =>
        item.page === page &&
        item.visible === true &&
        item.required === true &&
        item.name !== "DATA_VEHICLE" &&
        item.name !== "BNO_VIN" &&
        item.name !== "BUSED_TRAILER"
    );

    if (filtered.length === 0) {
      return false;
    }
    return filtered.every((item) => {
      if (item.value === 0) {
        return true;
      }
      return item.value;
    });
  }

  const IDCOUNTRYDOC = findField("IDPHOLDER_COUNTRY");
  const IDDOCTYPE = findField("IDPHOLDER_DOCTYPE");
  const BUTTON_NEXT = findField("BUTTON_NEXT");
  const BUTTON_BACK = findField("BUTTON_BACK");
  const svin = findField("SVIN");
  const sModel = findField("SMODEL");
  const model = findField("IDMODEL");
  const IDBRAND = findField("IDBRAND");
  const IDMODEL = findField("IDMODEL");
  const BNO_VIN = findField("BNO_VIN");
  const INFO_TS = findField("INFO_TS");
  // const SREG_NUMBER = findField("SREG_NUMBER");

  const SREG_NUMBER = {
    name: "SREG_NUMBER MOCK",
    label: "SREG_NUMBER MOCK",
    value: "SREG_NUMBER MOCK",
  };

  const NPOWER = findField("NPOWER");
  const NKVT_POWER = findField("NKVT_POWER");
  const lisOwner = findField("LISOWNER");
  const vehDocDate = findField("DVEHDOCDATE");
  const bodyNumber = findField("SBODYNUMBER");

  const TRANSPORT_BLOCK = 2;
  const HOLDER_BLOCK = 3;
  const OWNER_BLOCK = 4;

  if (item.name === "IDBRAND") {
    if (!IDBRAND.value) {
      IDMODEL.visible = true;
    }
    if (IDBRAND.value) {
      IDMODEL.visible = true;
    }
  }

  // Модель (не нашли в списке)
  if (item.name === "IDMODEL") {
    if (model.value) {
      const textValueModel = model.options.find((el) => el.value === model.value);
      if (textValueModel?.SNAME) {
        if (textValueModel.SNAME === "Иное") {
          sModel.visible = true;
        }
        if (textValueModel.SNAME !== "Иное") {
          sModel.visible = false;
        }
      }
    }
  }

  // Настраиваем видимость поля Номер кузова
  // Показываем поле при наличии значения (предзаполнение)

  if (Object.hasOwn(bodyNumber, "value")) {
    bodyNumber.visible = true;
  }

  if (!Object.hasOwn(bodyNumber, "value")) {
    bodyNumber.visible = false;
  }

  // При отсутствии VIN скрываем поле

  if (item.name === "BNO_VIN") {
    if (item.value === true) {
      bodyNumber.visible = true;
    }

    if (item.value === false) {
      bodyNumber.visible = false;
    }
  }

  //  Поле модель выбрано (не Иное)  скрываем поле "Модель не нашли в списке"
  const textValueModel = model.options.find((el) => el.value === model.value);

  if (textValueModel === undefined) {
    sModel.visible = false;
  }

  // Поле модель выбрано (Иное), показываем поле "Модель не нашли в списке"

  if (textValueModel !== undefined && typeof textValueModel === "object") {
    if (Object.hasOwn(textValueModel, "value")) {
      if (textValueModel.SNAME !== "Иное") {
        sModel.visible = false;
      }
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
      //  console.log('fieldNKH:',fieldNKH)
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
      data.find((f) => f.name === "SBODYNUMBER").visible = true;
    } else {
      data.find((f) => f.name === "SBODYNUMBER").visible = false;
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

  // Валидация даты

  if (item.name === "DVEHDOCDATE") {
    const [day, month, year] = item.value.split(".");

    const currentValue = new Date(year, month - 1, day);

    const currentDate = new Date();

    if (currentValue > currentDate) {
      vehDocDate.error = "Дата выдачи не может быть позже текущей даты";
      vehDocDate.state = false;
    }

    if (currentValue < currentDate) {
      vehDocDate.error = null;
      vehDocDate.state = true;
    }
  }

  if (item.name === "IDPHOLDER_COUNTRY") {
    if (IDCOUNTRYDOC.value) {
      IDDOCTYPE.visible = true;
    }
  }

  if (item.name === "LISOWNER") {
    if (item.value === false) {
      setVisibleByPage(OWNER_BLOCK);
    }

    if (item.value === true) {
      setVisibleByPage(OWNER_BLOCK, false);
    }
  }

  if (isFilledByPage(TRANSPORT_BLOCK)) {
    BUTTON_NEXT.visible = true;
  }

  if (item.name === "BUTTON_BACK") {
    setVisibleByPage(HOLDER_BLOCK, false);
    setVisibleByPage(OWNER_BLOCK, false);
    setVisibleByPage(TRANSPORT_BLOCK);
  }

  if (item.name === "OWNER_BACK_TS") {
    setVisibleByPage(HOLDER_BLOCK, false);
    setVisibleByPage(OWNER_BLOCK, false);
    setVisibleByPage(TRANSPORT_BLOCK);
  }

  if (item.name === "BUTTON_NEXT") {
    if (isFilledByPage(TRANSPORT_BLOCK)) {
      if (lisOwner.value === true) {
        setVisibleByPage(TRANSPORT_BLOCK, false);
        setVisibleByPage(HOLDER_BLOCK);
      }

      if (lisOwner.value === false) {
        setVisibleByPage(TRANSPORT_BLOCK, false);
        setVisibleByPage(HOLDER_BLOCK);
        setVisibleByPage(OWNER_BLOCK);
      }
    }

    INFO_TS.value = ` <div class="row">
   <div class="col-sm-12 col-md-12 col-lg-4 col-xl-nan col-12">
      <div role="group" class="form-group">
         <label for="${SREG_NUMBER.name}" class="d-block"
            ><span>${SREG_NUMBER.label}</span></label
            >
         <div>
            <div>${SREG_NUMBER.value}</div>
         </div>
      </div>
   </div>
   <div class="col-sm-12 col-md-12 col-lg-4 col-xl-nan col-12">
      <div role="group" class="form-group">
         <label for="${NPOWER.name}" class="d-block"
            ><span>${NPOWER.label}</span></label
            >
         <div>
            <div>${NPOWER.value}</div>
         </div>
      </div>
   </div>
   <div class="col-sm-12 col-md-12 col-lg-4 col-xl-nan col-12">
      <div role="group" class="form-group">
         <label for="${NKVT_POWER.name}" class="d-block"
            ><span>${NKVT_POWER.label}</span></label
            >
         <div>
            <div>${NKVT_POWER.value}</div>
         </div>
      </div>
   </div>
</div>
    `;
  }

  return data;
}

export function initHandler(data, item) {
  console.log(data, item);
  const TRANSPORT_BLOCK = 2;
  const HOLDER_BLOCK = 3;
  const OWNER_BLOCK = 4;

  const BUTTON_NEXT = "BUTTON_NEXT";
  const isSaved = true;

  function setVisibleByPage(page) {
    data.forEach((item) => {
      if (item.page === page && item.name !== BUTTON_NEXT) {
        item.visible = true;
        item.readonly = false;
      } else {
        item.visible = false;
      }
    });
  }

  if (isSaved) {
    // setVisibleByPage(TRANSPORT_BLOCK);
  }
  return data;
}
