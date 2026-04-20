import { scrollToCardHead } from "@/utils/scroll";
import { findField } from "../helpers/findField";

export function eventHandler(data, item, callback) {
  const idCode = findField(data, "IDCODE");

  if (item.name === "Item47345") {
    idCode.visible = true;
  }
  return data;
}
export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  return data;
}
