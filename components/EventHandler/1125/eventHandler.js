import Data from "@/components/Libs/BirthdatePicker/data";

export async function eventHandler(data, item, callback) {
  const field = data.find((f) => f.fieldId === item.fieldId);

  if (!field) {
    return data;
  }

  if (field.name === "DFROM_DATE") {
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item.value) {
      const [dFrom, mFrom, yFrom] = item.value.split(".");
      const dateInputDate = new Date(yFrom, +mFrom - 1, dFrom); // добавил переменную, т.к в следующем блоке if переменная dateInput не обновляется
      let dateFrom = new Date(yFrom, +mFrom - 1, dFrom);
      dateFrom.setFullYear(dateFrom.getFullYear() + 1);
      dateFrom.setDate(dateFrom.getDate() - 1);
      const formattedDate = [dateFrom.getDate(), dateFrom.getMonth() + 1, dateFrom.getFullYear()]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");
      const toDate = data.find((f) => f.name === "DTO_DATE");
      toDate.value = formattedDate;
      dateFrom = new Date(dFrom, mFrom, yFrom);
      const inputDateField = data.find((f) => f.name === "DINPUT_DATE");

      if (inputDateField.value) {
        const [dInput, mInput, yInput] = inputDateField.value.split(".");
        const dateInput = new Date(dInput, +mInput - 1, yInput);
        const inputDateFieldTest = data.find((f) => f.name === "DINPUT_DATE");
        const currentDate = new Date(); // определяю текущую дату
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
      return data;
    }
  }
}
