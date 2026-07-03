import requestIp from "request-ip";

const defaultHeaders = ["user-agent", "session-info", "is-private", "cookie", "referer"];

const getAuthorization = (req) => {
  if (req.query.zone === "free") {
    return null;
  }
  return req.headers.authorization || req?.cookies["auth._token.local"];
};

const setCommonHeaders = (req) => {
  const headers = {};
  const ipAddress = requestIp.getClientIp(req);

  defaultHeaders.forEach((key) => {
    if (req.headers[key]) {
      headers[key] = req.headers[key];
    }
  });

  if (ipAddress) {
    headers["x-forwarded-for"] = ipAddress || null;
  }
  headers["X-Application"] = req.cookies.isWebview ? "isWebview" : "VueJS";

  const authToken = getAuthorization(req);

  if (authToken) {
    headers.Authorization = authToken;
  }

  return headers;
};

export default setCommonHeaders;
