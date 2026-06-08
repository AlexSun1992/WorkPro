import { scrollToCardHead } from "@/utils/scroll";

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

function findField(data, name) {
  const field = data.find((item) => item.name === name);

  if (field) {
    return field;
  }
  console.error(`findField. Поле ${name} не найдено в данных`);

  return {};
}
function hideFields(data) {
  const objectFieldsTS = [...arrFieldsTS, ...changedVisibleFields].map((field) => findField(data, field));
  objectFieldsTS.forEach((field) => {
    field.visible = false;
    return field.visible;
  });
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
      idType.checked = false;
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
  if (brandValue?.text && IDMODEL.state !== false && IDBRAND.state !== false) {
    if (!idModelText?.text || idModelText?.text.toLowerCase().trim().includes("иное")) {
      brandmodel.value = `${brandValue.text} `;
      brandmodel.state = false;
    } else {
      brandmodel.value = `${brandValue.text} ${idModelText.text}`;
      brandmodel.state = true;
      brandmodel.error = null;
    }
  }
}

function showInfo(helpInformer, visible) {
  if (needShowInfo) {
    helpInformer.visible = visible;
  } else {
    helpInformer.visible = false;
  }
}
let valueFromDB = "";

export function eventHandler(data, item) {
  const IDMODEL = findField(data, "IDMODEL");
  const idModelText = IDMODEL.options?.find((item) => item.value === IDMODEL.value);
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

  const brandModelValue = IDBRAND?.options?.find((el) => el.value === IDBRAND.value);
  const idTypeText = idType?.options?.find((el) => el.value === idType.value);

  const brandModelText = brandModelValue?.text ?? "";

  const brandModelValueTrimedLength = brandModelText.trim().length;

  if (item.resp) {
    needShowInfo = false;
  }

  // Тип ТС
  if (
    ["IDVEHICLETYPE"].includes(item.name) &&
    !valueFromDB &&
    String(idModelText.text).trim().toLowerCase() !== "иное"
  ) {
    clearType(idType);
    NSEATS_COUNT.visible = idType.value === 3;
    NWEIGHT.visible = idType.value === 4;
  }

  // Тип ТС
  //  Добавляем значение в поле Марка-Модель при валидной марке и модели
  if (
    item.name === "IDVEHICLETYPE" &&
    item.value &&
    !valueFromDB &&
    String(idModelText.text).trim().toLowerCase() !== "иное"
  ) {
    if (String(idTypeText?.text)?.trim()?.toLowerCase() !== String(valueFromDB)?.trim()?.toLowerCase()) {
      setValueModelBrand(data);
    }

    return data;
  }

  if (item.name === "IDVEHICLE_POLICY") {
    if (item.value) {
      hideFields(data);
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
    hideFields(data);
    Continue.visible = false;
    Save.visible = true;
    const showInformer = regNum.value === null || regNum.value?.length <= 7;
    showInfo(helpInformer, showInformer);
    return data;
  }

  Save.visible = !Continue.visible;

  if (item.name === "IDBRAND") {
    valueFromDB = "";
    if (IDBRAND.value) {
      idType.visible = IDMODEL.visible;
      if (!valueFromDB) {
        setValueModelBrand(data);
      }
    }
  }

  // Модель (не нашли в списке)
  if (item.name === "IDMODEL") {
    valueFromDB = "";
    const brandModelValue = IDBRAND?.options?.find((el) => el.value === IDBRAND.value);
    const idModelText = IDMODEL.options?.find((item) => item.value === IDMODEL.value);

    if (IDMODEL.value && !idModelText?.text.toLowerCase().trim().includes("иное")) {
      if (!valueFromDB) {
        setValueModelBrand(data);
      } else {
        sModel.value = `${brandModelValue.text} ${idModelText.text}`;
      }
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

  if (item.name === "SMODEL") {
    // Валидируем поле (не более 160 символов)
    const trimedValue = item.value.trim().length;

    if (trimedValue >= 160) {
      sModel.state = false;
      sModel.error = "Значение поля не должно превышать 160 символов";
      sModel.value = sModel.value.slice(0, 160);
    }

    if (trimedValue <= 160 || item.value === "") {
      sModel.state = null;
      sModel.error = null;
    }

    if (trimedValue >= brandModelValueTrimedLength) {
      sModel.state = true;
      sModel.error = null;
    }

    if (trimedValue < brandModelValueTrimedLength) {
      sModel.state = false;
      sModel.error = "Добавьте в данное поле наименование модели, при необходимости дополнив модификацией";
    }
  }

  // Поле марка-модель стало обязательным
  if (sModel.value?.length >= 1 && sModel.value?.length <= 160) {
    sModel.state = true;
    sModel.error = null;

    if (sModel.value?.trim().length <= brandModelValueTrimedLength) {
      sModel.state = false;
      sModel.error = "Добавьте в данное поле наименование модели, при необходимости дополнив модификацией";
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
  setTimeout(() => {
    const btnGreyAuth = document.querySelector(".bg-auth-grey");
    const chipsCard = document.querySelector(".chips-card");

    const changeClass = (element) => {
      const closestElement = element?.closest(".col-12");
      if (closestElement) {
        closestElement.classList.remove("col-lg-6");
        closestElement.classList.add("col-lg-12");
      }
    };

    if (btnGreyAuth && !chipsCard) {
      changeClass(btnGreyAuth);
    }
    if (!btnGreyAuth && chipsCard) {
      changeClass(chipsCard);
    }
  }, 0);
  if (data[0]?.id !== "1105") {
    return;
  }
  if (document.referrer.includes("esia.gosuslugi")) {
    scrollToCardHead(".wizard_osago");
  }

  const IDMODEL = findField(data, "IDMODEL");
  const idType = findField(data, "IDVEHICLETYPE");
  const regNum = findField(data, "SREGNUM");
  const Save = findField(data, "Save");
  const Continue = findField(data, "Continue");
  const helpInfo = findField(data, "SHELP_INFO");
  const SMODEL = findField(data, "SMODEL");
  const IDBRAND = findField(data, "IDBRAND");

  const isVisibleFields = IDMODEL?.value > 0 || regNum.value?.length >= 7 || regNum.value === "N";
  const brandValue = IDBRAND.options?.find((item) => item.value === IDBRAND.value);
  const isModelValueShorterThenBrandValue = SMODEL?.value?.trim().length < brandValue?.text?.trim()?.length;
  // При наличии Марки заполняем поле Марка-Модель
  if (IDBRAND.value && !SMODEL.value) {
    SMODEL.value = brandValue.text;
    SMODEL.state = true;
  }

  if (SMODEL.value.trim().length <= brandValue.text.trim().length) {
    SMODEL.state = false;
    SMODEL.error = "Добавьте в данное поле наименование модели, при необходимости дополнив модификацией";
  }
  if (!helpInfo.visible) {
    needShowInfo = false;
  }

  clearType(idType);
  valueFromDB = SMODEL.value;
  Continue.visible = isVisibleFields;
  Save.visible = !isVisibleFields;
  IDBRAND.visible = isVisibleFields;
  IDMODEL.visible = isVisibleFields;
  idType.visible = isVisibleFields;

  return data;
}
