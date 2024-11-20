import axios from "axios";
import { clientOs } from "../utils/clientOs/clientOs.mjs";

export const mobile2Service = (url) => {
  const instance = axios.create({});
  instance.defaults.timeout = 60000;
  instance.defaults.timeoutErrorMessage = "Запрос выполняется больше 60 секунд";
  instance.defaults.baseURL =
    url || process.env.MOBILE2_URL || "https://lk.reso.ru";
  instance.defaults.headers.common["X-Application"] = "VueJS";

  instance.interceptors.request.use(config => {
    config.headers["x-os"] = clientOs.getMobilePlatform(config.headers["user-agent"]);

    return config;
  });

  return instance;
};
