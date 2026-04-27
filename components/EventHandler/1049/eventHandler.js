import { scrollToCardHead } from "@/utils/scroll";

export async function eventHandler(data, item) {
  const field = data.find((f) => f.fieldId === item.fieldId);
  if (!field) {
    return data;
  }

  if (field.name === "DINS_DATE") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      const [dFrom, mFrom, yFrom] = item.value.split(".");
      const dateInputDate = new Date(yFrom, Number(mFrom) - 1, dFrom);
      const inputDateField = data.find((f) => f.name === "DINPUT_DATE");

      if (inputDateField.value) {
        const [dInput, mInput, yInput] = inputDateField.value.split(".");
        const MaxInputDate = new Date(yInput, Number(mInput) - 1, Number(dInput) + 30);
        const MinInputDate = new Date(yInput, Number(mInput) - 1, Number(dInput) + 2);

        if (dateInputDate < MinInputDate) {
          // item.value = null
          field.error = "Дата осмотра должна быть не раньше, чем через 2 дня";
          field.state = false;
        } else if (dateInputDate > MaxInputDate) {
          field.error = "Дата осмотра должна быть не позже, чем через 30 дней";
          field.state = false;
        } else {
          field.state = true;
          field.error = null;
        }
      }
      return data;
    }
  }

  if (item.name === "SADDRESS") {
    try {
      const fiasId = item.value.data.house_fias_id;
      if (!fiasId) {
        throw new Error(`Нет fiasId у дома`);
      }
      const fiasResponse = await $nuxt.$axios(`/am/main/v2/dicwf/57923?FIAS_ID=${fiasId}`);
      const [buildYearRow] = fiasResponse.data[0]._data;
      if (!buildYearRow) {
        throw new Error(`Не найдены данные по дому`);
      }
    } catch (err) {
      console.error("Не удалось подобрать год постройки", err);
    }
  }

  // Адрес
  if (field.name === "SADDRESS") {
    console.log(item.value.data);
    if (item.value.data.fias_level.substr(0, 1) === null) {
      field.error = "Необходимо выбрать адрес из выпадающего списка";
      field.state = false;
    } else if (item.value.data.fias_level !== "8") {
      field.error = "Адрес следует указать с точностью только до дома";
      field.state = false;
    } else {
      field.state = true;
      field.error = null;
    }
    return data;
  }

  // Изменить
  if (field.name === "Item45577") {
    data.find(({ name }) => name === "STITLE").visible = false;
    data.find(({ name }) => name === "SINS_INFO").visible = false;
    data.find(({ name }) => name === "Item45577").visible = false;
    data.find(({ name }) => name === "STITLE2").visible = false;
    data.find(({ name }) => name === "SINS_INFO2").visible = false;
    data.find(({ name }) => name === "SIND_EXP").visible = false;
    data.find(({ name }) => name === "SINS_ADDRESS").visible = false;
    data.find(({ name }) => name === "SINS_DATETIME").visible = false;
    data.find(({ name }) => name === "SWARNING_INFO").visible = false;

    data.find(({ name }) => name === "SNAME").visible = true;
    data.find(({ name }) => name === "SPHONE").visible = true;
    data.find(({ name }) => name === "SADDRESS").visible = true;
    data.find(({ name }) => name === "DINS_DATE").visible = true;
    data.find(({ name }) => name === "IDTIME").visible = true;
    data.find(({ name }) => name === "Save").visible = true;
    data.find(({ name }) => name === "Save").label = "Изменить данные";
    return data;
  }

  return data;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  return data;
}
