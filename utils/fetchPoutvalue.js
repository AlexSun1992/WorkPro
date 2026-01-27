function downloadBlob(blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reso.pkpass";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

export function extractPoutvalue(response) {
  if ("data" in response) {
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
    if ("POUTVALUE" in response) {
      return response.POUTVALUE;
    }
  }
  return null;
}

export function isCabinetUrl(str) {
  return str.startsWith("/");
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

  if (poutvalue.includes("/api/walletpass/generate_pass")) {
    fetch(poutvalue)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(`Unable to fetch poutvalue for ${poutvalue}`);
        }
        return res.blob();
      })
      .then((blob) => {
        downloadBlob(blob);
      })
      .catch((e) => {
        console.error(e);
      });
    return;
  }

  if (isCabinetUrl(poutvalue) && !options.isInNewWindow) {
    console.log(options);
    if (options.router) {
      options.router.push(poutvalue);
    } else {
      window.location.replace(poutvalue);
    }
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
