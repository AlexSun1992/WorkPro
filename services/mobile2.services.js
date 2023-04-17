import axios from "axios";

export const mobile2Service = (url) => {
  const instance = axios.create({});
  instance.defaults.timeout = 15000;
  instance.defaults.timeoutErrorMessage = "Запрос выполняется больше 15 секунд";
  instance.defaults.baseURL =
    url || process.env.MOBILE2_URL || "https://lk.reso.ru";
  instance.defaults.headers.common["X-Application"] = "VueJS";
  return instance;
};
