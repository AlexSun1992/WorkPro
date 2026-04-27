import axios from "axios";
import clientOs from "../utils/clientOs/clientOs";
import { OS_TYPES, WEBVIEW_TYPES } from "../utils/clientOs/clientOsConstants";

export const mobile2Service = (url) => {
  const instance = axios.create({});
  instance.defaults.timeout = 60000;
  instance.defaults.timeoutErrorMessage = "Запрос выполняется больше 60 секунд";
  instance.defaults.baseURL = url || process.env.MOBILE2_URL || "https://lk.reso.ru";
  instance.defaults.headers.common["X-Application"] = WEBVIEW_TYPES.VueJS;
  instance.defaults.headers.common["X-DEV"] = OS_TYPES.default;

  const isDev = process.env.NODE_ENV === 'development';
  const useFiddler = process.env.USE_FIDDLER === 'true';

  if (isDev && useFiddler) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    // eslint-disable-next-line global-require
    const agent = new (require('https-proxy-agent'))(process.env.FIDDLER_URL, {
      rejectUnauthorized: false
    })

    instance.defaults.httpsAgent = agent
    instance.defaults.proxy = false
  }

  instance.interceptors.request.use((config) => clientOs.updateMobileViewConfig(config));

  return instance;
};
