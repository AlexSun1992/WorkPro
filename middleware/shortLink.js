export default function redirectShortLink({ route, redirect, $axios, $cookiz }) {
  const url = `/am/free/v2/redirectShortLink`;
  if (route.params.hash === undefined) {
    return redirect(`/tech/link-expired/`);
  }
  return $axios
    .post(url, { hash: route.params.hash })
    .then((res) => {
      const data = res.data[0];
      $cookiz.set("auth._token.local", `Bearer ${data.ACCESS_TOKEN}`);
      $cookiz.set("auth._refresh_token.local", data.REFRESH_TOKEN);
      const redirectUrl = data.REDIRECT_URL;
      return redirect(redirectUrl);
    })
    .catch((error) => {
      if (error.response.data.INFO) {
        console.error(`Ошибка shortLink: ${error.response.data.INFO}`);
      }
      if (error.response.data.INFO === undefined) {
        console.error(`Ошибка shortLink: ${error}`);
      }
      redirect(`/tech/link-expired/`);
    });
}
