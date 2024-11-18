const defaultPlatform = 'unknown';

function getFromUserAgentData() {
  const userAgent = navigator?.userAgentData

  return userAgent?.platform ? navigator.platform : defaultPlatform;
}

function getFromPlatform() {
  const platform = navigator?.platform;

  return platform ?? defaultPlatform;
}

export const clientOS = {
  getPlatform() {
    const getters = [ getFromUserAgentData, getFromPlatform ];

    for (const item of getters) {
      const val = item();

      if (val !== defaultPlatform) {
        return val;
      }
    }

    return defaultPlatform;
  },

  getMobilePlatform() {
    const mainPlatforms = { "Android": [ "Android" ], "IOS": [ "iPad", "iPhone" ] };
    const platform = clientOS.getPlatform();

    for (const [ key, values ] of Object.entries(mainPlatforms)) {
      const variant = values.find(item => item.toLowerCase().includes(platform.toLowerCase()));

      if (variant) {
        return key;
      }
    }

    return "";
  }
}
