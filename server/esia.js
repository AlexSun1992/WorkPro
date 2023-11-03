import { getErrorMessage } from "../plugins/auth/toast.helper";

/** Режим авторизации с установкой ref */
function authQuery(req, res) {
  const esiaAuthUrl = "https://client.reso.ru/loginesia/loginesia/prod";
  const refererHeaderUrl = new URL(req.get("referer"), "https://f.f");
  const defaultRefUrl = `${refererHeaderUrl.pathname}${refererHeaderUrl.search}`;
  const defaultSuccessUrl = req.get("referer") ? defaultRefUrl : "/cabinet";
  const defaultErrorUrl = req.get("referer") ? defaultRefUrl : "/login";

  const succesUrl = "ref" in req.query ? req.query.ref : defaultSuccessUrl;
  const errorUrl =
    "referror" in req.query ? req.query.referror : defaultErrorUrl;

  res.cookie("ref", succesUrl);
  res.cookie("referror", errorUrl);

  res.send(`
  <script type="text/javascript">
    window.location = "${esiaAuthUrl}"
  </script>
  `);
}

export default function redirectFromEsia(req, res) {
  if ("auth" in req.query) {
    authQuery(req, res);
    return;
  }

  const cookieRef = req.cookies.ref;
  const cookieRefError = req.cookies.referror;
  if (cookieRef) {
    res.clearCookie("ref");
  }
  if (cookieRefError) {
    res.clearCookie("referror");
  }

  const successUrl = new URL(cookieRef || "/cabinet", "https://f.f");
  const errorUrl = new URL(cookieRefError || "/login", "https://f.f");
  errorUrl.searchParams.set(
    "error",
    "Произошла неизвестная ошибка входа через Госуслуги."
  );

  if (req.query?.code === undefined) {
    res.redirect(`${errorUrl.pathname}${errorUrl.search}`);
    return;
  }

  const getEsiaDataUrl = `http://localhost:8000/am/free/v2/datacard/55/801`;
  fetch(getEsiaDataUrl, {
    method: "POST",
    body: JSON.stringify({ code: req.query?.code }),
    headers: {
      "content-type": "application/json",
    },
  })
    .then(async (response) => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.status === 200) {
          console.log(
            `Успешная авторизация через Госуслуги ${Object.keys(data[0])}`
          );
          return data;
        }
        if (data.MESSAGE) {
          errorUrl.searchParams.set("error", getErrorMessage(data.MESSAGE));
        }
        throw new Error(JSON.stringify(data));
      }
      const text = await response.text();
      throw new Error(text);
    })
    .then(([data]) => {
      res.cookie("auth._token.local", `Bearer ${data.ACCESS_TOKEN}`);
      res.cookie("auth._refresh_token.local", data.REFRESH_TOKEN);

      res.redirect(`${successUrl.pathname}${successUrl.search}`);
    })
    .catch((error) => {
      console.error("Ошибка авторизации через Госуслуги", error);
      res.redirect(`${errorUrl.pathname}${errorUrl.search}`);
    });
}
