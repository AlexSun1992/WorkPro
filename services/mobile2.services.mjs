import axios from "axios";
import clientOs from "../utils/clientOs/clientOs.mjs";
import Cookies from "js-cookie";

export const mobile2Service = (url) => {
  const instance = axios.create({});
  instance.defaults.timeout = 60000;
  instance.defaults.timeoutErrorMessage = "Запрос выполняется больше 60 секунд";
  instance.defaults.baseURL =
    url || process.env.MOBILE2_URL || "https://lk.reso.ru";
  instance.defaults.headers.common["X-Application"] = "VueJS";
//  instance.defaults.headers.common["X-OS"] = "";
  instance.defaults.headers.common["X-DEV"] = "";

  instance.interceptors.request.use(config => {
    const webviewData = clientOs.getWebviewData(config);
    const newConfig = Object.assign({}, config);

    newConfig.headers["X-DEV"] = webviewData.platform;
    newConfig.headers.common["X-DEV"] = webviewData.platform;
    newConfig.headers["X-Application"] = webviewData.webview;
    newConfig.headers.common["X-Application"] = webviewData.webview;
    /*newConfig.headers["X-OS"] = webviewData.isWebview;
    newConfig.headers.common["X-OS"] = webviewData.isWebview;*/

    return newConfig;
  });

  instance.interceptors.response.use(response => {
    return response;
  }, (err) => {
    return err;
  });

  return instance;
};
