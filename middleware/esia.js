import { getErrorMessage } from "../plugins/auth/toast.helper";

export default function ({ route, redirect, $axios, $cookiz }) {
  const url = `/am/free/v2/datacard/55/801`;
  if (route.query?.code === undefined) {
    return redirect(
      `/login?error=Произошла неизвестная ошибка входа через Госуслуги.`
    );
  }
  return $axios
    .post(url, { code: route.query?.code })
    .then((res) => {
      const data = res.data[0];
      $cookiz.set("auth._token.local", data.ACCESS_TOKEN);
      $cookiz.set("auth._refresh_token.local", data.REFRESH_TOKEN);

      const ref = $cookiz.get("ref");
      if (ref) {
        $cookiz.remove("ref");
        return redirect(ref);
      }
      return redirect("/cabinet");
    })
    .catch((error) =>
      redirect(
        `/login?error=${
          error?.response?.data?.MESSAGE
            ? getErrorMessage(error.response?.data?.MESSAGE)
            : error
        }`
      )
    );
}
