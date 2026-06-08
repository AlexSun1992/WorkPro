import { findField } from "../helpers/findField";

export function initHandler(data) {
  return data;
}

export function eventHandler(data, item) {
  if (!item) {
    return data;
  }

  const phoneField = findField(data, "SPHOLDER_PHONENOAUTH");
  const isPhoneValid = phoneField?.value?.length >= 10;
  const smsButtonField = findField(data, "Item52026");
  const smsCodeField = findField(data, "SCODE");
  console.log(item, "item");

  if (item.name === "SPHOLDER_PHONENOAUTH") {
    const isPhoneValid = item.value?.length >= 10;
    smsButtonField.readonly = !isPhoneValid;
  }

  if (item.name === "Item52026") {
    if (smsCodeField && isPhoneValid) {
      smsCodeField.visible = true;
    }
  }

  return data;
}
