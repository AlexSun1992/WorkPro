import { findField } from "@/components/EventHandler/helpers";

export function initHandler(data) {
  return data;
}
export async function eventHandler(data, item, callback) {
  const cr_number = findField(data, "BNO_NUMBER");
  const life = findField(data, "BMAN_MOR");
  const flat = findField(data, "BFLAT_MOR");
  const IDLENDER = data.find(({ name }) => name === "IDLENDER");
  const bFloor = data.find(({ name }) => name === "BFLOOR");
  const field = data.find((f) => f.fieldId === item.fieldId);

  function parseDateByMask(dateStr, mask = "DD.MM.YYYY") {
    const day = dateStr.substr(0, 2);
    const month = dateStr.substr(3, 2);
    const year = dateStr.substr(6, 4);

    return new Date(year, month - 1, day);
  }

  // Скрываем поля, если нет кредитного договора
  if (cr_number.value == true) {
    findField(data, "SCR_NUMBER").visible = false;
    findField(data, "DCR_DATE").visible = false;
    findField(data, "DCR_TODATE").visible = false;
  } else {
    findField(data, "SCR_NUMBER").visible = true;
    findField(data, "DCR_DATE").visible = true;
    findField(data, "DCR_TODATE").visible = true;
  }

  // Поля для Жизни
  if (life.value == true) {
    findField(data, "SLIFE").visible = true;
    findField(data, "IDSEX").visible = true;
    findField(data, "NCR_PERCENT_DOP").visible = true;
    findField(data, "DBIRTH_DATE").visible = true;
    findField(data, "BDANGER_JOB").visible = true;
    findField(data, "BACCEPT_LIFE").visible = true;
    if (IDLENDER.value == 24503) {
      findField(data, "Item53031").visible = true;
    } else {
      findField(data, "Item53030").visible = true;
    }
  } else {
    findField(data, "SLIFE").visible = false;
    findField(data, "IDSEX").visible = false;
    findField(data, "NCR_PERCENT_DOP").visible = false;
    findField(data, "DBIRTH_DATE").visible = false;
    findField(data, "BDANGER_JOB").visible = false;
    findField(data, "BACCEPT_LIFE").visible = false;
    findField(data, "Item53031").visible = false;
    findField(data, "Item53030").visible = false;
  }

  // Поля для Имущества
  const buildYearField = findField(data, "NB_YEAR");
  if (flat.value == true) {
    findField(data, "SFLAT").visible = true;
    findField(data, "ADDRESS_FLAT").visible = true;
    findField(data, "NFLAT_COST").visible = true;
    findField(data, "NB_YEAR").visible = true;
    findField(data, "NSQUARE").visible = true;
    // Чекбоксы для Сбера
    if (IDLENDER.value == 24503) {
      findField(data, "BOBJ_FORRENT").visible = true;
      findField(data, "BWATER_SENSOR").visible = true;
      findField(data, "BFLOOR").visible = true;
    } else {
      findField(data, "BNOWOOD").visible = true;
      findField(data, "BNODAMAGE").visible = true;
      findField(data, "BACCEPT_FLAT").visible = true;
      findField(data, "Item53029").visible = true;
    }
    // Наличие решеток
    if (bFloor.value == true) {
      findField(data, "BBARS").visible = true;
    } else {
      findField(data, "BBARS").visible = false;
    }
  } else {
    findField(data, "SFLAT").visible = false;
    findField(data, "ADDRESS_FLAT").visible = false;
    findField(data, "NFLAT_COST").visible = false;
    findField(data, "NB_YEAR").visible = false;
    findField(data, "NSQUARE").visible = false;
    findField(data, "BNOWOOD").visible = false;
    findField(data, "BNODAMAGE").visible = false;
    findField(data, "BACCEPT_FLAT").visible = false;
    findField(data, "Item53029").visible = false;
    findField(data, "BOBJ_FORRENT").visible = false;
    findField(data, "BWATER_SENSOR").visible = false;
    findField(data, "BFLOOR").visible = false;
  }
  if (item.name === "ADDRESS_FLAT") {
    try {
      const fiasId = item.value.data.house_fias_id;
      if (!fiasId) {
        throw new Error(`Нет fiasId у дома`);
      }
      const fiasResponse = await $nuxt.$axios(`/am/main/v2/dicwf/71615?FIAS_ID=${fiasId}`);

      const [buildYearRow] = fiasResponse.data[0]._data;
      if (!buildYearRow) {
        throw new Error(`Не найдены данные по дому`);
      }
      const buildYear = buildYearRow.VCBUILD_YEAR;
      if (!buildYear) {
        buildYearField.value = "";
        throw new Error(`Не найден VCBUILD_YEAR`);
      }

      buildYearField.value = String(buildYear);
      if (buildYearField.value) {
        buildYearField.state = true;
        buildYearField.error = null;
      }
    } catch (err) {
      console.error("Не удалось подобрать год постройки", err);
      buildYearField.value = "";
      buildYearField.state = null;
      buildYearField.error = null;
    }
  }
  // Дата начала страхования по дате кредита в будущем
  if (item.name === "DCR_DATE") {
    const dcr_date = parseDateByMask(item.value);
    const dfrom_date = parseDateByMask(findField(data, "DFROM_DATE").value);
    if (dcr_date > dfrom_date) {
      findField(data, "DFROM_DATE").value = item.value;
    }
  }
  // Дата окончания страхования по дате окончания кредита
  if (item.name === "DCR_TODATE") {
    if (IDLENDER.value !== 379787 && IDLENDER.value !== 24503) {
      findField(data, "DTO_DATE").value = item.value;
    }
  }
  // Дата окончания для РСХБ
  if (item.name === "DFROM_DATE" || item.name === "DCR_DATE") {
    if (IDLENDER.value == 379787 || IDLENDER.value == 24503) {
      const [dFrom, mFrom, yFrom] = item.value.split(".");
      const dateInputDate = new Date(yFrom, Number(mFrom) - 1, dFrom); // добавил переменную, т.к в следующем блоке if переменная dateInput не обновляется
      const dateFrom = new Date(yFrom, Number(mFrom) - 1, dFrom);
      dateFrom.setFullYear(dateFrom.getFullYear() + 1);
      dateFrom.setDate(dateFrom.getDate() - 1);
      const formattedDate = [dateFrom.getDate(), dateFrom.getMonth() + 1, dateFrom.getFullYear()]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");
      const toDate = findField(data, "DTO_DATE");
      toDate.value = formattedDate;
    }
  }

  return data;
}
