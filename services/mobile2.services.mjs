import axios from "axios";
import clientOs from "../utils/clientOs/clientOs.mjs";

export const mobile2Service = (url) => {
  const instance = axios.create({});
  instance.defaults.timeout = 60000;
  instance.defaults.timeoutErrorMessage = "Запрос выполняется больше 60 секунд";
  instance.defaults.baseURL =
    url || process.env.MOBILE2_URL || "https://lk.reso.ru";
  instance.defaults.headers.common["X-Application"] = "VueJS";
  instance.defaults.headers.common["X-OS"] = "";
  instance.defaults.headers.common["X-DEV"] = "";

  instance.interceptors.request.use(config => {
    const newConfig = Object.assign({}, config);
    const userAgent = newConfig.headers.common["user-agent"];

    if (Boolean(userAgent)) {
      const platform = clientOs.getMobilePlatform(userAgent);

      newConfig.headers["X-DEV"] = platform.platform;
      newConfig.headers.common["X-DEV"] = platform.platform;
      newConfig.headers["X-OS"] = platform.isWebview;
      newConfig.headers.common["X-OS"] = platform.isWebview;
    }

    return newConfig;
  });

  instance.interceptors.response.use(response => {
    return response;
  }, (err) => {
    return err;
  });

  return instance;
};
