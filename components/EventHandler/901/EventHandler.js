export function initHandler() {
  return "";
}
export function eventHandler(data, item, action) {
  if (action === "displayText") {
    if (data.name === "FKSPOLICY") {
      return `${item.SNAME}`;
    }

    if (data.name === "FKIDSPECIALIST") {
      return `${item.SNAME}`;
    }

    if (data.name === "FKSSCHEDULE") {
      return item.SPERSON ? `${item.SNAME}` : `Нет данных`;
    }
    if (data.name === "FKSLPU") {
      return `${item.SNAME} ${
        item.SADDRESS ? item.SADDRESS.replace(/^\d{6}, /, "") : ""
      }`;
      // return `${item.SADDRESS} Время работы: ${item.STIME} `;
    }
    if (data.name === "FKSDOCTOR") {
      return `${item.SNAME}`;
    }
    if (data.name === "FKSRECEPTIONTYPE") {
      return `${item.SNAME}`;
    }

    throw new Error(`ошибка обработки displayText для поля ${data.name}`);
  }

  function setPageVisible(pageId, isVisible) {
    data.forEach((item) => {
      if (item.page === pageId) {
        item.visible = isVisible;
      }
    });
  }

  const policy = data.find((f) => f.name === "FKSPOLICY");
  const formTitle = data.find((f) => f.name === "FORM_TITLE");
  const contactPhoneLabel = data.find((f) => f.name === "SCONTACTPHONE");
  const medPartner = data.find((f) => f.name === "IDMEDPARTNER");
  const contactNameLabel = data.find((f) => f.name === "SCONTACTNAME");
  const doctorLabel = data.find((f) => f.name === "SDOCTORLABEL");
  const doctor = data.find((f) => f.name === "FKSDOCTOR");
  const specialistLabel = data.find((f) => f.name === "SSPECIALISATION");
  const specialist = data.find((f) => f.name === "FKIDSPECIALIST");
  const lpu = data.find((f) => f.name === "FKSLPU");
  const visitDate = data.find((f) => f.name === "DDATE");
  const datetimeLabel = data.find((f) => f.name === "DDATE_AND_TIME");
  const scheduleButton = data.find((f) => f.name === "GET_TIMETABLE");
  const schedule = data.find((f) => f.name === "FKSSCHEDULE");
  const make_button = data.find((f) => f.name === "Item37178");
  const back_button = data.find((f) => f.name === "BACK_BUTTON");
  const reason = data.find((f) => f.name === "SREASON");
  const reception_type = data.find((f) => f.name === "FKSRECEPTIONTYPE");
  const titleSearchResult = data.find((f) => f.name === "SEARCH_RESULT_TITLE");
  const preentrySplitter = data.find((f) => f.name === "PREENTRYSPLITTER");
  const sPacient = data.find((f) => f.name === "SPATIENT");
  const sPolicy = data.find((f) => f.name === "FKSPOLICY");
  const sServiceName = data.find((f) => f.name === "ACTIVECODE");
  const isFirstVisit = data.find((f) => f.name === "IS_FIRST_VISIT");
  const sClinicAddress = data.find((f) => f.name === "SCLINICADDRESS");
  const idLpuSelected = data.find((f) => f.name === "IDLPUSELECTED");
  const idDoctorSelected = data.find((f) => f.name === "IDDOCTORSELECTED");
  const sClinic = data.find((f) => f.name === "SCLINIC");

  if (item.name === "DDATE") {
    const currentData = new Date().toISOString().slice(0, 10).split("-");
    const currentDataDateFormat = new Date(...currentData);

    if (visitDate.value) {
      const choosenData = visitDate.value.split(".").reverse();
      const choosenDataDateFormat = new Date(...choosenData);
      choosenDataDateFormat >= currentDataDateFormat
        ? (visitDate.error = false)
        : (visitDate.error = "Необходимо ввести корректную дату");
      visitDate.error !== false
        ? (visitDate.state = false)
        : (visitDate.state = null);
    } else {
      visitDate.error = false;
      visitDate.state = null;
    }
  }

  if (item.name === "FKSPOLICY") {
    if (!item.value.value) {
      return data;
    }
    medPartner.value = item.value.value.IDMEDPARTNER;
    contactPhoneLabel.value = item.value.value.SPHONE;
    contactNameLabel.value = `${item.value.value.SSECONDNAME} ${item.value.value.SFIRSTNAME} ${item.value.value.STHIRDNAME}`;
    specialist.readonly = false;
    specialist.visible = true;
    if (specialist.value.value) {
      lpu.visible = true;
      scheduleButton.visible = true;
      scheduleButton.disabled = true;
    }
  }
  if (item.name === "FKIDSPECIALIST") {
    sClinic.readonly = false;
    if (policy.value.value) {
      lpu.value = {
        text: "Любая",
        value: { IDLPU: 0, SLPU: "Любая", SNAME: "Любая", ID: 0 },
      };
      doctor.value = {};
      lpu.visible = true;
      visitDate.visible = true;
      isFirstVisit.visible = true;
      reason.visible = true;
      scheduleButton.visible = true;
      scheduleButton.disabled = true;
      scheduleButton.readonly = true;
      sClinic.readonly = false;
    }
    sClinic.readonly = false;
    lpu.readonly = false;
  }
  if (item.name === "SREASON") {
    scheduleButton.readonly = false;
  }
  if (item.value === "GET_TIMETABLE") {
    console.log("item:", item);
    console.log("schedule:", schedule);
    console.log("action:", action);
    schedule.visible = true;
    titleSearchResult.visible = true;
    preentrySplitter.visible = false;
    back_button.visible = false;
    doctorLabel.visible = false;
    specialistLabel.visible = false;
    datetimeLabel.visible = false;
    make_button.visible = false;
    sPacient.visible = false;
    sServiceName.visible = false;
    sClinicAddress.visible = false;
    sClinic.visible = false;
  }
  if (item.name === "FKSSCHEDULE") {
    if (!item.value.value) {
      return data;
    }

    formTitle.visible = false;
    sPolicy.visible = false;
    specialist.visible = false;
    lpu.visible = false;
    visitDate.visible = false;
    reason.visible = false;
    scheduleButton.visible = false;
    isFirstVisit.visible = false;
    formTitle.visible = false;

    preentrySplitter.visible = true;
    back_button.visible = true;
    doctorLabel.visible = true;
    specialistLabel.visible = true;
    datetimeLabel.visible = true;
    make_button.visible = true;
    sPacient.visible = true;
    sServiceName.visible = true;
    sClinic.visible = true;
    sClinicAddress.visible = true;

    idDoctorSelected.value = item.value.value.IDPERSON;
    idLpuSelected.value = item.value.value.IDLPU;
    sClinic.value = `${item.value.value.FKIDLPU}`;
    doctorLabel.value = `${item.value.value.SPERSON}`;
    specialistLabel.value = `${specialist.value.value.SNAME}`;

    sPacient.value = `${sPolicy.value.value.SNAME}`;
    sClinicAddress.value = `${item.value.value.SADDRESS}`;
    sServiceName.value =
      isFirstVisit.value === "Y" || isFirstVisit.value === true
        ? `Первичная консультация`
        : `Повторная консультация`;
    datetimeLabel.value = `${item.value.value.DFROM}, ${new Intl.DateTimeFormat(
      "ru-RU",
      { day: "numeric", month: "long", year: "numeric" }
    ).format(new Date(item.value.value.DDATE))}`;

    titleSearchResult.visible = false;
    schedule.visible = false;
    document.querySelector("main").scrollIntoView();
  }

  if (item.value === "BACK_BUTTON") {
    setPageVisible(0, true);
    titleSearchResult.visible = true;
    schedule.visible = true;
    preentrySplitter.visible = false;
    back_button.visible = false;
    doctorLabel.visible = false;
    specialistLabel.visible = false;
    datetimeLabel.visible = false;
    make_button.visible = false;
    sPacient.visible = false;
    sServiceName.visible = false;
    sClinicAddress.visible = false;
    sClinic.visible = false;
    back_button.visible = false;
    scheduleButton.visible = false;
    policy.visible = true;
    // schedule.value = {};
    lpu.visible = true;
    specialist.visible = true;
    contactNameLabel.visible = false;
    contactPhoneLabel.visible = false;
    doctorLabel.visible = false;
    specialistLabel.visible = false;
    datetimeLabel.visible = false;
    make_button.visible = false;
    reception_type.visible = false;
    scheduleButton.visible = true;
    delete doctorLabel.value;
    delete specialistLabel.value;
    delete datetimeLabel.value;
  }

  if (item.name === "FKIDSPECIALIST" && schedule.visible === true) {
    setPageVisible(1, false);
    // schedule.visible = false
    scheduleButton.visible = true;
  }

  if (item.name === "FKSPOLICY" && schedule.visible === true) {
    setPageVisible(1, false);
    // schedule.visible = false
    scheduleButton.visible = true;
  }

  if (item.name === "FKSLPU" && schedule.visible === true) {
    setPageVisible(1, false);
    // schedule.visible = false
    scheduleButton.visible = true;
  }

  if (item.name === "DDATE" && schedule.visible === true) {
    setPageVisible(1, false);
    // schedule.visible = false
    scheduleButton.visible = true;
  }

  if (item.name === "DDATE" && reason.value !== undefined) {
    scheduleButton.readonly = false;
  }

  if (item.name === "FKIDSPECIALIST" && reason.value !== undefined) {
    scheduleButton.readonly = false;
  }

  if (item.name === "FKSLPU" && reason.value !== undefined) {
    scheduleButton.readonly = false;
  }

  if (item.name === "FKSPOLICY" && reason.value !== undefined) {
    scheduleButton.readonly = false;
  }

  if (item.name === "SREASON") {
    if (reason.value === "") {
      scheduleButton.readonly = true;
    }
  }

  if (schedule.visible === true) {
    scheduleButton.visible = false;
  }

  return data;
}
