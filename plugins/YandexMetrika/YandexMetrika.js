/* istanbul ignore file */
import { loadScript, startTracking, getMetrika } from "./heplers";

export default function install(Vue, options = {}) {
  loadScript(() => {
    const isDev = window?.location?.href.includes("demo.reso.ru", "demo-actuary.reso.ru", "test-new.reso.ru");
    if (isDev) {
      console.info("yandex metrika disabled for dev stands");
      return;
    }
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
