import Cookies from "js-cookie";

const TOKEN_NAME = "auth._token.local";

export function getParams(props) {
  const tokenStorage = localStorage.getItem(TOKEN_NAME);
  const tokenCookies = Cookies.get(TOKEN_NAME);
  const isAuth =
    tokenStorage &&
    tokenCookies &&
    tokenStorage !== "false" &&
    tokenCookies !== "false";

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
