import { findField } from "../helpers";

function scrollToCardHead() {
  const selector = ".wizard_osago";

  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function initHandler(data) {
  scrollToCardHead();

  return data;
}

export function eventHandler(data, item) {
  const newData = [...data];

  if (item.name === "Item46211" && Array.isArray(data)) {
    findField(newData, "Item46215").visible = true;
    findField(newData, "Item45849").visible = false;
  }

  return newData;
}
