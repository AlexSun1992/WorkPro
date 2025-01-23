import clientOsData from "./clientOsData.mjs";
import clientOsPlatforms from "./clientOsPlatforms.mjs";

export default {
  /**
   *
   * @param userAgent {string} - либо передать вызов метода clientOs.getPlatform() который должен быть выполнент на клиенте
   * @returns {{isWebview: string, platform: string}}
   */
  getMobilePlatform(userAgent) {
    const result = { isWebview: "", platform: "" };
    const platformOs = this.getOsInfo(userAgent);

    if (platformOs) {
      result.platform = this.getOsPlatform(platformOs);
      result.isWebview = this.isWebview(platformOs) ? "isWebview" : "";
    }

    return result;
  },

  getOsPlatform(platformOs) {
    // 7 - IOS; 8 - Android
    if (Boolean(platformOs) && clientOsPlatforms.android.includes(platformOs)) {
      return 8;
    }

    if (Boolean(platformOs) && clientOsPlatforms.ios.includes(platformOs)) {
      return 7;
    }

    return "";
  },

  getOsInfo(userAgent = "") {
    const currentOs = clientOsData.find(item => userAgent.search(item.regex) >= 0);

    return currentOs?.name ?? "";
  },

  isWebview(os) {
    return clientOsPlatforms.android.includes(os) || clientOsPlatforms.ios.includes(os);
  }
}
