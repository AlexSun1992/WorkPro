import { scrollToCardHead } from "@/utils/scroll";
import { findField } from "../helpers";

export function eventHandler(data) {
  return data;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  const guid = findField(data, "SGUID");

  if (guid?.value) {
    sessionStorage.setItem("PHONE_VERIFICATED_GUID", guid.value);
  }

  return data;
}
