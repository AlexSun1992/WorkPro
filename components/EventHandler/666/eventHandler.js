import { findField } from "../helpers";

export function eventHandler(data, action, func) {
  if (data[0]?.id !== "666") {
    return data;
  }

  if (action.value !== "Item36918") {
    findField(data, "Item36918").visible = true;
    findField(data, "NPRICE").visible = false;
  }

  if (func === "afterSave") {
    findField(data, "Item36918").visible = false;
  }

  return data;
}
