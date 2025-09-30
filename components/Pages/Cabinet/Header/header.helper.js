import Cookies from "js-cookie";

export function getZone() {
  const isAuth = Cookies.get("auth._token.local");

  return isAuth && isAuth !== "false" ? "main" : "free";
}
