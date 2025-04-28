(() => {
  function scrollToCardHead() {
    const selector = ".wizard_osago";

    document.querySelector(selector)?.scrollIntoView({behavior: "smooth", block: "start"});
  }

  function initHandler(data) {
    scrollToCardHead();

    return data;
  }

  function eventHandler(data, item) {
    return data;
  }

  window.eventHandler = eventHandler;
  window.initHandler = initHandler;
})();
