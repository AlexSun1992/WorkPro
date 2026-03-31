import { validationEmail } from "../helpers/validationEmail";
import { findField } from "../helpers/findField";

export function eventHandler(data, item) {
  const getCodeButton = findField(data, "Item52027");
  const emailField = findField(data, "SEMAILNEW");

  validationEmail(emailField);

  if (emailField.value.length === 0) {
    emailField.state = false;
  }

  if (item.name === getCodeButton.name && emailField.state) {
    data.find((f) => f.name === "SCODEFIELD").visible = true;
    return data;
  }
  return data;
}
