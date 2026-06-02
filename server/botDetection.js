const {
  isWhitelistedPath,
  isExplicitBotByUA,
  hasBrowserLikeHeaders,
  sendJsChallenge,
  isTrustedAddress,
  isValidChallengeCookie,
} = require("./botDetection.helper");

module.exports = function botDetection(req, res, next) {
  let pathname = "/";

  try {
    const rawUrl = typeof req.originalUrl === "string" && req.originalUrl.length ? req.originalUrl : req.url || "/";

    pathname = new URL(rawUrl, "http://local").pathname || "/";
  } catch (err) {
    console.warn("[botDetection] invalid URL:", req.originalUrl || req.url, err.message);
    res.statusCode = 403;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Forbidden" }));
    return;
  }

  if (isWhitelistedPath(pathname) || (process.env.NODE_ENV === "production" && isTrustedAddress(req))) return next();

  const challengePassed = req.cookies && req.cookies.js_challenge_passed;
  if (isValidChallengeCookie(challengePassed)) {
    return next();
  }

  const explicitBot = isExplicitBotByUA(req);
  const isBrowserHeaders = hasBrowserLikeHeaders(req);

  if ((!explicitBot && isBrowserHeaders) || (req.method !== "GET" && req.method !== "HEAD")) return next();

  if (pathname.startsWith("/api/")) {
    res.statusCode = 403;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Forbidden" }));
    return;
  }

  return sendJsChallenge(req, res);
};
