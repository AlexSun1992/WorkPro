export default async function ({ $auth, redirect }) {
  if ($auth.loggedIn) {
    const getToken = await $auth.refreshTokens();
    const { ACCESS_TOKEN } = getToken.data;
    const url = `https://testtelemed.reso.ru/DMSResoRu/reso_iframe?token=${ACCESS_TOKEN}`;
    return redirect(`${url}`);
  }
  return redirect("https://testtelemed.reso.ru/DMSResoRu");
}

