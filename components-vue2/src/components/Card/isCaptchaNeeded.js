export function getFieldDemanded(fieldsArray, demandedField) {
  return fieldsArray?.find((item) => item.name === demandedField)?.visible;
}

export function isCaptchaNeeded(data) {
  const captchaField = data.find((item) => item.name === "SCAPTCHA");

  return captchaField ? captchaField.visible : false;
}
