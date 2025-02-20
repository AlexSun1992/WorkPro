import clientOsData from "./clientOsData.mjs";
import clientOsPlatforms from "./clientOsPlatforms.mjs";
import { OS_TYPES, WEBVIEW_TYPES } from "./clientOsConstants.mjs";

export default {
  updateMobileViewConfig(config) {
    const cookies = config?.headers.common.Cookie ?? "";
    const newConfig = { ...config };

    newConfig.headers["X-Application"] = this.getWebview(cookies);

    return newConfig;
  },

  getWebview(cookies) {
    const isWebview = this.isWebview(cookies);

    return isWebview ? this.getWebviewApp(cookies) : WEBVIEW_TYPES.VueJS;
  },

  isWebview(cookies = "") {
    const partsOfCookies = Boolean(cookies) ? cookies.split("; ") : null;

    if (partsOfCookies) {
      return partsOfCookies.some(item => {
        return item.split("=")[0] === "isWebview";
      });
    }

    return false;
  },

  getWebviewApp(cookies) {
    const app = {
        "app=rm1": WEBVIEW_TYPES.RM1,
        "app=rm2": WEBVIEW_TYPES.RM2
      };
    const versions = Object.keys(app);
    const cookiesLower = cookies.toLowerCase().replace(" ", "");
    const currentVersion = versions.find(item => {
      const reg = new RegExp(`\\b${item}\\b`, 'gi');

      return reg.test(cookiesLower);
    });

    return currentVersion ? app[currentVersion] : WEBVIEW_TYPES.isWebview;
  }
}
