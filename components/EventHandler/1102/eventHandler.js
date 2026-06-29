import { findField, calculatePrice } from "../helpers";
import { scrollToCardHead } from "@/utils/scroll";

function getPrice(data) {
  const { fullPrice, additional } = calculatePrice(data, "NCOST", "IMSOPTIONS");

  const NCOST = findField(data, "NCOST");
  NCOST.fullPrice = fullPrice;
  NCOST.additional = additional;
}

export function initHandler(data) {
  const newData = [...data];
  scrollToCardHead(".wizard_osago");

  getPrice(newData);
  return newData;
}

export function eventHandler(data, item) {
  const newData = [...data];

  getPrice(newData);

  if (item.name === "Item46211" && Array.isArray(data)) {
    findField(newData, "Item46215").visible = true;
    findField(newData, "Item45849").visible = false;
  }

  return newData;
}
