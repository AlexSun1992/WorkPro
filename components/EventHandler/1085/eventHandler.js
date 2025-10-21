import { scrollToCardHead } from "@/utils/scroll";

export function eventHandler(fields, item) {
  console.log("local eventHandler", item);
  return fields;
}
export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  return data;
}
