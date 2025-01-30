import clientOsData from "./clientOsData.mjs";
import clientOsPlatforms from "./clientOsPlatforms.mjs";
import { OS_TYPES, WEBVIEW_TYPES } from "./clientOsConstants.mjs";

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
    const result = { platform: OS_TYPES.default, webview: WEBVIEW_TYPES.VueJS };
    const isWebview = this.isWebview(cookies);

    result.webview = this.getWebview(isWebview);
    result.platform = this.getMobilePlatform(userAgent, isWebview);

    return result;
  },
  /**
   *
   * @param userAgent {string} - либо передать вызов метода clientOs.getPlatform() который должен быть выполнент на клиенте
   * @param isWebview {boolean}
   * @returns {Number}
   */
  getMobilePlatform(userAgent, isWebview) {
    const platformOs = this.getOsInfo(userAgent);

    if (platformOs) {
      return this.getOsPlatform(platformOs, isWebview);
    }

    return OS_TYPES.default;
  },

  getOsPlatform(platformOs, isWebview) {
    if (!platformOs) {
      return OS_TYPES.default;
    }
    if (clientOsPlatforms.android.includes(platformOs)) {
      return isWebview ? OS_TYPES.webviewAndroid : OS_TYPES.android;
    }
    if (clientOsPlatforms.ios.includes(platformOs)) {
      return isWebview ? OS_TYPES.webviewIos : OS_TYPES.ios;
    }
    return OS_TYPES.web;
  },
  getWebview(isWebview) {
    return isWebview ? WEBVIEW_TYPES.isWebview : WEBVIEW_TYPES.VueJS;
  },
  getOsInfo(userAgent = "") {
    const currentOs = clientOsData.find(item => userAgent.search(item.regex) >= 0);

    return currentOs?.name ?? "";
  },

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
