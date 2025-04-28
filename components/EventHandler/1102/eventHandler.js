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
    const newData = [...data];

    if (item.name === "Item45847" && Array.isArray(data)) {
      newData.find((f) => f.name === "Item45848").visible = true;
      newData.find((f) => f.name === "Item45849").visible = false;
    }

    return newData;
  }

  window.eventHandler = eventHandler;
  window.initHandler = initHandler;
})();
