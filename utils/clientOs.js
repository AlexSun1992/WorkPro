const defaultPlatfrm = 'unknown';

function getFromNavigation() {
  const userAgent = navigator?.userAgentData

  return userAgent?.platform ? navigator.platform : defaultPlatfrm;
}

export const clientOS = {
  get() {
    const getters = [getFromNavigation]

    for (const item of getters) {
      const val =  item();

      if (val !== defaultPlatfrm) {
        return val;
      }
    }

    return defaultPlatfrm;
  }
}
