export function getAllCaptchas() {
  return Array.from(document.querySelectorAll("body>div")).filter((elem) =>
    elem.querySelector("iframe[title*='reCAPTCHA']")
  );
}

export function getCurrentVisibleCaptcha() {
  return Array.from(document.querySelectorAll("body>div"))
    .filter((elem) => elem.querySelector("iframe[title*='reCAPTCHA']"))
    .filter((item) => item.style.visibility === "visible");
}

export function waitCaptchaBecomesVisible() {
  const nodeElem = document.querySelector("body");
  const config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  };
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const [currentCaptcha] = getCurrentVisibleCaptcha();
      if (currentCaptcha !== undefined) {
        resolve(currentCaptcha);
        observer.disconnect();
      }
    });
    observer.observe(nodeElem, config);
  });
}

export async function isCaptchaBecomesHide() {
  const getInfoAboutCaptchaVisibility = await waitCaptchaBecomesVisible();
  const checkVisibleCaptchaConfig = { attributes: true };
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (getInfoAboutCaptchaVisibility.style.visibility === "hidden") {
        resolve();
        observer.disconnect();
      }
    });
    observer.observe(getInfoAboutCaptchaVisibility, checkVisibleCaptchaConfig);
  });
}
