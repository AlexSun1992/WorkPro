const ROUTES = {
  LINK_EXPIRED: "/tech/link-expired/",
  SMS_CONFIRM: "/login/sms-confirm",
  DEFAULT_REDIRECT: "/",
};

const SMS_COOKIE = {
  NAME: "sms_hash",
  TTL_SECONDS: 60 * 5, // 5 минут
};

const AUTH_COOKIES = {
  ACCESS: "auth._token.local",
  REFRESH: "auth._refresh_token.local",
};

async function fetchShortLinkPayload($axios, hash, accessToken = '') {
  const url = "/am/free/v2/redirectShortLink";
  const response = await $axios.post(url, { hash, accessToken });

  if (!response || typeof response !== "object") {
    throw new Error("Пустой ответ от redirectShortLink");
  }

  const raw = response.data;
  const data = Array.isArray(raw) ? raw[0] : raw;

  if (!data || typeof data !== "object") {
    throw new Error("Некорректный формат данных redirectShortLink");
  }

  return data;
}

function isAuthPayload(data) {
  const access = data?.ACCESS_TOKEN;
  const refresh = data?.REFRESH_TOKEN;

  return Boolean(access && refresh);
}

function handleAuthSuccess({ data, $cookiz, redirect }) {
  const accessToken = data.ACCESS_TOKEN;
  const refreshToken = data.REFRESH_TOKEN;
  const redirectUrl = data.REDIRECT_URL || ROUTES.DEFAULT_REDIRECT;

  $cookiz.set(AUTH_COOKIES.ACCESS, `Bearer ${accessToken}`);
  $cookiz.set(AUTH_COOKIES.REFRESH, refreshToken);

  redirect(redirectUrl);
}

function startSmsFlow({ hash, $cookiz, redirect }) {
  const maxAge = SMS_COOKIE.TTL_SECONDS;

  $cookiz.set(SMS_COOKIE.NAME, hash, {
    path: "/",
    maxAge,
    sameSite: "lax",
  });

  redirect(ROUTES.SMS_CONFIRM);
}

function logShortLinkError(error) {
  const info = error?.response?.data?.INFO;

  if (info) {
    console.error(`Ошибка shortLink: ${info}`);
    return;
  }

  console.error("Ошибка shortLink:", error);
}

export default async function redirectShortLink(context) {
  const { route, redirect, $axios, $cookiz } = context;

  const hash = route?.params?.hash;

  const accessToken = $cookiz.getAll()['auth._token.local'] ? $cookiz.getAll()['auth._token.local'].split(' ')[1] : ''

  if (!hash) {
    // Нет hash в URL → нечего резолвить
    return redirect(ROUTES.LINK_EXPIRED);
  }

  try {
    const data = await fetchShortLinkPayload($axios, hash, accessToken);

    if (isAuthPayload(data)) {
      handleAuthSuccess({ data, $cookiz, redirect });
      return;
    }

    startSmsFlow({ hash, $cookiz, redirect });
  } catch (error) {
    logShortLinkError(error);
    redirect(ROUTES.LINK_EXPIRED);
  }
}
