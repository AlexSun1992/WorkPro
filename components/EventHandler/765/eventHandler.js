export function eventHandler(data, item, action) {
  const field = data.find((f) => f.fieldId === item.fieldId);
  function validate(value) {
    if (value) {
      if (value?.length < 10) {
        field.error = "Длина номера полиса должна быть 10 символов";
        field.state = false;
      } else if (value?.length === 10) {
        field.error = null;
        field.state = true;
      }
    }
  }
  if (field.name === "SNUMBER") {
    validate(item.value);
  }
  if (field.name === "Item36465") {
    const SSERIES = data.find((f) => f.name === "SSERIES");
    const SNUMBER = data.find((f) => f.name === "SNUMBER");
    const FIELD_BUTTON_CHANGE = data.find((f) => f.name === "Item36467");
    const FIELD_CAPTCHA = data.find((f) => f.name === "CAPTCHA");

    if (action === "beforeSave") {
      validate(SNUMBER.value);
    }
    if (action === "afterSave") {
      if (FIELD_CAPTCHA.visible === false) {
        SSERIES.readonly = true;
        SNUMBER.readonly = true;
        FIELD_BUTTON_CHANGE.visible = true;
        field.visible = false;
      }
    }
  }
  return data;
}
