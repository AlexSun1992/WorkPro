import { getErrorMessage } from "../plugins/auth/toast.helper";

const ESIA_AUTH_URL = "https://client.reso.ru/loginesia/loginesia/prod";
const ESIA_DATA_URL = `http://localhost:8000/am/free/v2/datacard/55/801`;
const ALFA_DATA_URL = `http://localhost:8000/am/free/v2/datacard/55/803`;
const SBER_DATA_URL = `http://localhost:8000/am/free/v2/datacard/55/805`;
const MOBILEID_DATA_URL = `http://localhost:8000/am/free/v2/datacard/55/804`;

function getDataUrl(type) {
  if (type === "alfa") {
    return ALFA_DATA_URL;
  }
  if (type === "sberid") {
    return SBER_DATA_URL;
  }
  if (type === "mobileid") {
    return MOBILEID_DATA_URL;
  }
  if (type === "esia") {
    return ESIA_DATA_URL;
  }
  throw new Error(`Не удалось определить url с данными по типу ${type}`);
}

function getAuthUrl(callbackDomain, type) {
  if (!type || type === "esia") {
    return ESIA_AUTH_URL;
  }
  const dataUrl = getDataUrl(type).replace("datacard", "data");
  return fetch(`${dataUrl}/0/0`, {
    headers: {
      Referer: callbackDomain,
    },
  })
    .then(async (response) => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.status === 200) {
          console.log(`Успешное получение адреса для  ${Object.keys(data[0])}`);
          return data;
        }
        throw new Error(JSON.stringify(data));
      }
      const text = await response.text();

      throw new Error(text);
    })
    .then(([data]) => {
      const link = data._data[0].SLINK;
      return link;
    });
}

/**
 * Режим авторизации с установкой ref
 * Примеры вызова
 * http://localhost:8000/sso?auth&type=alfa
 * http://localhost:8000/sso?auth&type=esia
 * http://localhost:8000/sso?auth&type=sberid
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").Request} req
 */
async function authQuery(req, res) {
  const refererHeaderUrl = new URL(req.get("referer"), "https://f.f");
  const refererDomain = new URL(req.headers.referer || "https://reso.ru");
  const defaultRefUrl = `${refererHeaderUrl.pathname}${refererHeaderUrl.search}`;
  const defaultSuccessUrl = req.get("referer") ? defaultRefUrl : "/cabinet";
  const defaultErrorUrl = req.get("referer") ? defaultRefUrl : "/login";

  const succesUrl = "ref" in req.query ? req.query.ref : defaultSuccessUrl;
  const errorUrl =
    "referror" in req.query ? req.query.referror : defaultErrorUrl;

  res.cookie("ref", succesUrl);
  res.cookie("referror", errorUrl);

  const authUrl = await getAuthUrl(refererDomain.origin, req.query?.type);

  res.send(`
  <script type="text/javascript">
  window.location = "${authUrl}"
  </script>
  `);
}

/**
 * @param {import("express").Request} req
 */
function getAuthType(req) {
  let authType = "";
  if ("code" in req.query) {
    authType = "esia";
  }
  if ("type" in req.query) {
    authType = req.query.type;
  }
  if (authType) {
    console.log(new Date(), `Определён тип авторизации: ${authType}`);
    return authType;
  }
  console.error(new Date(), `Не удалось определить тип авторизации`);
  return authType;
}

function getAuthName(authType) {
  if (authType === "alfa") {
    return "AlfaID";
  }
  if (authType === "sberid") {
    return "SberID";
  }
  if (authType === "esia") {
    return "Госуслуги";
  }
  if (authType === "mobileid") {
    return "MobileID";
  }
  return "неизвестный тип авторизации";
}

function getAuthBody(authType, req, url) {
  if (req.query) {
    if (authType === "esia") {
      if (req.query.code) {
        if (url.searchParams.get("ID")) {
          return { code: req.query.code, ID: url.searchParams.get("ID") };
        }
        return { code: req.query.code };
      }
    }

    if (authType === "mobileid") {
      if (req.query.state && req.query.passport) {
        return { state: req.query.state, passport: req.query.passport };
      }
      if (req.query.state) {
        return { state: req.query.state };
      }
    }

    if (authType === "alfa" || authType === "sberid") {
      if (req.query.state) {
        return { state: req.query.state };
      }
    }
  }

  throw new Error(`Не удалось сформировать данные для body: ${req.url}`);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function redirectFromEsia(req, res) {
  if ("auth" in req.query) {
    await authQuery(req, res);
    return;
  }

  const authType = getAuthType(req);
  const authName = getAuthName(authType);
  const cookieRef = req.cookies.ref;
  const cookieRefError = req.cookies.referror;
  const { hostname } = req;
  if (cookieRef) {
    res.clearCookie("ref");
  }
  if (cookieRefError) {
    res.clearCookie("referror");
    if ("error" in req.query) {
      console.error(
        new Date(),
        `Ошибка: ${req.query.error}, ${req.query.state}`
      );
    }
  }

  const successUrl = new URL(cookieRef || "/cabinet", "https://f.f");
  const errorUrl = new URL(cookieRefError || "/login", "https://f.f");
  errorUrl.searchParams.set(
    "error",
    `Произошла неизвестная ошибка входа через ${authName}.`
  );

  await Promise.resolve()
    .then(() => {
      const dataUrl = getDataUrl(authType);
      const bodyData = getAuthBody(authType, req, successUrl);
      console.log(
        new Date(),
        `Получение данных ${authName}, ${dataUrl}, ${JSON.stringify(bodyData)}`
      );

      return fetch(dataUrl, {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
          "content-type": "application/json",
        },
      });
    })
    .then(async (response) => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.status === 200) {
          console.log(
            new Date(),
            `Успешная авторизация через ${authName} ${Object.keys(data[0])}`
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
      authType === "esia" && res.cookie("auth._esia", `${Date.now()}`);
      res.redirect(
        decodeURIComponent(
          `https://${hostname}${successUrl.pathname}${successUrl.search}`
        )
      );
    })
    .catch((error) => {
      console.error(`Ошибка авторизации через ${authName}`, error);
      res.redirect(`${errorUrl.pathname}${errorUrl.search}`);
    });
}
