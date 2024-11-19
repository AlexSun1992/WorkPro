/**
 * Есть navigator.platform но это деприкатед и работает как-то специфически
 *
 */

const defaultPlatform = 'VueJs';

function getFromUserAgentData() {
  const userAgent = navigator?.userAgentData;

  return userAgent?.platform ?? defaultPlatform;
}

function getFromUserAgent() {
  const platform = navigator?.userAgent;

  return platform ?? defaultPlatform;
}

export const clientOS = {
  getPlatform() {
    const getters = [ getFromUserAgentData, getFromUserAgent ];

    for (const item of getters) {
      const val = item();

      if (val !== defaultPlatform) {
        return val;
      }
    }

    return defaultPlatform;
  },

  getDefaultPlatform() {
    return defaultPlatform;
  },

  getMobilePlatform() {
    const mainPlatforms = { "Android": [ "Android" ], "IOS": [ "iPad", "iPhone", "Macintosh" ] };
    const platform = clientOS.getPlatform();

    for (const [ key, values ] of Object.entries(mainPlatforms)) {
      const variant = values.find(item => platform.toLowerCase().includes(item.toLowerCase()));

      if (variant) {
        return key;
      }
    }

    return defaultPlatform;
  }
}
