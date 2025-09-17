export function scrollTo(selector = ".wizard_osago") {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
