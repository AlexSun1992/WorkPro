import { findField } from "@/components/EventHandler/helpers";

export function initHandler(data) {
  return data;
}
export function eventHandler(data, item, callback) {
  const field = data.find((f) => f.fieldId === item.fieldId);

  if (field.name === "Item52663") {
    findField(data, "SCODEFIELD").visible = true;
  }
  return data;
}
