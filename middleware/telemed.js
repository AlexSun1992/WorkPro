export default async function ({ $auth, redirect }) {
  const getToken = await $auth.refreshTokens();
  const { ACCESS_TOKEN } = getToken.data;

  const url = `https://telemed.reso.ru/DMSResoRu/reso_iframe?token=${ACCESS_TOKEN}`;

  return redirect(`${url}`);
}
