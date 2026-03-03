export default async function dms({ $auth, redirect }) {
  if ($auth.loggedIn) {
    const getToken = await $auth.refreshTokens();
    const { ACCESS_TOKEN } = getToken.data;
    const url = `https://telemed.reso.ru/DMSResoRu/login?token=${ACCESS_TOKEN}`;
    return redirect(`${url}`);
  }
  return redirect("https://telemed.reso.ru/DMSResoRu");
}
