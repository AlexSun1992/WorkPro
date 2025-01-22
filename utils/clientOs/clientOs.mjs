import DeviceDetector from "device-detector-js";

export const clientOs = {
  deviceDetector: new DeviceDetector(),
  /**
   *
   * @param userAgent {string} - либо передать вызов метода clientOs.getPlatform() который должен быть выполнент на клиенте
   * @returns {string}
   */
  isWebview: null,
  platformData: null,
  getMobilePlatform(userAgent) {
    const mobilePlatforms = ["smartphone", "tablet", "phablet", "feature phone"]
    const result = { isWebview: false, platform: -1 };
    const platformData = this.deviceDetector.parse(userAgent);
    const platformOs = platformData.os?.name;

    if (Boolean(platformData?.client)) {
      result.isWebview = mobilePlatforms.includes(platformData.device?.type.toLowerCase()) ? "isWebview" : "";
      result.platform = result.isWebview ? this.getOsPlatform(platformOs) : "";
    }

    return result;
  },

  getOsPlatform(platformOs) {
    if (Boolean(platformOs) === false) {
      return -1;
    }
    // 7 - IOS; 8 - Android
    return platformOs.toLowerCase() === "ios" ? 7 : 8;
  }
}
