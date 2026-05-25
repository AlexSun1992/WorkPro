import { scrollToCardHead } from "@/utils/scroll";
import { findField, validationDateField } from "../helpers";

export function eventHandler(data, item) {
  const DBUYDATE = findField(data, "DBUY_DATE");

  if (item.name === "DBUY_DATE") validationDateField(item, DBUYDATE, "Дата покупки ТС не может быть будущей");

  const LREGNUMBER = data.find(({ name }) => name === "LREGNUMBER");
  const SREGNUMBER = data.find(({ name }) => name === "SREGNUMBER");

  if (LREGNUMBER.value === true) {
    SREGNUMBER.value = null;
    SREGNUMBER.readonly = true;
    SREGNUMBER.placeholder = null;
  }
  if (LREGNUMBER.value === false) {
    SREGNUMBER.readonly = false;
    SREGNUMBER.placeholder = "Введите госномер ТС";
  }

  const field = data.find((f) => f.fieldId === item.fieldId);
  const IDBRAND = data.find(({ name }) => name === "IDBRAND");
  const IDMODEL = data.find(({ name }) => name === "IDMODEL");
  const SMODEL = data.find((f) => f.name === "SMODEL");
  const IDVEHICLE_TYPE = data.find(({ name }) => name === "IDVEHICLE_TYPE");
  const IDCAR_BODY_TYPE = data.find(({ name }) => name === "IDCAR_BODY_TYPE");

  if (field?.name === "NPROBEG_EXACT") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      if (!(Number(item.value) + 1) || Number(item.value) < 0 || Number(item.value) > 999999) {
        field.error = "Пробег не может быть меньше 0 или больше 1 млн. км.";
        field.state = false;
      } else {
        field.error = null;
        field.state = true;
      }
    }
    return data;
  }
  // console.log(IDMODEL);

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

  if (item.name === "IDBRAND") {
    IDMODEL.visible = true;
  }

  if (item.name === "IDMODEL") {
    IDVEHICLE_TYPE.visible = true;
  }
  if (item.name === "IDVEHICLE_TYPE") {
    IDCAR_BODY_TYPE.visible = true;
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

  if (IDMODEL.state && IDBRAND.state) {
    const idBrandValueText = IDBRAND.options.find((item) => item.value === IDBRAND.value);
    const idModelValueText = IDMODEL.options.find((item) => item.value === IDMODEL.value);
    SMODEL.value = `${idBrandValueText.text} ${idModelValueText.text}`;
  }

  if (item.name === "SMODEL") {
    if (item.value === "") {
      SMODEL.state = null;
      SMODEL.error = null;
    }
  }

  return data;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

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

  const LREGNUMBER = data.find(({ name }) => name === "LREGNUMBER");
  const SREGNUMBER = data.find(({ name }) => name === "SREGNUMBER");

  if (LREGNUMBER.value === true) {
    SREGNUMBER.value = null;
    SREGNUMBER.readonly = true;
    SREGNUMBER.placeholder = null;
  }
  if (LREGNUMBER.value === false) {
    SREGNUMBER.readonly = false;
    SREGNUMBER.placeholder = "Введите госномер ТС";
  }
  return data;
}
