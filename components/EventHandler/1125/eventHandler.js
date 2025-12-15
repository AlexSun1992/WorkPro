import { scrollToCardHead } from "@/utils/scroll";

export function eventHandler(data, item) {
  const copyData = JSON.parse(JSON.stringify(data));
  const field = copyData.find((f) => f.fieldId === item.fieldId);
  const INSURED_LIST = copyData.find((f) => f.name === "INSURED_LIST");

  if (field?.name === "DFROM_DATE") {
    if (!item.value) {
      field.error = null;
      return copyData;
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
      const toDate = copyData.find((f) => f.name === "DTO_DATE");
      toDate.value = formattedDate;
      const inputDateField = copyData.find((f) => f.name === "DINPUT_DATE");

      if (inputDateField.value) {
        const [dInput, mInput, yInput] = inputDateField.value.split(".");
        const MaxInputDate = new Date(yInput, +mInput - 1, +dInput + 45);
        const MinInputDate = new Date(yInput, +mInput - 1, +dInput + 5);

        if (dateInputDate < MinInputDate) {
          // item.value = null
          field.error = "Дата начала должна быть позже даты заключения на 5 дней";
          field.state = false;
        } else if (dateInputDate > MaxInputDate) {
          field.error = "Дата начала должна быть не позже, чем через 45 дней";
          field.state = false;
        } else {
          field.state = true;
          field.error = null;
        }
      }
    }
  }

  function findDeepBasedField(dataSet, name, index) {
    const field = dataSet[index].find((el) => el.name === name);

    if (field !== undefined) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в ${dataSet}`);
  }

  if (item.value?.name === "INSURED_LIST") {
    const doc = findDeepBasedField(INSURED_LIST.value, "SDOC", item.value.index);

    if (item.value.value?.value === true) {
      doc.visible = true;
    }

    if (item.value.value?.value === false) {
      doc.visible = false;

      doc.value = null;

      doc.state = null;
    }
  }

  return copyData;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_antiklesh");
  const copyData = JSON.parse(JSON.stringify(data));

  function findField(dataSet, name) {
    const field = dataSet.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  const INSURED_LIST = findField(copyData, "INSURED_LIST");

  INSURED_LIST.value.forEach((item, index) =>
    item.forEach((el) => {
      if (el.name === "LADD_DOC") {
        const LADD_DOC = findField(INSURED_LIST.value[index], "LADD_DOC");

        if (LADD_DOC.value == "Y") {
          LADD_DOC.value = true;
          findField(INSURED_LIST.value[index], "SDOC").visible = true;
        }

        if (LADD_DOC.value == "N") {
          LADD_DOC.value = false;
          findField(INSURED_LIST.value[index], "SDOC").visible = false;
        }
      }
    })
  );

  return copyData;
}
