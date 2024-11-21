import axios from "axios";
import { clientOs } from "../utils/clientOs/clientOs.mjs";

export const mobile2Service = (url) => {
  const instance = axios.create({});
  instance.defaults.timeout = 60000;
  instance.defaults.timeoutErrorMessage = "Запрос выполняется больше 60 секунд";
  instance.defaults.baseURL =
    url || process.env.MOBILE2_URL || "https://lk.reso.ru";
  instance.defaults.headers.common["X-Application"] = "VueJS";
  instance.defaults.headers.common["X-Os"] = "VueJS";

  instance.interceptors.request.use(config => {
    const newConfig = Object.assign({}, config);
    const userAgent = newConfig.headers.common["user-agent"];
    let platform;

    if (userAgent) {
      platform = clientOs.getMobilePlatform(userAgent);
      newConfig.headers["X-Os"] = platform;
      newConfig.headers.common["X-Os"] = platform;
    }

    return newConfig;
  });

  instance.interceptors.response.use(response => {
    console.log(response.config);
  });

  return instance;
};
