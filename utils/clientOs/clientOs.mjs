import clientOsData from "./clientOs.json";
import clientOsPlatforms from "./clientOsPlatforms.json"

export const clientOs = {
  /**
   *
   * @param userAgent {string} - либо передать вызов метода clientOs.getPlatform() который должен быть выполнент на клиенте
   * @returns {{isWebview: string, platform: string}}
   */
  getMobilePlatform(userAgent) {
    const mobilePlatforms = [ "smartphone", "tablet", "phablet", "feature phone" ];
    const result = { isWebview: "", platform: "" };
    // const platformData = this.getOsInfo(userAgent);
    // const platformOs = platformData.os?.name;
    const platformOs = this.getOsInfo(userAgent);
    console.log(`********** PlatformOs ${ platformOs }`);
    if (Boolean(platformOs)) {
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
