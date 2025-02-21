import { WEBVIEW_TYPES } from "./clientOsConstants.mjs";

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

  processCookies(cookies) {
    return cookies.toLowerCase().replace(" ", "");
  },

  findCurrentVersion(cookiesLower, app) {
    const versions = Object.keys(app);

    return versions.find(item => {
      const reg = new RegExp(`\\b${item}\\b`, 'gi');
      return reg.test(cookiesLower);
    });
  },

  getWebviewApp(cookies) {
    const app = {
      "app=rm1": WEBVIEW_TYPES.RM1,
      "app=rm2": WEBVIEW_TYPES.RM2
    };
    const cookiesLower = this.processCookies(cookies);
    const currentVersion = this.findCurrentVersion(cookiesLower, app);

    return currentVersion ? app[currentVersion] : WEBVIEW_TYPES.isWebview;
  }
}
