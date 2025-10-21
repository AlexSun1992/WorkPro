import { scrollToCardHead } from "@/utils/scroll";

export async function eventHandler(data, item, callback) {
  const copyData = JSON.parse(JSON.stringify(data));
  const field = copyData.find((f) => f.fieldId === item.fieldId);
  if (!field) {
    return copyData;
  }

  if (field.name === "Item47280") {
    copyData.forEach((f) => {
      if (f.name === "SCODE_PHONE") f.visible = true;
      if (f.name === "Empty_1") f.visible = false;
    });
  }
  return copyData;
}
export function initHandler(data) {
  scrollToCardHead(".wizard_antiklesh");

  return data;
}
