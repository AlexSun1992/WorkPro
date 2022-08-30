import axios from "axios";

export const mobile2Service = (url) => {
  const instance = axios.create({});
  instance.defaults.timeout = 30000;
  instance.defaults.timeoutErrorMessage = "Запрос выполняется больше 30 секунд";
  instance.defaults.baseURL =
    url || process.env.MOBILE2_URL || "https://mobile2.reso.ru";
  instance.defaults.headers.common["X-Application"] = "VueJS";
  return instance;
};
