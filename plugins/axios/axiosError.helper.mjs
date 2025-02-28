import { ALLOW_HOST_NAMES, REJECT_HOST_NAMES, CLIENT_IP_ADDRESS } from "./axiosHelperErrorConstants.mjs";

export const axiosErrorHelper = {
  getErrorMessage(err) {
    const newError = {};
    const arr = Object.entries(err.response.data);

    if (axiosErrorHelper.isDevMod(err.request)) {
      arr.forEach((item) => {
        newError[item[0].toLocaleLowerCase()] = item[1];
      });

      newError.method = err.config.url;
      newError.baseURL = process.env.MOBILE_URL;
    }

    if (!newError.status) {
      newError.status = err.response?.data?.STATUS ?? "Что-то пошло не так 😪";
    }

    return newError;
  },
  isDevMod(req) {
    const ip = req.socket.remoteAddress || req.connection.remoteAddress;
    const hostName = process.env.MOBILE_URL;

    return this.isClientValid(ip, hostName);
  },

  isClientValid(ip, hostName) {
    return this.isIpAddressValid(ip) && this.checkAllowedHostnames(hostName);
  },

  isIpAddressValid(ip) {
    return CLIENT_IP_ADDRESS.some((item) => this.compareIpAddresses(ip, item));
  },

  /**+
   *
   * @param currentIp {String} - Ip который нужно проверить на соответствие шаблону
   * @param templateIp {String} - Шаблон для сравнения. Предусмотрена значение * для замены любого значения
   * @return {boolean}
   */
  compareIpAddresses(currentIp = "", templateIp = "") {
    const partsOfTemplate = templateIp?.split(".");
    const partsOfIP = currentIp?.split(".");
    let i = 0;

    if (!partsOfIP || !partsOfTemplate) {
      return false;
    }

    while (i < 4) {
      const templatePart = partsOfTemplate[i];
      const ipPart = partsOfIP[i];

      i += 1;

      if (templatePart === "*") {
        break;
      }

      if (templatePart !== ipPart) {
        return false;
      }
    }

    return true;
  },

  checkRejectedHostnames(hostname) {
    if (!hostname) {
      return false;
    }

    return !REJECT_HOST_NAMES.includes(hostname);
  },

  checkAllowedHostnames(hostname) {
    if (!hostname) {
      return false;
    }

    return ALLOW_HOST_NAMES.includes(hostname);
  },
};
