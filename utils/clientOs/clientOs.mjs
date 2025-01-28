import clientOsData from "./clientOsData.mjs";
import clientOsPlatforms from "./clientOsPlatforms.mjs";
import { OsTypes, WebviewTypes } from "./clientOsConstants.mjs";

export default {
  getWebviewData(config) {
    const newConfig = Object.assign({}, config);
    const userAgent = newConfig.headers.common["user-agent"];
    const cookies = newConfig.headers.common.Cookie;
    const result = { platform: OsTypes.default, webview: WebviewTypes.VueJS };

    result.platform = this.getMobilePlatform(userAgent);
    result.webview = this.isWebview(cookies) ? WebviewTypes.isWebview : WebviewTypes.VueJS;

    return result;
  },
  /**
   *
   * @param userAgent {string} - либо передать вызов метода clientOs.getPlatform() который должен быть выполнент на клиенте
   * @returns {Number}
   */
  getMobilePlatform(userAgent) {
    const platformOs = this.getOsInfo(userAgent);

    if (platformOs) {
      return this.getOsPlatform(platformOs);
    }

    return OsTypes.default;
  },

  getOsPlatform(platformOs) {
    // 7 - IOS; 8 - Android
    if (Boolean(platformOs) && clientOsPlatforms.android.includes(platformOs)) {
      return OsTypes.android;
    }

    if (Boolean(platformOs) && clientOsPlatforms.ios.includes(platformOs)) {
      return OsTypes.ios;
    }

    return OsTypes.default;
  },

  getOsInfo(userAgent = "") {
    const currentOs = clientOsData.find(item => userAgent.search(item.regex) >= 0);

    return currentOs?.name ?? "";
  },

  isWebview(cookies = "") {
    return cookies.includes("isWebview=");
    // return clientOsPlatforms.android.includes(os) || clientOsPlatforms.ios.includes(os);
  }
}
