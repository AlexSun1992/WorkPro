export function extractPoutvalue(response) {
  if (Object.prototype.hasOwnProperty.call(response, "data")) {
    if (Array.isArray(response.data)) {
      const getPoutvalue = response.data.find((item) => item.POUTVALUE);
      const poutValue = getPoutvalue || null;

      if (poutValue) {
        return poutValue.POUTVALUE;
      }
      return poutValue;
    }
  }
  if (typeof response === "object") {
    if (Object.prototype.hasOwnProperty.call(response, "POUTVALUE")) {
      return response.POUTVALUE;
    }
  }
  return null;
}

export function isCabinetUrl(str) {
  return str.startsWith("/cabinet");
}

export function isCorrectUrl(poutvalue) {
  try {
    const _ = new URL(poutvalue);
    return true;
  } catch {
    return false;
  }
}

export function fetchPoutvalue(response, options) {
  const poutvalue = extractPoutvalue(response);

  if (!poutvalue) {
    return;
  }

  if (isCabinetUrl(poutvalue) && !options.isInNewWindow) {
    options.router.push(poutvalue);
    return;
  }

  if (isCorrectUrl(poutvalue) || isCabinetUrl(poutvalue)) {
    const typeTab = options.isInNewWindow ? "_blank" : "_self";

    setTimeout(() => {
      window.open(poutvalue, typeTab);
    });
    return;
  }

  options.toaster.toast(poutvalue, {
    title: "",
    variant: "success",
    solid: true,
    autoHideDelay: 5000,
    toaster: "b-toaster-top-full",
  });
}
