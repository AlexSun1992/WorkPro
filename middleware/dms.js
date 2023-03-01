export default async function ({ $auth, redirect }) {
  const getToken = await $auth.refreshTokens();
  const { ACCESS_TOKEN } = getToken.data;

  const url = `https://testtelemed.reso.ru/DMSResoRu/login?token=${ACCESS_TOKEN}`;

  return redirect(`${url}`);
}
