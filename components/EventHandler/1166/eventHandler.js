import { findField } from "@/components/EventHandler/helpers";

export function initHandler(data) {
  return data;
}
export function eventHandler(data, item, callback) {
  const lender = findField(data, "IDLENDER");
  const life = findField(data, "BMAN_MOR");
  const flat = findField(data, "BFLAT_MOR");
  const title = findField(data, "BTITLE");
  const INSURED_LIST = findField(data, "INSURED_LIST");
  const debt_remaining = findField(data, "NCR_SUM");
  const field = data.find((f) => f.fieldId === item.fieldId);

  // Показываем поле даты начала кредита (для Альфы, ВТБ, СПБ)
  if (lender.value === 28018 || lender.value === 3274410 || lender.value === 2615626) {
    findField(data, "DCR_DATE").visible = true;
  } else {
    findField(data, "DCR_DATE").visible = false;
  }

  // Не показываем риск "Титул" для Сбера
  if (lender.value === 24503) {
    title.visible = false;
    title.value = false;
    findField(data, "STITLE").visible = false;
    findField(data, "IDPROPERTY_TYPE").visible = false;
  } else {
    title.visible = true;
  }

  if (item.name === "NCR_SUM") {
    debt_remaining.value = debt_remaining.value
      .toString()
      .replace(/\s+/g, "")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
  }

  // Поля для Жизни
  if (life.value == true) {
    findField(data, "SLIFE").visible = true;
    findField(data, "INSURED_LIST").visible = true;
  } else {
    findField(data, "SLIFE").visible = false;
    findField(data, "INSURED_LIST").visible = false;
  }
  // Поля для Имущества
  if (title.value == false && flat.value == true) {
    findField(data, "SFLAT").visible = true;
    findField(data, "IDPROPERTY_TYPE").visible = true;
  } else {
    findField(data, "SFLAT").visible = false;
  }
  // Поля для Титула
  if (title.value == true && flat.value == false) {
    findField(data, "STITLE").visible = true;
    findField(data, "IDPROPERTY_TYPE").visible = true;
  } else {
    findField(data, "STITLE").visible = false;
  }
  // Поля для Титула и Имущества
  if (title.value == true && flat.value == true) {
    findField(data, "STITLE_FLAT").visible = true;
    findField(data, "IDPROPERTY_TYPE").visible = true;
  } else {
    findField(data, "STITLE_FLAT").visible = false;
  }
  if (title.value == false && flat.value == false) {
    findField(data, "IDPROPERTY_TYPE").visible = false;
  }

  // OneToMany для списка застрахованных
  if (
    field?.name === "INSURED_LIST" &&
    INSURED_LIST.value.length == 2 &&
    findField(INSURED_LIST.value[0], "NPERC_DOP").value == 100
  ) {
    findField(INSURED_LIST.value[0], "NPERC_DOP").value = 50;
    findField(INSURED_LIST.value[0], "NPERC_DOP").state = true;
    findField(INSURED_LIST.value[1], "NPERC_DOP").value = 50;
    findField(INSURED_LIST.value[1], "NPERC_DOP").state = true;
  }

  return data;
}
