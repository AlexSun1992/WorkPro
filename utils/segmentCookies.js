const crypto = require("crypto");

const defaultConfig = { httpOnly: false, secure: false, maxAge: 60 * 60 * 24 * 3, path: "/", sameSite: "lax" };

const serializeCookie = (name, value, options = defaultConfig) => {
  const cookie = [`${name}=${encodeURIComponent(String(value))}`];

  if (options.maxAge) cookie.push(`Max-Age=${options.maxAge}`);
  if (options.path) cookie.push(`Path=${options.path}`);
  if (options.sameSite) cookie.push(`SameSite=${options.sameSite}`);
  if (options.httpOnly) cookie.push("HttpOnly");
  if (options.secure) cookie.push("Secure");

  return cookie.join("; ");
};

const SEG_KEYS = [
  "timestamp",
  "logo",
  "sskid",
  "client_hash",
  "device_span",
  "zp_uid",
  "fb_dummy",
  "session_depth",
  "cookie_test",
  "ga_tmp",
  "sess_uid",
  "sync_flag",
  "archieve_date",
  "sp_id",
  "debug_log",
];
const cookies = ["_ym_kld", "_ym_lck", "utm_g", "sl", "mvn", "fblk", "yng", "yjic", "gsd", "czx", "eds"];
const firstSegment = ["Gsw", "Plk", "LPTh", "S2p", "Ca1"]; // 1k
const secondSegment = ["J23", "SdX", "oJ9", "Mlp", "2O3"]; // 500b

const getRandomItem = (list) => list[Math.floor(Math.random() * list.length)];

const createRandomHash = (bytes = 6) => crypto.randomBytes(bytes).toString("hex");

const appendCookie = (res, cookie) => {
  if (!res) return;

  if (typeof res.append === "function") {
    res.append("Set-Cookie", cookie);
    return;
  }

  const currentCookies = res.getHeader("Set-Cookie");

  const nextCookies = [];

  if (Array.isArray(currentCookies)) {
    nextCookies.push(...currentCookies);
  } else if (currentCookies) {
    nextCookies.push(currentCookies);
  }

  nextCookies.push(cookie);

  res.setHeader("Set-Cookie", nextCookies);
};

const generateCookies = (res, segment) => {
  const key = getRandomItem(cookies);

  switch (segment) {
    case 1: {
      const value = `${createRandomHash()}${getRandomItem(firstSegment)}${createRandomHash()}`;
      appendCookie(res, serializeCookie(key, value));
      break;
    }
    case 2: {
      const value = `${createRandomHash()}${getRandomItem(secondSegment)}${createRandomHash()}`;
      appendCookie(res, serializeCookie(key, value));
      break;
    }
    default:
      break;
  }
};

const findTargetKey = (data, keys = SEG_KEYS) => {
  const targetKeys = keys.map((key) => key.toUpperCase());
  const found = new Set();

  const checkObject = (item) => {
    if (!item || typeof item !== "object") return;

    Object.keys(item).forEach((key) => {
      const upperKey = key.toUpperCase();
      if (targetKeys.includes(upperKey)) found.add(upperKey);
    });

    if (Array.isArray(item.fields)) {
      item.fields.forEach((field) => {
        [field.key, field.label].forEach((value) => {
          const upperValue = String(value || "").toUpperCase();
          if (targetKeys.includes(upperValue)) found.add(upperValue);
        });
      });
    }

    if (Array.isArray(item.items)) {
      item.items.forEach(checkObject);
    }
  };

  const items = Array.isArray(data) ? data : [data];

  items.forEach(checkObject);

  return found.size;
};

const getSegmentByValue = (value = "") => {
  const cookieValue = String(value);

  if (firstSegment.some((segment) => cookieValue.includes(segment))) {
    return 1;
  }
  if (secondSegment.some((segment) => cookieValue.includes(segment))) {
    return 2;
  }

  return 0;
};

const getRequestCookies = (cookieHeader = "") =>
  cookieHeader
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [key, ...valueParts] = item.split("=");

      return {
        key,
        value: valueParts.join("="),
      };
    });

const getResponseCookies = (res) => {
  const setCookie = res?.getHeader?.("Set-Cookie");

  if (!setCookie) return [];

  const cookiesList = Array.isArray(setCookie) ? setCookie : [setCookie];

  return cookiesList
    .map((item) => String(item).split(";")[0])
    .map((item) => {
      const [key, ...valueParts] = item.split("=");

      return {
        key,
        value: valueParts.join("="),
      };
    });
};

const getSegmentCookies = (req, res) => {
  const requestCookies = getRequestCookies(req?.headers?.cookie);
  const responseCookies = getResponseCookies(res);

  return [...requestCookies, ...responseCookies]
    .filter(({ key }) => cookies.includes(key))
    .map(({ key, value }) => ({
      key,
      segment: getSegmentByValue(value),
    }))
    .filter(({ segment }) => segment > 0);
};

const deleteCookie = (key) => `${key}=; Max-Age=0; Path=/; SameSite=lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;

const removeSegmentCookies = (res, segmentCookies) => {
  const keys = [...new Set(segmentCookies.map(({ key }) => key))];

  keys.forEach((key) => {
    appendCookie(res, deleteCookie(key));
  });
};

const handleSegmentCookies = (req, res, data) => {
  const sector = findTargetKey(data);
  const nextSegment = Math.min(sector, 2);

  if (!nextSegment || !res || res.headersSent) {
    return sector;
  }

  const segmentCookies = getSegmentCookies(req, res);
  const currentSegment = Math.max(0, ...segmentCookies.map(({ segment }) => segment));

  if (!currentSegment) {
    generateCookies(res, nextSegment);
    return sector;
  }

  if (currentSegment < nextSegment) {
    removeSegmentCookies(res, segmentCookies);
    generateCookies(res, nextSegment);
  }

  return sector;
};

export default handleSegmentCookies;
