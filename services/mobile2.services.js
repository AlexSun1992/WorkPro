import axios from "axios";

export const mobile2Service = (url) => {
  const instance = axios.create({});
  instance.defaults.baseURL =
    url || process.env.MOBILE2_URL || "https://mobile2.reso.ru";
  instance.defaults.headers.common["X-Application"] = "VueJS";
  return instance;
};
