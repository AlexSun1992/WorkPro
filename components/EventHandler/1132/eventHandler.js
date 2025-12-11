import axios from "axios";
import { getAuthToken, TOKEN_NAME } from "../helpers/getToken";

export function initHandler(data) {
  const link = this.getWindowLocation?.hash;
  const continueBtn = data.find((f) => f.name === "Continue");
  const bbars = data.find((f) => f.name === "BBARS");
  const bfloor = data.find((f) => f.name === "BFLOOR");
  const buildYear = data.find((f) => f.name === "NBUILD_YEAR");
  const address = data.find((f) => f.name === "ADDRESS_REG");
  const addressValid = data.find((f) => f.name === "BISADDRESSVALID");
  const headline_promocode = data.find((f) => f.name === "ITEM50092");
  const promocode = data.find((f) => f.name === "SPROMOCODE");
  const promocode_button = data.find((f) => f.name === "Item47357");

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

export async function eventHandler(data, item) {
  const bbars = data.find((f) => f.name === "BBARS");
  const bfloor = data.find((f) => f.name === "BFLOOR");
  const headline_promocode = data.find((f) => f.name === "ITEM50092");
  const promocode = data.find((f) => f.name === "SPROMOCODE");
  const promocode_button = data.find((f) => f.name === "Item47357");

  if (bfloor.value === true) {
    bbars.visible = true;
  }
  if (bfloor.value === false) {
    bbars.visible = false;
  }
  headline_promocode.visible = true;
  promocode.visible = true;
  promocode_button.visible = true;

  const field = data.find((f) => f.fieldId === item.fieldId);

  if (!field) {
    return data;
  }

  if (field.name === "NBUILD_YEAR") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      const data = new Date();
      const currentDate = data.getFullYear();
      const allowedDateRange = currentDate - 100;

      if (!Number(item.value) || allowedDateRange > Number(item.value) || currentDate < Number(item.value)) {
        field.error = `Год постройки не может быть ранее ${allowedDateRange} и позднее ${currentDate}`;
        field.state = false;
      } else {
        field.error = null;
        field.state = true;
      }
    }

    return data;
  }

  if (field.name === "SSQUARE") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      if (!Number(item.value) || Number(item.value) < 10 || Number(item.value) > 250) {
        field.error = "Площадь объекта страхования должна начинаться от 10 кв. м. и не должна превышать 250 кв. м.";
        field.state = false;
      } else {
        field.error = null;
        field.state = true;
      }
    }
    return data;
  }
  //console.log("4");

  if (item.name === "ADDRESS_REG") {
    try {
      const fiasId = item.value.data.house_fias_id;
      if (!fiasId) {
        throw new Error(`Нет fiasId у дома`);
      }

      const authToken = getAuthToken(TOKEN_NAME);
      const fiasResponse = await axios.get(`/am/main/v2/dicwf/73430?FIAS_ID=${fiasId}`, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const [buildYearRow] = fiasResponse.data[0]._data;
      if (!buildYearRow) {
        throw new Error(`Не найдены данные по дому`);
      }
      const buildYear = buildYearRow.VCBUILD_YEAR;
      if (!buildYear) {
        throw new Error(`Не найден VCBUILD_YEAR`);
      }

      const buildYearField = data.find((f) => f.name === "NBUILD_YEAR");
      buildYearField.value = String(buildYear);
      if (buildYearField.value) {
        buildYearField.state = true;
        buildYearField.error = null;
      }
    } catch (err) {
      console.error("Не удалось подобрать год постройки", err);
    }
  }

  // Адрес
  if (field.name === "ADDRESS_REG") {
    if (item.value.data.fias_level.substr(0, 1) === null) {
      field.error = "Необходимо выбрать адрес из выпадающего списка";
      field.state = false;
    } else if (item.value.data.flat === null) {
      field.error = "Адрес следует указать с точностью до квартиры";
      field.state = false;
    } else {
      field.state = true;
      field.error = null;
    }

    return data;
  }

  return data;
}
