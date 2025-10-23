import { validationEmail } from "../helpers/validationEmail";
import { findField } from "../helpers/findField";

export async function eventHandler(data, item, callback) {
  const getCodeButton = findField(data, "Item47480");
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
