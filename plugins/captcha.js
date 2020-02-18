import Vue from 'vue'

Vue.prototype.$getCaptcha = async () => {
    const siteKey = '6LeO2dgUAAAAAOCANdOMWTfUW0eLjluo7UKC366h';
    const captcha = await window['grecaptcha'].execute(`${siteKey}`);
    return captcha;
}