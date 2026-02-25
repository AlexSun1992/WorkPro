import { scrollToCardHead } from "@/utils/scroll";
import { findField } from "../helpers";

export function eventHandler(data, item) {
  const fieldMailAddress = findField(data, "SEMAILNEW");
  const sCodeField = findField(data, "SCODEFIELD");

  if (item.name === "Item47606" && !fieldMailAddress.error && fieldMailAddress.state) {
    sCodeField.visible = true;
  }
  return data;
}
export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  return data;
}
