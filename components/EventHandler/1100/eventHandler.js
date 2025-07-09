function scrollToCardHead() {
  const selector = ".wizard_osago";

  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function initHandler(data) {
  scrollToCardHead();

  return data;
}

export function eventHandler(data, item) {
  return data;
}
