import { scrollToCardHead } from "@/utils/scroll";

export function eventHandler(data, item, callback) {
  if (["afterSave", "beforeSave"].includes(callback)) return;
  const field = data.find((f) => f.fieldId === item.fieldId);

  const LAUTOLEND = data.find(({ name }) => name === "LAUTOLEND");
  const IDLENDER = data.find(({ name }) => name === "IDLENDER");
  const SCODEFIELD = data.find(({ name }) => name === "SCODEFIELD");
  const partnerEmail = data.find(({ name }) => name === "SPARTNER_EMAIL");
  const getCodeBtn = data.find(({ name }) => name === "Item51465");

  IDLENDER.visible = LAUTOLEND.value;

  if (field.name === "SPHOLDER_EMAIL") {
    const emailsMatch = partnerEmail?.value != null && field.value === partnerEmail?.value;
    if (emailsMatch) {
      getCodeBtn.visible = false;
      SCODEFIELD.visible = false;
      SCODEFIELD.value = null;
    } else {
      getCodeBtn.visible = true;
    }
  }

  if (field.name === "Item51465") {
    SCODEFIELD.visible = true;
  }

  if (field.name === "DFROM_DATE") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      const [dFrom, mFrom, yFrom] = item.value.split(".");
      const dateInputDate = new Date(yFrom, +mFrom - 1, dFrom); // добавил переменную, т.к в следующем блоке if переменная dateInput не обновляется
      const dateFrom = new Date(yFrom, +mFrom - 1, dFrom);
      dateFrom.setFullYear(dateFrom.getFullYear() + 1);
      dateFrom.setDate(dateFrom.getDate() - 1);
      const formattedDate = [dateFrom.getDate(), dateFrom.getMonth() + 1, dateFrom.getFullYear()]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");
      const toDate = data.find((f) => f.name === "DTO_DATE");
      toDate.value = formattedDate;
      const inputDateField = data.find((f) => f.name === "DINPUT_DATE");

      if (inputDateField.value) {
        const [dInput, mInput, yInput] = inputDateField.value.split(".");
        const MaxInputDate = new Date(yInput, +mInput - 1, +dInput + 45);
        const MinInputDate = new Date(yInput, +mInput - 1, +dInput + 3);

        if (dateInputDate < MinInputDate) {
          // item.value = null
          field.error = "Дата начала должна быть позже даты заключения на 3 дня";
          field.state = false;
        } else if (dateInputDate > MaxInputDate) {
          field.error = "Дата начала должна быть не позже, чем через 45 дней";
          field.state = false;
        } else {
          field.state = true;
          field.error = null;
        }
      }
      return data;
    }
  }

  if (field.name === "DINPUT_DATE") {
    data.find((f) => f.name === "DFROM_DATE").value = null;
    data.find((f) => f.name === "DTO_DATE").value = null;
    return data;
  }

  return data;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  const LAUTOLEND = data.find(({ name }) => name === "LAUTOLEND");
  const IDLENDER = data.find(({ name }) => name === "IDLENDER");

  console.log(LAUTOLEND.value, IDLENDER.visible);

  IDLENDER.visible = LAUTOLEND.value;

  const continueBtn = data.find((f) => f.name === "Continue");
  const saveBtn = data.find((f) => f.name === "Save");

  const emailField = data.find(({ name }) => name === "SPHOLDER_EMAIL");
  const partnerEmail = data.find(({ name }) => name === "SPARTNER_EMAIL");
  const getCodeBtn = data.find(({ name }) => name === "Item51465");
  const codeField = data.find(({ name }) => name === "SCODEFIELD");
  codeField.visible = false;

  const emailsMatch = partnerEmail?.value !== null && emailField?.value === partnerEmail?.value;

  getCodeBtn.visible = !emailsMatch;

  setTimeout(() => {
    if (document.querySelector(".price-block")) {
      const priceBlock = document.querySelector(".price-block");
      window.scrollTo(0, priceBlock.offsetTop - window.innerHeight / 2 + priceBlock.offsetHeight);
    }
  }, 0);
  if (continueBtn.visible === true) {
    if (saveBtn) {
      saveBtn.cssClass = "btn-secondary mb-3";
      return data;
    }
  }
  if (continueBtn.visible === false) {
    if (saveBtn) {
      saveBtn.cssClass = "";
      saveBtn.cssClass = "btn-primary";
      return data;
    }
  }
  return data;
}
