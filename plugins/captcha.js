import Vue from "vue";

Vue.prototype.$getCaptcha = async () => {
  // Перенести в keys
  const siteKey = process.env.CAPTCHA_SITE_KEY;
  const captchaToken = await window.grecaptcha.execute(`${siteKey}`);
  return captchaToken;
};
