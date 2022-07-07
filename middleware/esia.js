export default function ({ route, redirect, $axios, $cookiz }) {
  const url = `/am/free/v2/data/55/801/0/0?code=${route.query?.code}`;
  return $axios
    .get(url)
    .then((res) => {
      const data = res.data[0]._data[0];
      $cookiz.set("auth._token.local", data.ACCESS_TOKEN);
      $cookiz.set("auth._refresh_token.local", data.REFRESH_TOKEN);
      return redirect("/cabinet");
    })
    .catch((error) => {
      console.error(error);
      return redirect("/login");
    });
}
