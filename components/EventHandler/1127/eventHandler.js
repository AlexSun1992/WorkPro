import { scrollToCardHead } from "@/utils/scroll";

export function eventHandler(data, item) {
  const copyData = JSON.parse(JSON.stringify(data));
  const field = copyData.find((f) => f.fieldId === item.fieldId);
  const numberPhone = copyData.find((f) => f.name === "SPHOLDER_PHONENOAUTH");
  const codePhone = copyData.find((f) => f.name === "SCODE_PHONE");

  if (!field) {
    return copyData;
  }

  if (field.name === "Item48361" && numberPhone.value?.length && numberPhone.state) {
    codePhone.visible = true;
  }
  if (numberPhone.state === false || !numberPhone.value.length) {
    codePhone.visible = false;
    codePhone.state = null;
    codePhone.value = "";
  }

  return copyData;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_antiklesh");

  return data;
}
