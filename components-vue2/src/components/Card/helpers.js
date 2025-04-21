import Cookies from "js-cookie";

const TOKEN_NAME = "auth._token.local";

export function getParams(props) {
  const tokenCookies = Cookies.get(TOKEN_NAME);
  const isAuth = tokenCookies && tokenCookies !== "false";

  const getIdCard = () => {
    const queryId = new URLSearchParams(window.location.search).get("ID");
    if (queryId) {
      return queryId;
    }
    if (props.cardId) {
      return props.cardId;
    }
    return "0";
  };
  const getIdRel = () => {
    const queryId = new URLSearchParams(window.location.search).get("REL");
    if (queryId) {
      return queryId;
    }
    if (props.rel) {
      return props.rel;
    }
    return "0";
  };
  const getIdMenu = () => {
    const queryId = new URLSearchParams(window.location.search).get("IDMENU");
    if (queryId) {
      return queryId;
    }
    if (props.menuId) {
      return props.menuId;
    }
    return "0";
  };
  const getIdWizard = () => {
    const queryId = new URLSearchParams(window.location.search).get("IDWIZARD");
    if (queryId) {
      return queryId;
    }
    if (props.wizardId) {
      return props.wizardId;
    }
    return null;
  };

  const params = { idModule: 55 };

  params.idCard = getIdCard();
  params.idItem = getIdMenu();
  params.idRel = getIdRel();

  if (getIdWizard()) {
    params.idWizard = getIdWizard();
  }

  if (params.idItem !== 777) {
    params.cache = false;
  }
  params.zone = "free";
  if (isAuth) {
    params.zone = "token";
  }
  return params;
}
export function setURLParams(params) {
  const { ID, IDWIZARD, IDCARD, REL } = params;
  const url = new URL(window.location.href);
  url.searchParams.delete("error");
  if (ID) {
    url.searchParams.set("ID", ID);
  }
  if (IDWIZARD) {
    url.searchParams.set("IDWIZARD", IDWIZARD);
    url.searchParams.delete("REL");
  }
  if (IDCARD) {
    url.searchParams.set("IDMENU", IDCARD);
  }
  if (REL && !IDWIZARD) {
    url.searchParams.set("REL", REL);
  }
  window.history.replaceState(null, null, url);
}
export function saveCookies(accessToken, refreshToken) {
  Cookies.set("auth._token.local", `Bearer ${accessToken}`, {
    expires: 1 / 24,
  });
  Cookies.set("auth._refresh_token.local", refreshToken, { expires: 365 });
  Cookies.set("auth._token_expiration.local", Date.now() + 100000);
}
