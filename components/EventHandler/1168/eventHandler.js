import { findField } from "@/components/EventHandler/helpers";

export function initHandler(data) {
  return data;
}
export function eventHandler(data, item, callback) {
  if (item.name === "Item52661") {
    findField(data, "SCODE_PHONE").visible = true;
  }

  return data;
}
