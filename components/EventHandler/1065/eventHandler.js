import { scrollToCardHead } from "@/utils/scroll";

export function eventHandler(data, item, callback) {
  if (["afterSave", "beforeSave"].includes(callback)) {
    return;
  }
  const LAUTOLEND = data.find(({ name }) => name === "LAUTOLEND");
  const IDLENDER = data.find(({ name }) => name === "IDLENDER");
  const LSYSTEM = data.find(({ name }) => name === "LSYSTEM");
  const IDSYSTEM = data.find(({ name }) => name === "IDSYSTEM");

  if (item.name === "LAUTOLEND" && LAUTOLEND.visible) {
    IDLENDER.visible = LAUTOLEND.value;
  }

  if (LSYSTEM.value === true) {
    IDSYSTEM.visible = true;
  }

  if (LSYSTEM.value === false) {
    IDSYSTEM.visible = false;
  }

  const field = data.find((f) => f.fieldId === item.fieldId);
  if (field.name === "NCOUNTKEY") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      if (!Number(item.value) || Number(item.value) < 0) {
        field.error = `Количество ключей ТС не может быть меньше 1`;
        field.state = false;
      } else if (Number(item.value) > 10) {
        field.error = `Количество ключей ТС не может быть больше 10`;
        field.state = false;
      } else {
        field.error = null;
        field.state = true;
      }
    }

    return data;
  }

  return data;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  const LAUTOLEND = data.find(({ name }) => name === "LAUTOLEND");
  const IDLENDER = data.find(({ name }) => name === "IDLENDER");
  const LSYSTEM = data.find(({ name }) => name === "LSYSTEM");
  const IDSYSTEM = data.find(({ name }) => name === "IDSYSTEM");

  if (LAUTOLEND.value === true) {
    IDLENDER.visible = true;
  }

  if (LAUTOLEND.value === false) {
    IDLENDER.visible = false;
  }

  if (LSYSTEM.value === true) {
    IDSYSTEM.visible = true;
  }

  if (LSYSTEM.value === false) {
    IDSYSTEM.visible = false;
  }

  return data;
}
