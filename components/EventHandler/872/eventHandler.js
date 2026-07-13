import { findField } from "@/components/EventHandler/helpers";
import { setFieldsVisibleState } from "@/components/EventHandler/helpers/eventHandlerHelpers";

const disabilitySwitcher = (disabilityObject, disabilityStatus) => {
  if (disabilityObject) {
    disabilityObject.disabled = !disabilityStatus;
    disabilityObject.readonly = !disabilityStatus;
  }
};
const deleteFieldValue = (fields = []) => {
  fields.forEach((field) => {
    delete field.value;
  });
};
const checkFieldsVisibleAndName = (region, policy, specialist) =>
  Boolean(
    region?.value?.value?.SNAME &&
      region?.visible &&
      policy?.value?.value?.SNAME &&
      policy?.visible &&
      specialist?.value?.value?.SNAME &&
      specialist?.visible
  );
const getValueHistory = (store, name) => store?.formValuesHistory?.[name];

const isValueChanged = (valuesHistory) =>
  !valuesHistory || valuesHistory.length <= 1 || valuesHistory[0]?.text !== valuesHistory[1]?.text;
const ITEM_PARAMS = {
  FKSPOLICY: "SNAME",
  FKIDSPECIALIST: "SNAME",
  FKSSCHEDULE: "SNAME",
  FKIDTOWN: "SNAME",
  FKIDREGION: "SNAME",
  FKSRECEPTIONTYPE: "STYPE",
};

export function initHandler(data) {
  const policy = findField(data, "FKSPOLICY");
  const specialist = findField(data, "FKIDSPECIALIST");
  const searchButton = findField(data, "GET_TIMETABLE");
  const region = findField(data, "FKIDREGION");
  if (policy?.visible) {
    setFieldsVisibleState([specialist, searchButton, region], true);
  }
  return data;
}

