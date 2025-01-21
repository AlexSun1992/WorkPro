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
    const result = { isWebview: false, platform: "" };
    const platformData = this.deviceDetector.parse(userAgent);
    const platformOs = platformData?.brand;

    if (platformData) {
      result.isWebview = platformData.device.type.toLowerCase() !== "desktop";
      result.platform = this.getOsPlatform(platformOs);
    }

    return result;
  },

  getOsPlatform(platformOs) {
    if (Boolean(platformOs) === false) {
      return -1;
    }

    return platformOs.toLowerCase() === "apple" ? 7 : 8;
  }
}
