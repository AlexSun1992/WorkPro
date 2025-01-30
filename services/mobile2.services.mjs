import axios from "axios";
import clientOs from "../utils/clientOs/clientOs.mjs";
import { OS_TYPES, WEBVIEW_TYPES } from "../utils/clientOs/clientOsConstants.mjs";

export const mobile2Service = (url) => {
  const instance = axios.create({});
  instance.defaults.timeout = 60000;
  instance.defaults.timeoutErrorMessage = "Запрос выполняется больше 60 секунд";
  instance.defaults.baseURL =
    url || process.env.MOBILE2_URL || "https://lk.reso.ru";
  instance.defaults.headers.common["X-Application"] = WEBVIEW_TYPES.VueJS;
  instance.defaults.headers.common["X-DEV"] = OS_TYPES.default;

  instance.interceptors.request.use(config => {
    return clientOs.updateMobileViewConfig(config);
  });

  instance.interceptors.response.use(response => {
    return response;
  }, (err) => {
    return err;
  });

  return instance;
};