export function eventHandler(data, item, action) {
  if (action === "displayText") {
    if (!ITEM_PARAMS[data.name]) {
      throw new Error(`ошибка обработки displayText для поля ${data.name}`);
    }
    return item[ITEM_PARAMS[data.name]] || "Нет данных";
  }

  const policy = findField(data, "FKSPOLICY");
  const formTitle = findField(data, "FORM_TITLE");
  const doctorLabel = findField(data, "SDOCTORLABEL");
  const specialistLabel = findField(data, "SSPECIALISATION");
  const specialist = findField(data, "FKIDSPECIALIST");
  const datetimeLabel = findField(data, "DDATE_AND_TIME");
  const searchButton = findField(data, "GET_TIMETABLE");
  const schedule = findField(data, "FKSSCHEDULE");
  const createDoctorEntrybutton = findField(data, "Item43937");
  const backButton = findField(data, "BACK_BUTTON");
  const preentrySplitter = findField(data, "PREENTRYSPLITTER");
  const sPacient = findField(data, "SPATIENT");
  const sClinicAddress = findField(data, "SCLINICADDRESS");
  const sClinic = findField(data, "SCLINIC");
  const contactPhoneLabel = findField(data, "SCONTACTPHONE");
  const medPartner = findField(data, "IDMEDPARTNER");
  const contactNameLabel = findField(data, "SCONTACTNAME");
  const titleSearchResult = findField(data, "SEARCH_RESULT_TITLE");
  const emptyBlk = findField(data, "emptyBlk");
  const lpuModal = findField(data, "SLPUMODAL");
  const region = findField(data, "FKIDREGION");
  const reception_type = findField(data, "FKSRECEPTIONTYPE");
  const fieldsPack = [
    preentrySplitter,
    backButton,
    doctorLabel,
    specialistLabel,
    datetimeLabel,
    createDoctorEntrybutton,
    sPacient,
    sClinic,
    sClinicAddress,
  ];
  const pageOneFields = data.filter((item) => item.page === 1 && item.name).map((item) => findField(data, item.name));
  const anyClinicValue = {
    text: "Любая",
    value: { IDLPU: 0, SNAME: "Любая", ID: 0, IDLPUFILTR: 0, IDSYSTEMFILTR: -1 },
  };

  if (item.name === "FKSPOLICY") {
    if (isValueChanged(getValueHistory(this.$nuxt.$store.state.data_card, item.name)) && schedule.visible === false) {
      setFieldsVisibleState([lpuModal], false);
      setFieldsVisibleState(pageOneFields, false);
    }

    setFieldsVisibleState([lpuModal], checkFieldsVisibleAndName(region, policy, specialist));
    if (!item.value.value.SNAME) {
      region.value = {};
      specialist.value = {};
      return data;
    }

    medPartner.value = item.value.value.IDMEDPARTNER;
    contactPhoneLabel.value = item.value.value.SPHONE;
    contactNameLabel.value = `${item.value.value.SSECONDNAME} ${item.value.value.SFIRSTNAME} ${item.value.value.STHIRDNAME}`;
    if (
      region.value.value?.SNAME &&
      policy.value.value?.SNAME &&
      specialist.value.value?.SNAME &&
      schedule.visible === false
    ) {
      sClinic.readonly = false;
      setFieldsVisibleState([lpuModal], false);
      lpuModal.value = null;
    }
  }

  if (item.name === "FKIDSPECIALIST") {
    if (isValueChanged(getValueHistory(this.$nuxt.$store.state.data_card, item.name))) {
      setFieldsVisibleState(pageOneFields, false);
      lpuModal.value = anyClinicValue;
    }
    setFieldsVisibleState([policy, specialist, formTitle], true);
    setFieldsVisibleState(fieldsPack, false);

    setFieldsVisibleState([lpuModal], checkFieldsVisibleAndName(region, policy, specialist));
    deleteFieldValue([doctorLabel]);
    sClinic.readonly = false;

    if (
      region.value.value?.SNAME &&
      policy.value.value?.SNAME &&
      specialist.value.value?.SNAME &&
      isValueChanged(getValueHistory(this.$nuxt.$store.state.data_card, item.name))
    ) {
      setFieldsVisibleState([lpuModal], true);
      lpuModal.value = null;
    }
  }

  if (item.name === "FKIDREGION") {
    if (isValueChanged(getValueHistory(this.$nuxt.$store.state.data_card, item.name))) {
      setFieldsVisibleState(pageOneFields, false);
      lpuModal.value = null;
    }
    if (policy.value.value?.SNAME && isValueChanged(getValueHistory(this.$nuxt.$store.state.data_card, item.name))) {
      specialist.value = {};
    }
    setFieldsVisibleState([policy, specialist, region, formTitle], true);
    setFieldsVisibleState(fieldsPack, false);
    setFieldsVisibleState([lpuModal], checkFieldsVisibleAndName(region, policy, specialist));
    deleteFieldValue([doctorLabel]);
    if (
      region.value.value?.SNAME &&
      policy.value.value?.SNAME &&
      specialist.value.value?.SNAME &&
      isValueChanged(getValueHistory(this.$nuxt.$store.state.data_card, item.name))
    ) {
      setFieldsVisibleState([lpuModal], true);
    }

    sClinic.readonly = false;
  }

  if (item.name === "SLPUMODAL" && isValueChanged(getValueHistory(this.$nuxt.$store.state.data_card, item.name))) {
    setFieldsVisibleState(pageOneFields, false);
    deleteFieldValue([schedule]);
  }

  if (item.value === "GET_TIMETABLE") {
    setFieldsVisibleState([schedule, region, policy, specialist, formTitle], true);
    setFieldsVisibleState(fieldsPack, false);
    deleteFieldValue([schedule, doctorLabel]);
    document.querySelector("main").scrollIntoView();
  }

  if (item.name === "FKSSCHEDULE") {
    if (!item.value.value) {
      return data;
    }
    setFieldsVisibleState(fieldsPack, true);
    setFieldsVisibleState(
      [formTitle, policy, specialist, region, emptyBlk, searchButton, schedule, titleSearchResult, lpuModal],
      false
    );
    setFieldsVisibleState([reception_type], schedule.value.value.PL_SUBJ_ID !== 0);

    sClinic.value = item.value.value.SDESCRIPTION;
    doctorLabel.value = item.value.value.SNAME;
    specialistLabel.value = specialist.value.value.SNAME;
    sPacient.value = policy.value.value.SNAME;
    sClinicAddress.value = item.value.value.SADDRESS;
    datetimeLabel.value = `${item.value.value.DFROM}, ${new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(item.value.value.DDATE))}`;

    this.$store.commit("data_card/setFilters", {
      IDDOCTOR: item.value.value.IDPERSON,
      SNAME: item.value.value.SNAME,
      ID: item.value.value.IDPERSON,
      SFULLNAME: item.value.value.SNAME,
    });
    this.$store.commit("data_card/setFilters", {
      IDLPU: item.value.value.IDLPU,
      SNAME: item.value.value.SDESCRIPTION,
      ID: item.value.value.IDLPU,
      IDLPUFILTR: item.value.value.IDLPUFILTR,
      IDSYSTEMFILTR: item.value.value.IDSYSTEMFILTR,
    });

    document.querySelector("main").scrollIntoView();
  }

  if (item.value === "BACK_BUTTON") {
    setFieldsVisibleState([emptyBlk, policy, specialist, region, formTitle, schedule, lpuModal, searchButton], true);
    setFieldsVisibleState([preentrySplitter, reception_type], false);
    deleteFieldValue([reception_type]);
    document.querySelector("main").scrollIntoView();
  }

  disabilitySwitcher(specialist, Boolean(policy?.value?.value?.SNAME && region?.value?.value?.SNAME));
  disabilitySwitcher(
    searchButton,
    Boolean(region?.value?.value?.SNAME && policy?.value?.value?.SNAME && specialist?.value?.value?.SNAME)
  );
  disabilitySwitcher(createDoctorEntrybutton, Boolean(reception_type?.visible && reception_type?.value?.value?.STYPE));
  return data;
}
