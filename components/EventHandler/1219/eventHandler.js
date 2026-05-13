import { findField } from "../helpers/findField";

const syncBuildYear = (field, yearValue) => {
  if (yearValue !== 1) {
    field.value = yearValue;
    field.state = true;
    field.error = null;
  }
};
const validateAndSetSquare = (value, field, ssqure) => {
  if (Number(value) !== 1 && Number(field.value) !== 1) {
    ssqure.value = value;
    const valueNum = Number(value);
    if (!valueNum || valueNum < 10 || valueNum > 250) {
      ssqure.error = "Площадь объекта страхования должна начинаться от 10 кв. м. и не должна превышать 250 кв. м.";
      ssqure.state = false;
    } else {
      ssqure.error = null;
      ssqure.state = true;
    }
  }
};
let addressHistory = null;

export function initHandler(data) {
  const continueBtn = findField(data, "Continue");
  const bbars = findField(data, "BBARS");
  const bfloor = findField(data, "BFLOOR");
  const buildYear = findField(data, "NBUILD_YEAR");
  const address = findField(data, "ADDRESS_REG");
  const addressValid = findField(data, "BISADDRESSVALID");
  const headline_promocode = findField(data, "ITEM50092");
  const promocode = findField(data, "SPROMOCODE");
  const promocode_button = findField(data, "Item52120");

  addressHistory = address.value;
  headline_promocode.visible = true;
  promocode.visible = true;
  promocode_button.visible = true;

  if (address.value) {
    if (addressValid.value !== true) {
      address.error = "Адрес следует указать с точностью до квартиры";
      address.state = false;
    } else {
      address.error = null;
      address.state = true;
    }
  }

  if (buildYear.value) {
    buildYear.state = true;
    buildYear.error = null;
  }
  if (bfloor.value === true) {
    bbars.visible = true;
  }
  if (bfloor.value === false) {
    bbars.visible = false;
  }

  if (continueBtn.visible === true) {
    setTimeout(() => {
      if (document.querySelector(".radio-btn")) {
        const priceBlock = document.querySelector(".radio-btn");
        window.scrollTo(0, priceBlock.offsetTop - window.innerHeight / 2 + priceBlock.offsetHeight);
      }
    }, 0);
  }

  return data;
}
const validateAddressField = (field, addressReg, logPrefix = "") => {
  if (!field.value) {
    field.error = null;
    field.state = false;
    return;
  }

  const fiasLevel = field.value?.data?.fias_level?.substr(0, 1);
  const flat = field.value?.data?.flat;

  if (fiasLevel === null) {
    field.error = "Необходимо выбрать адрес из выпадающего списка";
    field.state = false;
  } else if (flat === null) {
    field.error = "Адрес следует указать с точностью до квартиры";
    field.state = false;
  } else {
    field.state = true;
    field.error = null;
  }
};

export async function eventHandler(data, item) {
  const NBUILD_YEAR_CC = findField(data, "NBUILD_YEAR_CC");
  const NBUILD_YEAR = findField(data, "NBUILD_YEAR");
  const ADDRESS_REG = findField(data, "ADDRESS_REG");
  const SSQUARE = findField(data, "SSQUARE");
  const SSQUARE_CC = findField(data, "SSQUARE_CC");
  const bbars = findField(data, "BBARS");
  const bfloor = findField(data, "BFLOOR");
  const headline_promocode = findField(data, "ITEM50092");
  const promocode = findField(data, "SPROMOCODE");
  const promocode_button = findField(data, "Item52120");

  bbars.visible = bfloor.value;
  headline_promocode.visible = true;
  promocode.visible = true;
  promocode_button.visible = true;

  const field = data.find((f) => f.fieldId === item.fieldId);
  if (!field) {
    return data;
  }

  // --- SSQUARE ---
  if (field.name === "SSQUARE" || field.name === "SSQUARE_CC") {
    if (!item.value) {
      SSQUARE.error = null;
    }

    validateAndSetSquare(item.value, field, SSQUARE);

    validateAddressField(ADDRESS_REG, ADDRESS_REG);

    if (field.name !== "SSQUARE") {
      syncBuildYear(NBUILD_YEAR, NBUILD_YEAR_CC.value);
    }
    return data;
  }

  if (field.name === "NBUILD_YEAR") {
    return data;
  }

  // --- ADDRESS_REG --- (Адрес объекта)
  if (field.name === "ADDRESS_REG" && field.value.value !== addressHistory) {
    addressHistory = field.value.value;
    validateAddressField(field, ADDRESS_REG);
    syncBuildYear(NBUILD_YEAR, NBUILD_YEAR_CC.value);

    return data;
  }

  // --- NBUILD_YEAR_CC --- (скрытое поле, в которое приходит значение для заполнения поля ADDRESS_REG)
  if (field.name === "NBUILD_YEAR_CC") {
    validateAndSetSquare(SSQUARE_CC.value, field, SSQUARE);
    validateAddressField(ADDRESS_REG, ADDRESS_REG);
    syncBuildYear(NBUILD_YEAR, NBUILD_YEAR_CC.value);
  }

  return data;
}
