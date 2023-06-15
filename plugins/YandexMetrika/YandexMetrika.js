/* istanbul ignore file */
import { loadScript, startTracking, getMetrika } from "./heplers";

export default function install(Vue, options = {}) {
  loadScript(() => {
    if (Array.isArray(options)) {
      options.forEach((item) => {
        const metrika = getMetrika(Vue, item);
        startTracking(metrika);
      });
    } else {
      const metrika = getMetrika(Vue, options);
      startTracking(metrika);
    }
  }, options.scriptSrc);
}
