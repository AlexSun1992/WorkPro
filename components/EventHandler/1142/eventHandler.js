import { scrollToCardHead } from "@/utils/scroll";

export async function eventHandler(data, item, callback) {
  const copyData = JSON.parse(JSON.stringify(data));
  const field = copyData.find((f) => f.fieldId === item.fieldId);
  const codeSms = copyData.find((f) => f.name === "SCODEFIELD");
  const emailField = copyData.find((f) => f.name === "SEMAILNEW");

  if (field?.name === "Item48366" && emailField.state && emailField.value.length) {
    codeSms.visible = true;
  }
  if (emailField.state === false || !emailField.value.length) {
    codeSms.visible = false;
    codeSms.value = "";
    codeSms.state = null;
  }
  return copyData;
}
export function initHandler(data) {
  scrollToCardHead(".wizard_antiklesh");

  return data;
}
