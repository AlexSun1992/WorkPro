const fs = require("fs");
const path = require("path");
const net = require("net");

const challengePath = path.resolve(__dirname, "bot-challenge.html");
const chalengeTemplate = fs.readFileSync(challengePath, "utf-8");

const BOT_UA_REQUESTS =
  /(curl|wget|python-requests|go-http-client|libwww-perl|scrapy|httpclient|postmanruntime|insomnia|headlesschrome|phantomjs|puppeteer|playwright)/i;

const CHALLENGE_COOKIE_MAX_AGE_MS = 21600 * 1000; // 6 часов, как в Max-Age
const CLOCK_SKEW_MS = 60 * 1000; // 1 мин на рассинхрон

function isPrivateAddress(req) {
  const rawIp = req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress;

  if (!rawIp || typeof rawIp !== "string") {
    return false;
  }

  const ip = rawIp.trim();

  if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") {
    return true;
  }

  const ipv4 = ip.replace(/^::ffff:/, "");

  if (net.isIP(ipv4) !== 4) {
    return false;
  }

  return (
    ipv4 === "127.0.0.1" ||
    ipv4.startsWith("10.") ||
    ipv4.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ipv4)
  );
}

function isValidChallengeCookie(value) {
  if (typeof value !== "string") {
    return false;
  }

  if (!/^[a-z0-9]+\.[a-z0-9]+$/.test(value)) {
    return false;
  }

  if (value.length < 16 || value.length > 64) return false;

  const parts = value.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [tsPart, randomPart] = parts;

  if (tsPart.length < 7 || tsPart.length > 12) {
    return false;
  }

  if (randomPart.length < 6 || randomPart.length > 40) {
    return false;
  }

  const tsMs = parseInt(tsPart, 36);
  if (!Number.isFinite(tsMs)) {
    return false;
  }

  const now = Date.now();

  if (tsMs > now + CLOCK_SKEW_MS) {
    return false;
  }
  if (now - tsMs > CHALLENGE_COOKIE_MAX_AGE_MS + CLOCK_SKEW_MS) {
    return false;
  }

  return true;
}

function isWhitelistedPath(pathname) {
  return (
    pathname.startsWith("/_nuxt/") ||
    pathname.startsWith("/static/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/api/healthcheck" ||
    pathname === "/api/challenge/verify" ||
    pathname.startsWith("/sso") ||
    pathname.startsWith("/idesia")
  );
}

function getClientIp(req) {
  const rawIp = req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress || "";

  return rawIp.replace(/^::ffff:/, "");
}

function isTrustedAddress(req) {
  const ip = getClientIp(req);

  const TRUSTED_IPS = new Set(["127.0.0.1", "::1"]);

  return TRUSTED_IPS.has(ip);
}

function isExplicitBotByUA(req) {
  const userAgent = req.headers["user-agent"] || "";
  return !userAgent || BOT_UA_REQUESTS.test(userAgent);
}

function isLikelyWebView(req) {
  const ua = (req.headers["user-agent"] || "").toLowerCase();
  return (
    /\bwv\b/.test(ua) ||
    /; wv\)/.test(ua) ||
    /webview/.test(ua) ||
    /version\/\d+.*mobile.*safari/.test(ua) ||
    /fb_iab|fbav|instagram|line\//.test(ua)
  );
}

function hasBrowserLikeHeaders(req) {
  const headers = req.headers || {};
  const ua = headers["user-agent"] || "";
  const accept = (headers.accept || "").toLowerCase();

  const hasAccept = accept.includes("text/html") || accept.includes("application/json") || accept.includes("*/*");

  const hasAcceptLanguage = Boolean(headers["accept-language"]);
  const hasFetchHints =
    Boolean(headers["sec-fetch-site"]) || Boolean(headers["sec-fetch-mode"]) || Boolean(headers["sec-fetch-dest"]);

  const isMozillaLike = /\bmozilla\/\d/i.test(ua);
  const isWebView = isLikelyWebView(req);

  return hasAccept && (hasAcceptLanguage || isWebView) && (hasFetchHints || isMozillaLike || isWebView);
}
function sendJsChallenge(req, res) {
  const nextUrl = req.originalUrl || "/";
  const html = chalengeTemplate.replace("NEXT_URL", JSON.stringify(nextUrl));
  res.statusCode = 200;
  res.setHeader("content-type", "text/html;charset=utf-8");
  res.setHeader("cache-control", "no-store,no-cache,must-revalidate");
  res.end(html);
}
module.exports = {
  isPrivateAddress,
  isWhitelistedPath,
  isExplicitBotByUA,
  hasBrowserLikeHeaders,
  sendJsChallenge,
  isTrustedAddress,
  isValidChallengeCookie,
};
