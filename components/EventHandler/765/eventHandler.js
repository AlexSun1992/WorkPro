export function eventHandler(data, item, action) {
  const field = data.find((f) => f.fieldId === item.fieldId);
  const FIELD_CAPTCHA = data.find((f) => f.name === "CAPTCHA");
  const charCount = 10;

  if (data[0]?.id !== "765") {
    return data;
  }

  function validate(value) {
    if (value) {
      if (value?.length < charCount) {
        field.error = "Длина номера полиса должна быть 10 символов";
        field.state = false;

        return false;
      }

      if (value?.length === charCount) {
        field.error = null;
        field.state = true;

        return true;
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
