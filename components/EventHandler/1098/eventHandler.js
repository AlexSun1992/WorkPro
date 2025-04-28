function scrollToCardHead() {
  const selector = ".wizard_osago";

  document.querySelector(selector)?.scrollIntoView({behavior: "smooth", block: "start"});
}

function eventHandler(data, item, callback) {
  function findField(name) {
    const field = data.find((field) => field.name === name);
    if (field) {
      return field;
    }
    console.warn("can't find field", name);
    return {};
  }
  function changeVisibleSafety(name, value) {
    const field = findField(name);
    if (field) {
      field.visible = value;
    }
  }

  const stoa = findField("IDSTOA");

  if (item.name === "SURL_TECH") {
    stoa.visible = true;
    changeVisibleSafety("STECH_INFO", false);
    changeVisibleSafety("SURL_TECH", false);
  }
  if (stoa.visible === true) {
    if (stoa.value == 2) {
      changeVisibleSafety("IDLIST_STOA", true);
      changeVisibleSafety("SADDRESS_STOA", false);
    } else if (stoa.value == 4) {
      changeVisibleSafety("IDLIST_STOA", false);
      changeVisibleSafety("SADDRESS_STOA", true);
    } else {
      changeVisibleSafety("IDLIST_STOA", false);
      changeVisibleSafety("SADDRESS_STOA", false);
    }
  }
  if (item.name === "SURL_ADD_DATA") {
    changeVisibleSafety("IDLAST_SERIES_EDIT", true);
    changeVisibleSafety("SLAST_NUMBER_EDIT", true);
    changeVisibleSafety("IDLAST_COMPANY_EDIT", true);
    changeVisibleSafety("SADD_INFO_EDIT", true);

    changeVisibleSafety("SLAST_SERIES", false);
    changeVisibleSafety("SLAST_NUMBER", false);
    changeVisibleSafety("SLAST_COMPANY", false);
    changeVisibleSafety("SADD_INFO", false);

    changeVisibleSafety("SURL_ADD_DATA", false);
  }
  const vehicleData = findField("SVEHICLE_DATA");
  if (vehicleData.visible) {
    changeVisibleSafety("IDSTOA", false);

    changeVisibleSafety("IDLIST_STOA", false);
    changeVisibleSafety("SADDRESS_STOA", false);
    changeVisibleSafety("IDLAST_SERIES_EDIT", false);
    changeVisibleSafety("SLAST_NUMBER_EDIT", false);
    changeVisibleSafety("IDLAST_COMPANY_EDIT", false);
    changeVisibleSafety("SADD_INFO_EDIT", false);

    changeVisibleSafety("STECH_INFO", false);
    changeVisibleSafety("SURL_TECH", false);
    changeVisibleSafety("SLAST_SERIES", false);
    changeVisibleSafety("SLAST_NUMBER", false);
    changeVisibleSafety("SLAST_COMPANY", false);
    changeVisibleSafety("SADD_INFO", false);
    changeVisibleSafety("SURL_ADD_DATA", false);
  }

  return data;
}

function initHandler(data) {
  scrollToCardHead();
}
