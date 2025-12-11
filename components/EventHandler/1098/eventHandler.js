import { findField, calculatePrice } from "../helpers";
import { scrollToCardHead } from "@/utils/scroll";

function getPrice(data) {
  const { fullPrice, additional } = calculatePrice(data, "NCOST", "IMSOPTIONS");

  const NCOST = findField(data, "NCOST");
  NCOST.fullPrice = fullPrice;
  NCOST.additional = additional;
}

function changeVisibleSafety(data, name, value) {
  const field = findField(data, name);
  if (field) {
    field.visible = value;
  }
}

function changeVisibleList(data, arr = [], value = false) {
  arr.forEach((name) => {
    changeVisibleSafety(data, name, value);
  });
}

function showWhiteCardInformer(data) {
  const SERROR_INFO = findField(data, "SWARNING_INFO_1");
  const IMSOPTIONS = findField(data, "IMSOPTIONS");

  if (SERROR_INFO && IMSOPTIONS) {
    const errorWhiteCard = IMSOPTIONS.options?.[0]?.NPRICE === "0";
    const whiteCardChecked = IMSOPTIONS.value !== "[]";
    const show = errorWhiteCard && whiteCardChecked;

    changeVisibleSafety(data, "SWARNING_INFO_1", show);
  }
}

export function eventHandler(data, item, callback) {
  const idStep = findField(data, "IDSTEP");

  if (item.name === "IMSOPTIONS") {
    showWhiteCardInformer(data);
    getPrice(data);
    if ([14, 15].includes(idStep.value)) {
      changeVisibleSafety(data, "Continue", false);
      changeVisibleSafety(data, "POLICY_NSIS", true);
    }
    if ([10].includes(idStep.value)) {
      changeVisibleSafety(data, "SEND_NSIS", false);
      changeVisibleSafety(data, "POLICY_NSIS", true);
    }
  }

  const stoa = findField(data, "IDSTOA");
  const previousSeriesEdit = findField(data, "IDLAST_SERIES_EDIT");
  const previousNumberEdit = findField(data, "SLAST_NUMBER_EDIT");
  // Блок управления полями серии и номера предыдущего полиса в ОСАГО начало
  const masrAsValid = (field) => {
    field.error = null;
    field.state = true;
    field.required = true;
  };

  const resetField = (field) => {
    field.state = null;
    field.error = null;
    field.required = false;
  };

  const markAsError = (field) => {
    field.error = "Пожалуйста,заполните поле";
    field.state = false;
    field.required = true;
  };
  // IDLAST_SERIES_EDIT - Серия предыдущий полис ОСАГО
  if (item.name === "IDLAST_SERIES_EDIT" && previousSeriesEdit.value) {
    masrAsValid(previousSeriesEdit);
    previousNumberEdit.required = true;
    if (!previousNumberEdit.value) {
      previousNumberEdit.state = false;
      previousNumberEdit.error = "Пожалуйста,заполните поле";
    }
  }

  // SLAST_NUMBER_EDIT - Номер предыдущего полиса ОСАГО
  if (item.name === "SLAST_NUMBER_EDIT" && previousNumberEdit.value) {
    masrAsValid(previousNumberEdit);
    previousSeriesEdit.required = true;

    if (!previousSeriesEdit.value) {
      previousSeriesEdit.state = false;
      previousSeriesEdit.error = "Пожалуйста,заполните поле";
    }
  }

  //- Серия Номер предыдущего полиса ОСАГО
  // При отсутствии Серии и наличии Номера делаем поле Серия обязательным
  if (item.name === "IDLAST_SERIES_EDIT" && !item.value && previousNumberEdit.value) {
    markAsError(previousSeriesEdit);
  }

  // - Серия Номер предыдущего полиса ОСАГО
  // При отсутствии значений поля Серия и Номер становятся необязательными
  if (!previousSeriesEdit.value && !previousNumberEdit.value) {
    resetField(previousSeriesEdit);
    resetField(previousNumberEdit);
  }
  // - Серия Номер предыдущего полиса ОСАГО
  // При наличии значений поля Серия и Номер обязательные
  if (previousSeriesEdit.value && previousNumberEdit.value) {
    masrAsValid(previousSeriesEdit);
    masrAsValid(previousNumberEdit);
  }
  // Блок управления полями серии и номера предыдущего полиса в ОСАГО конец
  if (item.name === "SURL_TECH") {
    stoa.visible = true;
    changeVisibleList(data, ["STECH_INFO", "SURL_TECH"], false);
  }
  if (stoa.visible === true) {
    if (stoa.value == 2) {
      changeVisibleSafety(data, "IDLIST_STOA", true);
      changeVisibleSafety(data, "SADDRESS_STOA", false);
    } else if (stoa.value == 4) {
      changeVisibleSafety(data, "IDLIST_STOA", false);
      changeVisibleSafety(data, "SADDRESS_STOA", true);
    } else {
      changeVisibleList(data, ["IDLIST_STOA", "SADDRESS_STOA"], false);
    }
  }
  if (item.name === "SURL_ADD_DATA") {
    const listShow = ["IDLAST_SERIES_EDIT", "SLAST_NUMBER_EDIT", "IDLAST_COMPANY_EDIT", "SADD_INFO_EDIT"];
    const listHide = ["SLAST_SERIES", "SLAST_NUMBER", "SLAST_COMPANY", "SADD_INFO", "SURL_ADD_DATA"];

    changeVisibleList(data, listHide, false);
    changeVisibleList(data, listShow, true);
  }
  const vehicleData = findField(data, "SVEHICLE_DATA");
  if (vehicleData.visible) {
    const list = [
      "IDSTOA",
      "IDLIST_STOA",
      "SADDRESS_STOA",
      "IDLAST_SERIES_EDIT",
      "SLAST_NUMBER_EDIT",
      "IDLAST_COMPANY_EDIT",
      "SADD_INFO_EDIT",
      "STECH_INFO",
      "SURL_TECH",
      "SLAST_SERIES",
      "SLAST_NUMBER",
      "SLAST_COMPANY",
      "SADD_INFO",
      "SURL_ADD_DATA",
    ];
    changeVisibleList(data, list, false);
  }

  return data;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_osago");
  showWhiteCardInformer(data);

  getPrice(data);
  return data;
}
