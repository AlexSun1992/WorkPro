import { findField } from "../helpers";

export function eventHandler(fields, action, func) {
  if (action.value !== "Item36918") {
    findField(data, "Item36918").visible = true;
    findField(data, "NPRICE").visible = false;
  }

  if (func === "afterSave") {
    findField(data, "Item36918").visible = false;
  }

  return fields;
}
