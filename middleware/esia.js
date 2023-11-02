import { getErrorMessage } from "../plugins/auth/toast.helper";

export default function redirectFromEsia(params) {
  const {
    route,
    redirect,
    $axios,
    $cookiz,
    req: { headers },
  } = params;
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

  // Режим авторизации с установкой ref
  if ("auth" in route.query) {
    const esiaAuthUrl = "https://client.reso.ru/loginesia/loginesia/prod";
    const hasCookieRef = Boolean(cookieRef);

    if ("ref" in route.query) {
      $cookiz.set("ref", route.query.ref);
    } else if (!hasCookieRef) {
      const refUrl = new URL(headers.referer, "https://f.f");
      $cookiz.set("ref", refUrl.pathname);
    }
    if ("referror" in route.query) {
      $cookiz.set("referror", route.query.ref);
    }
    return redirect(esiaAuthUrl);
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
