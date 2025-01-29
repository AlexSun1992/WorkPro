import clientOsData from "./clientOsData.mjs";
import clientOsPlatforms from "./clientOsPlatforms.mjs";
import { OsTypes, WebviewTypes } from "./clientOsConstants.mjs";

export default {
  updateMobileViewConfig(config) {
    const webviewData = this.getWebviewData(config);
    const newConfig = { ...config };

    newConfig.headers["X-DEV"] = webviewData.platform;
    newConfig.headers["X-Application"] = webviewData.webview;

    return newConfig;
  },
  getWebviewData(config) {
    const userAgent = config?.headers.common["user-agent"] ?? "";
    const cookies = config?.headers.common.Cookie ?? "";
    const result = { platform: OsTypes.default, webview: WebviewTypes.VueJS };
    const isWebview = this.isWebview(cookies);

    result.webview = isWebview ? WebviewTypes.isWebview : WebviewTypes.VueJS;
    result.platform = this.getMobilePlatform(userAgent, isWebview);

    return result;
  },
  /**
   *
   * @param userAgent {string} - либо передать вызов метода clientOs.getPlatform() который должен быть выполнент на клиенте
   * @params iwWebview {boolean}
   * @returns {Number}
   */
  getMobilePlatform(userAgent, iwWebview) {
    const platformOs = this.getOsInfo(userAgent);

    if (platformOs) {
      return this.getOsPlatform(platformOs, iwWebview);
    }

    return OsTypes.default;
  },

  getOsPlatform(platformOs, isWebview) {
    // 7 - IOS; 8 - Android
    if (platformOs && clientOsPlatforms.android.includes(platformOs)) {
      return isWebview ? OsTypes.webviewAndroid : OsTypes.android;
    }
    if (platformOs && clientOsPlatforms.ios.includes(platformOs)) {
      return isWebview ? OsTypes.webviewIos : OsTypes.ios;
    }
    return OsTypes.default;
  },

  getOsInfo(userAgent = "") {
    const currentOs = clientOsData.find(item => userAgent.search(item.regex) >= 0);

    return currentOs?.name ?? "";
  }
  ,

  isWebview(cookies = "") {
    const partsOfCookies = Boolean(cookies) ? cookies.split("; ") : null;

    if (partsOfCookies) {
      return partsOfCookies.some(item => {
        return item.split("=")[0] === "isWebview";
      });
    }

    return false;
  }
}
