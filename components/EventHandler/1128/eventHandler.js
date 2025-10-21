import { scrollToCardHead } from "@/utils/scroll";

function eventHandler(fields, item) {
  console.log("local eventHandler", item);
  return fields;
}
export { eventHandler };
export function initHandler(data) {
  scrollToCardHead(".wizard_antiklesh");

  return data;
}
