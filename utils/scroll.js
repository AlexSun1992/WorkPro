export function scrollToCardHead(selector = "body") {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
