import Vue from "vue";

Vue.prototype.$getCaptcha = async () => {
  // Перенести в keys
  const siteKey = "6Le_5tkUAAAAAI4paHCeddGpgcZCJZ2aAHfZaCme";
  const captchaToken = await window.grecaptcha.execute(`${siteKey}`);
  return captchaToken;
};
