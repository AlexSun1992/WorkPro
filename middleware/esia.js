import { getErrorMessage } from "../plugins/auth/toast.helper";

export default function redirectFromEsia({ route, redirect, $axios, $cookiz }) {
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

  const url = `/am/free/v2/datacard/55/801`;
  if (route.query?.code === undefined) {
    return redirect(`${errorUrl.pathname}${errorUrl.search}`);
  }
  return $axios
    .post(url, { code: route.query?.code })
    .then((res) => {
      const data = res.data[0];
      $cookiz.set("auth._token.local", data.ACCESS_TOKEN);
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
