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

export const clientOs = {
  getPlatform() {
    const getters = [ getFromUserAgentData, getFromUserAgent ];

    try {
      for (const item of getters) {
        const val = item();

        if (val && val !== defaultPlatform) {
          return val;
        }
      }
    } catch (err) {
      console.log(err);

      return defaultPlatform;
    }

    return defaultPlatform;
  },

  getDefaultPlatform() {
    return defaultPlatform;
  },

  /**
   *
   * @param userAgent {string} - либо передать вызов метода clientOs.getPlatform() который должен быть выполнент на клиенте
   * @returns {string}
   */
  getMobilePlatform(userAgent) {
    const mainPlatforms = { "Android": [ "Android" ], "IOS": [ "iPad", "iPhone", "Macintosh" ] };
    const platform = userAgent ?? "";

    for (const [ key, values ] of Object.entries(mainPlatforms)) {
      const variant = values.find(item => platform.toLowerCase().includes(item.toLowerCase()));

      if (variant) {
        return key;
      }
    }

    return defaultPlatform;
  }
}
