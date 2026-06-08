import { scrollToCardHead } from "@/utils/scroll";

let SVEHICLE_MODEL_STORY = "";

export function eventHandler(data, item) {
  function findField(name) {
    const field = data.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  function isValidExperience(driverAge, drivingExperience) {
    if (drivingExperience === "" || drivingExperience === null) {
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
    const newExpField = { ...driverFields[1] }; // Стаж, лет
    const drivingExperience = driverFields[1].value;
    const driverAge = Number(driverFields[0].value); // Возраст, лет
    if (drivingExperience === undefined || drivingExperience === null) {
      return;
    }
    const isValid = isValidExperience(driverAge, drivingExperience);

    newExpField.state = false;
    newExpField.error = "Некорректное значение";
    if (drivingExperience === "" || drivingExperience === null) {
      delete newExpField.error;
    }
    if (isValid) {
      newExpField.state = true;
      delete newExpField.error;
    }
    driverFields[1] = newExpField;
  }

  const address = data.find((f) => f.name === "SCOVERTERR");
  const SMODEL = data.find((f) => f.name === "SMODEL"); // Модификация ТС (необязательно)
  const SVEHICLE_MODEL_CASCO = data.find((f) => f.name === "SVEHICLE_MODEL_CASCO"); // Марка и модель

  if (item.name === "SCOVERTERR") {
    address.state = address.value !== null;
    address.error = address.state === false ? "Укажите адрес" : null;
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

  if (item.name === "SVEHICLE_MODEL_CASCO") {
    if (item.value && typeof item.value === "object" && item.value?.brand_model_modification !== SVEHICLE_MODEL_STORY) {
      SMODEL.value = item.value?.brand_model_modification;
      SMODEL.state = true;
    }
    if (!item.value) {
      SMODEL.value = "";
      SMODEL.state = null;
    }
    SVEHICLE_MODEL_STORY = item.value?.brand_model_modification;
  }

  if (item.name === "SMODEL") {
    if (item.value === "") {
      SMODEL.state = null;
      SMODEL.error = null;
    }
  }

  if (SVEHICLE_MODEL_CASCO.value && typeof SVEHICLE_MODEL_CASCO.value === "object") {
    SVEHICLE_MODEL_CASCO.state = true;
    SVEHICLE_MODEL_CASCO.error = null;
  }

  if (
    SVEHICLE_MODEL_CASCO.value &&
    typeof SVEHICLE_MODEL_CASCO.value !== "object" &&
    SVEHICLE_MODEL_CASCO.value !== ""
  ) {
    SVEHICLE_MODEL_CASCO.state = false;
    SVEHICLE_MODEL_CASCO.error = "Выберите значение из списка";
  }

  // Поле охранная система
  const fieldBSEARCH_SYSTEM = data.find(({ name }) => name === "BSEARCH_SYSTEM");

  if (fieldBSEARCH_SYSTEM.value === true) {
    data.find((f) => f.name === "IDSEARCH_SYSTEM").visible = true;
  }
  if (fieldBSEARCH_SYSTEM.value === false) {
    data.find((f) => f.name === "IDSEARCH_SYSTEM").visible = false;
  }

  const driverType = data.find(({ name }) => name === "NDRIVER_TYPE"); // findField("NDRIVER_TYPE");

  if (driverType.value == 1) {
    data.find((f) => f.name === "INSURED_LIST").visible = true;
  }

  if (driverType.value == 2) {
    data.find((f) => f.name === "INSURED_LIST").visible = false;
  }

  return data;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  const sModel = data.find((f) => f.name === "SMODEL"); // Модификация ТС (необязательно)
  const IDSEARCH_SYSTEM = data.find((f) => f.name === "IDSEARCH_SYSTEM");
  const nBuildYear = data.find((f) => f.name === "NBUILD_YEAR");

  if (nBuildYear && nBuildYear.value && nBuildYear.options && nBuildYear.options.length) {
    const validSelectedValue = nBuildYear.options.find((option) => option.value === nBuildYear.value);
    if (!validSelectedValue) {
      nBuildYear.value = undefined;
      nBuildYear.state = null;
      nBuildYear.ckecked = false;
    }
  }

  if (sModel.value) {
    sModel.state = true;
    sModel.error = null;
  }

  if (!sModel.value) {
    sModel.state = null;
    sModel.error = null;
  }

  if (
    IDSEARCH_SYSTEM.value &&
    typeof IDSEARCH_SYSTEM.value === "object" &&
    IDSEARCH_SYSTEM.value?.brand_model_modification !== SVEHICLE_MODEL_STORY
  ) {
    sModel.value = IDSEARCH_SYSTEM.value?.brand_model_modification;
    sModel.state = true;
  }
  if (!IDSEARCH_SYSTEM.value) {
    sModel.value = "";
    sModel.state = null;
  }
  SVEHICLE_MODEL_STORY = IDSEARCH_SYSTEM.value?.brand_model_modification;

  return data;
}
