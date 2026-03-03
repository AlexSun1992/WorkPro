import { getDate } from "./getDate";

export function validationDateField(item, field, errorText) {
  const dates = {
    birth: getDate(item?.value).setHours(0, 0, 0, 0),
    current: new Date(new Date().setHours(0, 0, 0, 0)),
  };

  if (dates.birth) {
    const isCurrentDate = dates.birth > dates.current;
    field.state = !isCurrentDate;
    field.error = isCurrentDate ? errorText : null;
  }

  if (!item.value && field.state === false) {
    field.error = "Обязательно для заполнения";
  }
}
