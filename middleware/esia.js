import { getErrorMessage } from "../plugins/auth/toast.helper";

/** Режим авторизации с установкой ref */
function authQuery(params) {
  const {
    route,
    redirect,
    $cookiz,
    req: { headers },
  } = params;

  const esiaAuthUrl = "https://client.reso.ru/loginesia/loginesia/prod";

  const refererHeaderUrl = new URL(headers.referer, "https://f.f");
  const defaultRefUrl = `${refererHeaderUrl.pathname}${refererHeaderUrl.search}`;
  const defaultSuccessUrl = headers.referer ? defaultRefUrl : "/cabinet";
  const defaultErrorUrl = headers.referer ? defaultRefUrl : "/login";

  const succesUrl = "ref" in route.query ? route.query.ref : defaultSuccessUrl;
  const errorUrl =
    "referror" in route.query ? route.query.referror : defaultErrorUrl;

  $cookiz.set("ref", succesUrl);
  $cookiz.set("referror", errorUrl);
  return redirect(esiaAuthUrl);
}

export default function redirectFromEsia(params) {
  const { route, redirect, $axios, $cookiz } = params;
  const cookieRef = $cookiz.get("ref");
  const cookieRefError = $cookiz.get("referror");
  $cookiz.remove("ref");
  $cookiz.remove("referror");

  const successUrl = new URL(cookieRef || "/cabinet", "https://f.f");
  const errorUrl = new URL(cookieRefError || "/login", "https://f.f");
  errorUrl.searchParams.set(
    "error",
    "Произошла неизвестная ошибка входа через Госуслуги."
  );

  if ("auth" in route.query) {
    return authQuery(params);
  }

  if (route.query?.code === undefined) {
    return redirect(`${errorUrl.pathname}${errorUrl.search}`);
  }

  const getEsiaDataUrl = `/am/free/v2/datacard/55/801`;
  return $axios
    .post(getEsiaDataUrl, { code: route.query?.code })
    .then((res) => {
      const data = res.data[0];
      $cookiz.set("auth._token.local", `Bearer ${data.ACCESS_TOKEN}`);
      $cookiz.set("auth._refresh_token.local", data.REFRESH_TOKEN);

      return redirect(`${successUrl.pathname}${successUrl.search}`);
    })
    .catch((error) => {
      errorUrl.searchParams.set(
        "error",
        error?.response?.data?.MESSAGE
          ? getErrorMessage(error.response?.data?.MESSAGE)
          : error
      );
      redirect(`${errorUrl.pathname}${errorUrl.search}`);
    });
}
