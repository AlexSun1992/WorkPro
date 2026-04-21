export function yandexCaptchaResetDecorator(resetFn, args) {
  if (window.smartCaptcha) {
    const captchaReset = window.smartCaptcha.reset;

    window.smartCaptcha.reset = () => {
      if (typeof resetFn === "function") {
        resetFn(args);
      }

      captchaReset();
    }
  }
}

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();

      return;
    }

    const script = document.createElement("script");

    script.src = src;
    script.defer = true;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`YandexCaptcha loadScript. Не удалось загрузить скрипт: ${src}`));

    document.head.appendChild(script);
  });
}
